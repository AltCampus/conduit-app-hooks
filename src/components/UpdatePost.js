import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';

import Error from './Error';
import { singleArticleURL } from '../utils/constant';
import Loading from './Loading';
import useFetch from '../customHooks/useFetch';

function UpdatePost(props) {
  const initialArticle = {
    title: '',
    body: '',
    tagList: [],
    description: '',
    error: '',
  };

  const initialError = {
    title: '',
    body: '',
    tagList: '',
    description: '',
  };

  const [articleInfo, setArticleInfo] = useState(initialArticle);
  const [error, setError] = useState(initialError);

  const { makeApiCall, error: fetchError, isLoading } = useFetch();

  useEffect(() => {
    fetchArticle(singleArticleURL + props.match.params.slug, 'GET');
  }, []);

  const fetchArticle = async (url, method, body) => {
    let { article } = await makeApiCall(url, method, body);
    if (method === 'GET') {
      setArticleInfo({
        title: article.title,
        body: article.body,
        description: article.description,
        tagList: article.tagList,
        error: '',
      });
    } else {
      setArticleInfo({
        title: '',
        body: '',
        description: '',
        tagList: '',
        error: '',
      });
      props.history.push('/article/' + article.slug);
    }
  };

  const handleChange = (event) => {
    let { name, value } = event.target;
    if (!value) {
      setError({ ...error, [name]: "Can't be empty" });
    } else {
      setError({ ...error, [name]: '' });
    }
    setArticleInfo({ ...articleInfo, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let { title, body, description, tagList, error } = articleInfo;
    let slug = props.match.params.slug;
    if (title && body && description && tagList) {
      if (typeof tagList === 'string') {
        tagList = tagList.split(',').map((tag) => tag.trim());
      }
      fetchArticle(
        singleArticleURL + slug,
        'PUT',
        JSON.stringify({ article: { title, body, description, tagList } })
      );
    } else {
      if (!title) {
        error.title = "Title Can't be Empty";
      }
      if (!body) {
        error.body = "Body Can't be Empty";
      }
      if (!description) {
        error.description = "Description Can't be Empty";
      }
      if (!tagList) {
        error.tagList = "TagList Can't be Empty";
      }
      setError({ ...error });
    }
  };

  let { title, body, tagList, description } = articleInfo;

  if (fetchError) return <Error error={fetchError} />;
  if (isLoading) return <Loading />;

  return (
    <div className='new-post'>
      <form className='new-post-form' onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          className='input-article input-article-title'
          name='title'
          type='text'
          placeholder='Article Title'
          value={title}
        />
        <h2 className='err-msg'>{error.title ? error.title : ''}</h2>
        <input
          name='body'
          className='input-article input-article-body'
          type='text'
          onChange={handleChange}
          placeholder={`What's this article about?`}
          value={body}
        />
        <h2 className='err-msg'>{error.body ? error.body : ''}</h2>
        <textarea
          name='description'
          onChange={handleChange}
          className='input-article  input-article-description'
          value={description}
          placeholder={`Write your article (in markdown)`}
        ></textarea>
        <h2 className='err-msg'>
          {error.description ? error.description : ''}
        </h2>
        <input
          name='tagList'
          type='text'
          className='input-article  input-article-body'
          placeholder='Enter Tags'
          value={tagList}
          onChange={handleChange}
        />
        <h2 className='err-msg'>{error.tagList ? error.tagList : ''}</h2>
        <input
          type='submit'
          value='Update Article'
          className='publish-article pointer'
        />
      </form>
    </div>
  );
}

export default withRouter(UpdatePost);
