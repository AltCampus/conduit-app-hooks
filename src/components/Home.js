import React from 'react';
import Loading from './Loading';
import { FaHeart } from 'react-icons/fa';
import { withRouter } from 'react-router-dom';
import Error from './Error';
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedToggle: ['Global Feed'],
      allArticles: [],
      articles: [],
      pageNo: 1,
      totalPages: [1],
    };
  }

  componentDidMount() {
    this.getAllArticles();
  }

  getAllArticles = () => {
    fetch('https://mighty-oasis-08080.herokuapp.com/api/articles')
      .then((res, err) => {
        if (err) return <Error error={err} />;
        return res.json();
      })
      .then((data) => {
        this.setState({ allArticles: data.articles }, this.setArticles);
        this.getAllTags(data.articles);
      });
  };

  getAllTags = (allArticles) => {
    let { allTags } = this.state;
    if (allArticles) {
      allTags = allArticles.reduce((a, b) => {
        a = a.concat(b.tagList);
        return a;
      }, []);
      let all = [...allTags].sort();
      let final = [...allTags].sort().filter((tag, i) => {
        if (tag !== all[i + 1]) {
          return tag;
        }
      });
      allTags = final;
    }
    this.setState({ allTags });
  };

  setArticles = () => {
    let { articles, allArticles, totalPages } = this.state;
    articles = allArticles;
    if (this.state.feedToggle[1]) {
      articles = articles.filter((article) => {
        return article.tagList.includes(this.state.feedToggle[1]);
      });
      if (articles.length > 10) {
        totalPages = this.getPaginationArray(articles);
      } else {
        totalPages = [1];
      }
    }
    if (articles.length > 10) {
      articles = this.handleArticlesOnPage(allArticles);
      totalPages = this.getPaginationArray(allArticles.length);
    }

    this.setState(
      {
        articles,
        allArticles,
        totalPages,
      },
      this.getAllTags
    );
  };

  handleGlobalToggle = () => {
    let { feedToggle } = this.state;
    feedToggle.splice(1, 1);
    this.setState({ feedToggle }, this.setArticles);
  };

  handleFeedToggle = (val) => {
    let { feedToggle } = this.state;
    feedToggle[1] = val;
    this.setState({ feedToggle }, this.setArticles);
  };

  handleClick = (slug) => {
    this.props.history.push(`/article/${slug}`);
  };

  getPaginationArray = (length) => {
    let index = Math.ceil(length / 10);
    let pageArray = [];
    for (let i = 1; i <= index; i++) {
      pageArray.push(i);
    }
    return pageArray;
  };

  handleArticlesOnPage = (articles) => {
    return articles.filter((article, index) => {
      if (
        index < this.state.pageNo * 10 &&
        index >= this.state.pageNo * 10 - 10
      ) {
        return article;
      }
    });
  };

  handleChangePageNo = (val) => {
    this.setState({ pageNo: val }, this.setArticles);
  };

  render() {
    let allTags = this.state.allTags ? this.state.allTags : [];
    let articles = this.state.articles;

    return (
      <>
        <section id='hero-section'>
          <h1 className='hero-heading'>conduit</h1>
          <h2 className='hero-subheading'>A place to share your knowledge.</h2>
        </section>
        <section id='main'>
          <div className='container'>
            <div className='row flex space-btw'>
              <div className='feed'>
                <div className='feed-toggle'>
                  <ul className='flex gap-1'>
                    <li
                      key={1}
                      className={
                        this.state.feedToggle.length > 1
                          ? 'global-feed'
                          : 'global-feed activeToggle'
                      }
                      onClick={this.handleGlobalToggle}
                    >
                      {this.state.feedToggle[0]}
                    </li>
                    {this.state.feedToggle.length > 1 ? (
                      <li key={2} className='global-feed activeToggle'>
                        #{this.state.feedToggle[1]}
                      </li>
                    ) : (
                      ''
                    )}
                  </ul>
                </div>
                <ul className='feed-list-holder'>
                  {articles.length ? (
                    articles.map((e, i) => (
                      <Article
                        key={i}
                        article={e}
                        handleClick={this.handleClick}
                      />
                    ))
                  ) : (
                    <Loading />
                  )}
                </ul>
              </div>
              <div className='tags'>
                <h3 className='tags-heading'>Popular Tags</h3>
                <ul className='tag-list-holder flex gap-half wrap'>
                  {allTags.length ? (
                    allTags.map((tag, i) => {
                      return (
                        <li
                          key={i}
                          className={
                            this.state.feedToggle[1] === tag
                              ? 'tag active-tag'
                              : 'tag'
                          }
                          onClick={() => this.handleFeedToggle(tag)}
                        >
                          {tag}
                        </li>
                      );
                    })
                  ) : (
                    <Loading />
                  )}
                </ul>
              </div>
            </div>
            {this.state.totalPages.length > 1 ? (
              <Pagination
                totalPages={this.state.totalPages}
                pageNo={this.state.pageNo}
                handleChangePageNo={this.handleChangePageNo}
              />
            ) : (
              ''
            )}
          </div>
        </section>
      </>
    );
  }
}

function Pagination(props) {
  return (
    <div className=''>
      <ul className='pagination-holder flex'>
        {props.totalPages.map((no) => {
          return (
            <button
              key={no}
              onClick={() => props.handleChangePageNo(no)}
              className={props.pageNo === no ? 'activePageNo' : 'pageNo'}
            >
              {no}
            </button>
          );
        })}
      </ul>
    </div>
  );
}

class Article extends React.Component {
  updatedDate = (val) => {
    let newDate = new Date(val);
    return newDate.toDateString();
  };

  render() {
    let { article } = this.props;
    return !article ? (
      <Loading />
    ) : (
      <li className='single-article'>
        <div className='flex space-btw'>
          <div className='img-author-holder flex gap-half'>
            <img
              className='author-img'
              src={article.author.image}
              alt={article.author.username}
            />
            <div className=''>
              <h3 className='author-name'>{article.author.username}</h3>
              <span className='date'>
                {this.updatedDate(article.updatedAt)}
              </span>
            </div>
          </div>
          <div className='likes-count-holder'>
            <FaHeart className='heart' />
            <span className='likes'>{article.favoritesCount}</span>
          </div>
        </div>
        <div className='padd-1'>
          <h2
            onClick={() => this.props.handleClick(article.slug)}
            className='article-title'
          >
            {article.title}
          </h2>
          <p
            onClick={() => this.props.handleClick(article.slug)}
            className='article-description'
          >
            {article.description.substring(0, 100)}...
          </p>
        </div>
        <div className='flex space-btw'>
          <button
            onClick={() => this.props.handleClick(article.slug)}
            className='read-more'
          >
            Read more...
          </button>
          <div className='flex gap-half'>
            {article.tagList.map((tag) => {
              return (
                <button
                  key={tag}
                  className='test'
                  onClick={() => this.props.handleClick(article.slug)}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </li>
    );
  }
}

export default withRouter(Home);
