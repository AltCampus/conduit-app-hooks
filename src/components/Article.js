import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

class Article extends React.Component {
  updatedDate = (val) => {
    let newDate = new Date(val);
    return newDate.toDateString();
  };

  render() {
    let article = this.props.article;
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
              <Link to={`/profiles/${article.author.username}`}>
                <h3 className='author-name'>{article.author.username}</h3>
              </Link>
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
