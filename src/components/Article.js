import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { singleArticleURL, localStorageKey } from '../utils/constant';
import Loading from './Loading';

class Article extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      article: [],
    };
  }

  componentDidMount() {
    this.getArticle();
  }

  getArticle = () => {
    this.setState({ article: this.props.article });
  };

  updatedDate = (val) => {
    let newDate = new Date(val);
    return newDate.toDateString();
  };

  render() {
    let article = this.state.article;
    if (!article.author) return <Loading />;
    return (
      <li className='single-article'>
        <div className='flex space-btw'>
          <div className='img-author-holder flex gap-half'>
            <img
              className='author-img'
              src={article.author.image}
              alt={article.author.username}
            />
            <div className=''>
              <Link to={`/profile/${article.author.username}`}>
                <h3 className='author-name'>{article.author.username}</h3>
              </Link>
              <span className='date'>
                {this.updatedDate(article.updatedAt)}
              </span>
            </div>
          </div>
          <div
            onClick={() =>
              this.props.likeArticle(article.favorited, article.slug)
            }
            className='likes-count-holder'
          >
            {article.favorited ? (
              <i className='ion-android-favorite' />
            ) : (
              <i className='ion-android-favorite-outline' />
            )}
            <span className='likes'>{article.favoritesCount}</span>
          </div>
        </div>
        <Link to={`/article/${article.slug}`}>
          <div className='padd-1'>
            <h2 className='article-title'>{article.title}</h2>
            <p className='article-description'>
              {article.description.substring(0, 100)}...
            </p>
          </div>
        </Link>
        <div className='flex space-btw'>
          <Link to={`/article/${article.slug}`}>
            <button className='read-more'>Read more...</button>
          </Link>
          <Link to={`/article/${article.slug}`}>
            <div className='flex gap-half'>
              {article.tagList.map((tag) => {
                return (
                  <button key={tag} className='test'>
                    {tag}
                  </button>
                );
              })}
            </div>
          </Link>
        </div>
      </li>
    );
  }
}

export default Article;
