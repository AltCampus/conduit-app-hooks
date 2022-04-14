import React from 'react';
import { articlesURL } from '../utils/constant';
import Article from './Article';
import Error from './Error';
import Loading from './Loading';

function Posts(props) {
  let articles = props.articles;
  if (!articles) return <Loading />;
  return (
    <ul className='feed-list-holder'>
      {articles.map((article, i) => {
        return <Article key={article.slug} article={article} />;
      })}
    </ul>
  );
}

export default Posts;
