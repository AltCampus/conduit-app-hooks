import React, { useContext, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';

import Loading from './Loading';
import Error from './Error';
import Comment from './Comment';
import { singleArticleURL } from '../utils/constant';
import LoginUserContext from '../ContextAPI/LoginUserContext';
import useFetch from '../customHooks/useFetch';

function SingleArticle(props) {
  const [article, setArticles] = useState(null);

  const contextInfo = useContext(LoginUserContext);

  const { makeApiCall, error: fetchError, isLoading } = useFetch();

  useEffect(() => {
    fetchArticle(singleArticleURL + props.match.params.slug, 'GET');
  }, [props]);

  const fetchArticle = async (url, method) => {
    let data = await makeApiCall(url, method);
    if (method === 'GET') {
      setArticles(data.article);
    } else {
      props.history.push('/');
    }
  };

  const handleDeleteArticle = () => {
    let slug = props.match.params.slug;
    fetchArticle(singleArticleURL + slug, 'DELETE');
  };

  const handleEdit = () => {
    let { slug } = article;
    props.history.push({
      pathname: `/article/edit/${slug}`,
    });
  };

  const updatedDate = (val) => {
    let newDate = new Date(val);
    return newDate.toDateString();
  };

  if (fetchError) return <Error error={fetchError} />;

  if (isLoading) return <Loading />;

  return (
    <div className=''>
      <section id='single-art-hero'>
        <div className='container'>
          <h1 className='hero-heading single-art-heading'>{article.title}</h1>
          <div className='flex gap-2 align-center'>
            <div className='img-author-holder padd-1 flex gap-half align-center'>
              <img
                className='author-img'
                src={article.author.image}
                alt={article.author.username || 'user-img'}
              />
              <div className=''>
                <Link to={`/profile/${article.author.username}`}>
                  <h3 className='author-name'>{article.author.username}</h3>
                </Link>
                <span className='date single-art-date '>
                  {updatedDate(article.updatedAt)}
                </span>
              </div>
            </div>
            {contextInfo.user &&
            article.author.username === contextInfo.user.username ? (
              <div className='flex gap-2'>
                <button onClick={handleEdit} className='edit-article pointer'>
                  <i className='ion-edit'></i>
                  Edit Article
                </button>
                <button
                  onClick={handleDeleteArticle}
                  className='delete-article pointer'
                >
                  <i className='ion-trash-a'></i>
                  Delete Article
                </button>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </section>
      <div className='container'>
        <section className='single-art-holder'>
          <p className='single-art-description'>{article.body}</p>
          <ul className='flex gap-half'>
            {article.tagList.map((tag) => {
              return (
                <li className='tag test single-art-tag' key={tag}>
                  {tag}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
      <section className='comment-section'>
        <div className='container'>
          {!contextInfo.isUserLoggedIn ? (
            <p className='padd-1'>
              <Link to='/login'>Sign in</Link> or{' '}
              <Link to='/register'>Sign up</Link> to add comments on this
              article
            </p>
          ) : (
            <Comment user={contextInfo.user} slug={article.slug} />
          )}
        </div>
      </section>
    </div>
  );
}

export default withRouter(SingleArticle);
