import React, { useState } from 'react';
import { withRouter } from 'react-router';

import Error from './Error';
import { articlesURL } from '../utils/constant';
import useFetch from '../customHooks/useFetch';
import Loading from './Loading';

function NewPost(props) {
  const initialState = {
    title: '',
    body: '',
    tagList: '',
    description: '',
    error: '',
    errors: {
      title: '',
      body: '',
      tagList: '',
      description: '',
    },
  };

  const [articleInfo, setArticleInfo] = useState(initialState);

  // const controller = new AbortController();

  let { makeApiCall, error } = useFetch();

  let postArticle = async () => {
    let { title, body, description, tagList } = articleInfo;
    tagList = tagList.split(',').map((tag) => tag.trim());

    let data = await makeApiCall(
      articlesURL,
      'POST',
      JSON.stringify({ article: { title, body, description, tagList } })
    );

    setArticleInfo({
      ...articleInfo,
      title: '',
      body: '',
      description: '',
      tagList: '',
    });
    props.history.push('/article/' + data.article.slug);
  };

  const handleChange = (event) => {
    let { name, value } = event.target;
    if (!value) {
      articleInfo.errors[name] = "Can't be empty";
      setArticleInfo({ ...articleInfo, [name]: '' });
    } else {
      articleInfo.errors[name] = '';
      setArticleInfo({ ...articleInfo, [name]: value });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let { title, body, description, tagList } = articleInfo;

    if (title && body && description && tagList) {
      postArticle();
    } else {
      if (!title) {
        articleInfo.errors.title = "Title Can't be Empty";
      }
      if (!body) {
        articleInfo.errors.body = "Body Can't be Empty";
      }
      if (!description) {
        articleInfo.errors.description = "Description Can't be Empty";
      }
      if (!tagList) {
        articleInfo.errors.tagList = "TagList Can't be Empty";
      }
      setArticleInfo({ ...articleInfo });
    }
  };

  let { title, body, tagList, description, errors } = articleInfo;

  if (!articleInfo) return <Loading />;

  if (error) return <Error error={error} />;
  return (
    <div className='new-post'>
      <form className='new-post-form' onSubmit={handleSubmit}>
        <h2 className='setting-heading'>Add New Article</h2>
        <input
          onChange={handleChange}
          className=' input-article input-article-title'
          name='title'
          type='text'
          placeholder='Article Title'
          value={title}
          autoComplete={'current-title'}
        />
        <h2 className='err-msg new-article-err-msg'>
          {errors.title ? errors.title : ''}
        </h2>
        <input
          name='body'
          className='input-article input-article-body'
          type='text'
          onChange={handleChange}
          placeholder={`What's this article about?`}
          value={body}
          autoComplete={'current-body'}
        />
        <h2 className='err-msg'>{errors.body ? errors.body : ''}</h2>
        <textarea
          name='description'
          onChange={handleChange}
          className='input-article input-article-description'
          value={description}
          placeholder={`Write your article (in markdown)`}
          autoComplete={'current-description'}
        ></textarea>
        <h2 className='err-msg new-article-err-msg'>
          {errors.description ? errors.description : ''}
        </h2>
        <input
          name='tagList'
          type='text'
          className='input-article input-article-body'
          placeholder='Enter Tags'
          value={tagList}
          onChange={handleChange}
          autoComplete={'current-tagList'}
        />
        <h2 className='err-msg new-article-err-msg'>
          {errors.tagList ? errors.tagList : ''}
        </h2>
        <input
          type='submit'
          value='Publish Article'
          className='publish-article pointer'
        />
      </form>
    </div>
  );
}

export default withRouter(NewPost);
