import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { articlesURL, getProfile, singleArticleURL } from '../utils/constant';
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
    this.getUser();
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.feedSelected !== this.state.feedSelected) {
      this.getArticles();
    }
  }

  getUser = () => {
    let user = this.props.match.params;
    fetch(getProfile + user.username)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Profile couldnot fetched');
        }
        return res.json();
      })
      .then(({ profile }) => {
        this.setState({ profile });
      })
      .catch((error) => this.setState({ error }));
  };

  getArticles = () => {
    let limit = this.state.articlesPerPage;
    let offset = (this.state.activePageIndex - 1) * 10;
    let user = this.props.match.params;
    let token = this.props.user ? this.props.user.token : '';
    fetch(
      `${articlesURL}?${this.state.feedSelected}=${user.username}&offset=${offset}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
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

  followUser = () => {
    let profile = this.state.profile;
    let token = this.props.user.token;
    fetch(`${getProfile}/${profile.username}/follow`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Profile couldnot fetched');
        }
        return res.json();
      })
      .then(({ profile }) => {
        this.setState({ profile });
      })
      .catch((error) => this.setState({ error }));
  };

  unfollowUser = () => {
    let profile = this.state.profile;
    let token = this.props.user.token;
    fetch(`${getProfile}/${profile.username}/follow`, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
        'Content-type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Profile couldnot fetched');
        }
        return res.json();
      })
      .then(({ profile }) => {
        this.setState({ profile });
      })
      .catch((error) => this.setState({ error }));
  };

  likeArticle = (favourted, slug) => {
    let isUserLoggedIn = this.props.isUserLoggedIn;
    let method = favourted === true ? 'DELETE' : 'POST';
    let token = this.props.user ? this.props.user.token : '';
    if (isUserLoggedIn) {
      fetch(`${singleArticleURL}/${slug}/favorite`, {
        method: method,
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then(({ errors }) => {
              return Promise.reject(errors);
            });
          }
          return res.json();
        })
        .then(({ article }) => {
          if (this.state.feedSelected === 'myFeed') {
            this.myFeed();
          } else {
            this.getArticles();
          }
        })
        .catch((error) => this.setState({ error }));
    }
  };

  render() {
    let { articlesCount, articlesPerPage, activePageIndex } = this.state;
    if (this.state.error) return <Error error={this.state.error} />;
    return (
      <div className='profile-holder'>
        <Banner
          profile={this.state.profile}
          user={this.props.user}
          followUser={this.followUser}
          unfollowUser={this.unfollowUser}
        />
        <div className='container'>
          <ProfileFeedNav
            feedSelected={this.state.feedSelected}
            handleFeedSelected={this.handleFeedSelected}
          />
          <Posts
            articles={this.state.articles}
            user={this.props.user}
            likeArticle={this.likeArticle}
          />
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
      {!props.user ? (
        ''
      ) : props.user && props.profile.username !== props.user.username ? (
        !props.profile.following ? (
          <button onClick={props.followUser} className='follow-user'>
            <i className='ion-plus-round'></i>
            Follow user
          </button>
        ) : (
          <button
            onClick={props.unfollowUser}
            className='follow-user unFollow-user'
          >
            <i className='ion-plus-round'></i>
            UnFollow user
          </button>
        )
      ) : (
        <Link to='/setting'>
          <button className='follow-user'>
            <i className='ion-ios-gear'></i>
            Edit UserInfo Settings
          </button>
        </Link>
      )}
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
