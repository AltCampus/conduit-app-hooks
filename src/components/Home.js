import React from 'react';
import { withRouter } from 'react-router-dom';

import Error from './Error';
import Posts from './Posts';
import Sidebar from './Sidebar';
import FeedNav from './FeedNav';
import Pagination from './Pagination';
import { articlesURL, feedURL, singleArticleURL } from '../utils/constant';
import LoginUserContext from '../ContextAPI/LoginUserContext';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      articlesCount: 0,
      articlesPerPage: 10,
      activePageIndex: 1,
      activeTag: '',
      feedSelected: '',
      error: '',
    };
    this.contextInfo = null;
  }

  emptyTab = () => {
    this.setState({ activeTag: '' });
  };

  addTab = (val) => {
    this.setState({ activeTag: val, activePageIndex: 1 });
  };

  changeFeedSelected = (val) => {
    this.setState({ feedSelected: val, activePageIndex: 1 }, () => {
      this.state.feedSelected === 'myFeed' ? this.myFeed() : this.getArticles();
    });
  };

  componentDidMount() {
    let isLoggedIn = this.contextInfo.isUserLoggedIn;
    if (isLoggedIn) {
      this.setState({ feedSelected: 'myFeed' }, this.myFeed());
    } else {
      this.setState({ feedSelected: 'globalFeed' }, this.getArticles());
    }
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.activeTag !== this.state.activeTag) {
      this.getArticles();
    }
    if (
      !this.contextInfo.isUserLoggedIn &&
      _prevProps.isUserLoggedIn !== this.contextInfo.isUserLoggedIn
    ) {
      this.getArticles();
    }
  }

  getArticles = () => {
    let limit = this.state.articlesPerPage;
    let offset = (this.state.activePageIndex - 1) * 10;
    let tag = this.state.activeTag;
    let token = this.contextInfo.user ? this.contextInfo.user.token : '';
    fetch(
      articlesURL +
        `/?offset=${offset}&limit=${limit}` +
        (tag && `&tag=${tag}`),
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Token ${token}`,
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
      .catch((err) => this.setState({ error: err }));
  };

  myFeed = () => {
    let limit = this.state.articlesPerPage;
    let offset = (this.state.activePageIndex - 1) * 10;
    let token = this.contextInfo.user.token;
    fetch(feedURL + `/?offset=${offset}&limit=${limit}`, {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
        'Content-type': 'application/json',
      },
    })
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
          feedSelected: 'myFeed',
          tagSelected: '',
          error: '',
        });
      })
      .catch((err) => this.setState({ error: err }));
  };

  updateCurrentPageIndex = (val) => {
    this.setState(
      { activePageIndex: val },
      this.state.feedSelected === 'myFeed' ? this.myFeed : this.getArticles
    );
  };

  likeArticle = (favourted, slug) => {
    let isUserLoggedIn = this.contextInfo.isUserLoggedIn;
    let method = favourted === true ? 'DELETE' : 'POST';
    let token = this.contextInfo.user ? this.contextInfo.user.token : '';
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
          if (this.state.feedSelected === 'myFeed' && !this.state.activeTag) {
            this.myFeed();
          } else {
            this.getArticles();
          }
        })
        .catch((error) => this.setState({ error }));
    }
  };

  static contextType = LoginUserContext;

  render() {
    let {
      articles,
      articlesCount,
      articlesPerPage,
      activePageIndex,
      activeTag,
      error,
    } = this.state;

    this.contextInfo = this.context;

    if (error) return <Error error={error} />;
    return (
      <main>
        <Banner />
        <section id='main'>
          <div className='container'>
            <div className='row flex space-btw'>
              <div className='feed'>
                <FeedNav
                  activeTag={activeTag}
                  emptyTab={this.emptyTab}
                  changeFeedSelected={this.changeFeedSelected}
                  feedSelected={this.state.feedSelected}
                />
                <Posts
                  articles={articles || []}
                  likeArticle={this.likeArticle}
                />
                {articlesCount > 10 ? (
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
              <Sidebar addTab={this.addTab} activeTag={activeTag} />
            </div>
          </div>
        </section>
      </main>
    );
  }
}

function Banner() {
  return (
    <section id='hero-section'>
      <h1 className='hero-heading'>Blog App</h1>
      <h2 className='hero-subheading'>A place to share your knowledge.</h2>
    </section>
  );
}

export default withRouter(Home);
