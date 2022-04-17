import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { articlesURL, getProfile } from '../utils/constant';
import Posts from './Posts';
import Loading from './Loading';
import Pagination from './Pagination';
import Error from './Error';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: null,
      articlesCount: 0,
      articlesPerPage: 10,
      activePageIndex: 1,
      feedSelected: 'author',
      error: '',
      profile: null,
    };
  }

  handleFeedSelected = (val) => {
    this.setState({ feedSelected: val });
  };

  componentDidMount() {
    this.getArticles();
    this.getProfile();
  }

  getProfile = () => {
    fetch(getProfile + this.props.match.params.username)
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        }
        return res.json();
      })
      .then(({ profile }) => {
        this.setState({ profile });
      })
      .catch((error) => console.log(error));
  };
  componentDidUpdate(_prevProps, prevState) {
    if (prevState.feedSelected !== this.state.feedSelected) {
      this.getArticles();
    }
  }

  getArticles = () => {
    let limit = this.state.articlesPerPage;
    let offset = (this.state.activePageIndex - 1) * 10;
    // let user = this.props.user;
    let user = this.props.match.params;

    fetch(
      `${articlesURL}?${this.state.feedSelected}=${user.username}&offset=${offset}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Token ${user.token}`,
          'Content-type': 'application/json',
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          articles: data.articles,
          articlesCount: data.articlesCount,
          error: '',
        });
      })
      .catch((error) => this.setState({ error }));
  };

  updateCurrentPageIndex = (val) => {
    this.setState({ activePageIndex: val }, this.getArticles);
  };

  render() {
    let { articlesCount, articlesPerPage, activePageIndex } = this.state;
    if (this.state.error) return <Error error={this.state.error} />;
    return (
      <div className='profile-holder'>
        <Banner profile={this.state.profile} />
        <div className='container'>
          <ProfileFeedNav
            feedSelected={this.state.feedSelected}
            handleFeedSelected={this.handleFeedSelected}
          />
          <Posts articles={this.state.articles} />
          {this.state.articlesCount > 10 ? (
            <Pagination
              articlesCount={articlesCount}
              articlesPerPage={articlesPerPage}
              activePageIndex={activePageIndex}
              updateCurrentPageIndex={this.updateCurrentPageIndex}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}

function Banner(props) {
  if (props.profile === null) return <Loading />;
  return (
    <section id='user-profile-hero-section'>
      <img
        className='user-profile-image'
        src={props.profile.image}
        alt={'image'}
      />
      <h2 className='user-profile-name'>{props.profile.username}</h2>
      <h3 className='user-profile-bio'>{props.profile.bio}</h3>
      <Link to='/setting'>
        <button className='follow-user'>
          <i className='ion-plus-round'></i>
          Follow user
        </button>
      </Link>
    </section>
  );
}

function ProfileFeedNav(props) {
  return (
    <div className='feed-toggle padd-1'>
      <ul className='flex gap-1'>
        <li
          key={1}
          onClick={() => props.handleFeedSelected('author')}
          className={
            props.feedSelected === 'author'
              ? 'global-feed activeToggle'
              : 'global-feed'
          }
        >
          #My Articles
        </li>
        <li
          key={2}
          onClick={() => props.handleFeedSelected('favorited')}
          className={
            props.feedSelected === 'favorited'
              ? 'global-feed activeToggle'
              : 'global-feed'
          }
        >
          #Favourited Articles
        </li>
      </ul>
    </div>
  );
}

export default withRouter(Profile);
