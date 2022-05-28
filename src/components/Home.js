import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import Error from './Error';
import Posts from './Posts';
import Sidebar from './Sidebar';
import FeedNav from './FeedNav';
import Pagination from './Pagination';
import { articlesURL, feedURL, singleArticleURL } from '../utils/constant';
import LoginUserContext from '../ContextAPI/LoginUserContext';
import useFetch from '../customHooks/useFetch';

function Home(props) {
  let contextInfo = useContext(LoginUserContext);

  const [articles, setArticles] = useState([]);
  const [articlesCount, setArticlesCount] = useState(0);
  const [articlesPerPage] = useState(10);
  const [activePageIndex, setActivePageIndex] = useState(1);
  const [activeTag, setActiveTag] = useState('');
  const [feedSelected, setFeedSelected] = useState('');

  let limit = articlesPerPage;
  let offset = (activePageIndex - 1) * 10;
  let tag = activeTag;

  let { makeApiCall, error } = useFetch();

  useEffect(() => {
    let isLoggedIn = contextInfo.isUserLoggedIn;

    if (isLoggedIn && activeTag === '' && feedSelected === '') {
      getArticles('url', 'GET', 'myFeed');
    } else if (feedSelected === 'myFeed' && activeTag === '') {
      getArticles('url', 'GET', 'myFeed');
    } else {
      getArticles('url' + (tag && `&tag=${tag}`), 'GET', 'globalFeed');
    }
  }, [activeTag, feedSelected, activePageIndex]);

  let getArticles = async (url, method = 'GET', feed) => {
    if (feed === 'myFeed') {
      url = feedURL + `/?offset=${offset}&limit=${limit}`;
    } else {
      url =
        articlesURL +
        `/?offset=${offset}&limit=${limit}` +
        (tag && `&tag=${tag}`);
    }

    let data = await makeApiCall(url, method);
    setArticles(data.articles);
    setArticlesCount(data.articlesCount);
    error = '';

    if (feed === 'myFeed') {
      setFeedSelected('myFeed');
    } else {
      setFeedSelected('globalFeed');
    }
  };

  const likeArticle = async (favourted, slug) => {
    let method = favourted === true ? 'DELETE' : 'POST';
    if (contextInfo.isUserLoggedIn) {
      await makeApiCall(`${singleArticleURL}/${slug}/favorite`, method);

      if (feedSelected === 'myFeed' && !activeTag) {
        getArticles('url', 'GET', 'myFeed');
      } else {
        getArticles('url', 'GET', 'globalFeed');
      }
    }
  };

  const emptyTab = () => {
    setActiveTag('');
  };

  const addTab = (val) => {
    setActiveTag(val);
    setActivePageIndex(1);
  };

  const changeFeedSelected = (val) => {
    setFeedSelected(val);
    setActivePageIndex(1);
  };

  const updateCurrentPageIndex = (val) => {
    setActivePageIndex(val);
    feedSelected === 'myFeed'
      ? getArticles('url', 'GET', 'myFeed')
      : getArticles('url', 'GET', 'globalFeed');
  };

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
                emptyTab={emptyTab}
                changeFeedSelected={changeFeedSelected}
                feedSelected={feedSelected}
              />
              <Posts articles={articles || []} likeArticle={likeArticle} />
              {articlesCount > 10 ? (
                <Pagination
                  articlesCount={articlesCount}
                  articlesPerPage={articlesPerPage}
                  activePageIndex={activePageIndex}
                  updateCurrentPageIndex={updateCurrentPageIndex}
                />
              ) : (
                ''
              )}
            </div>
            <Sidebar addTab={addTab} activeTag={activeTag} />
          </div>
        </div>
      </section>
    </main>
  );
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
