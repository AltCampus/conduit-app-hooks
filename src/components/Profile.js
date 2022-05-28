import React, { useContext, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { AiFillSetting } from 'react-icons/ai';
import { BiPlusMedical } from 'react-icons/bi';
import { FaMinus } from 'react-icons/fa';

import Posts from './Posts';
import Loading from './Loading';
import Pagination from './Pagination';
import Error from './Error';
import { articlesURL, getProfile, singleArticleURL } from '../utils/constant';
import LoginUserContext from '../ContextAPI/LoginUserContext';
import useFetch from '../customHooks/useFetch';

function Profile(props) {
  let initialArticle = {
    articles: [],
    articlesCount: 0,
    articlesPerPage: 10,
    activePageIndex: 1,
    feedSelected: 'author',
    error: '',
  };

  const [articlesInfo, setArticlesInfo] = useState(initialArticle);
  const [profileInfo, setProfileInfo] = useState(null);

  let contextInfo = useContext(LoginUserContext);

  let { makeApiCall, isLoading, error } = useFetch();

  useEffect(() => {
    let user = props.match.params;

    fetchUser(getProfile + user.username, 'GET');
  }, [props]);

  useEffect(() => {
    fetchArticles();
  }, [articlesInfo.feedSelected, articlesInfo.activePageIndex, props]);

  const fetchUser = async (url, method) => {
    let data = await makeApiCall(url, method);
    setProfileInfo(data.profile);
  };

  const fetchArticles = async () => {
    let user = props.match.params;
    let limit = articlesInfo.articlesPerPage;
    let offset = (articlesInfo.activePageIndex - 1) * 10;
    let data = await makeApiCall(
      `${articlesURL}?${articlesInfo.feedSelected}=${user.username}&offset=${offset}&limit=${limit}`,
      'GET'
    );
    setArticlesInfo({
      ...articlesInfo,
      articles: data.articles,
      articlesCount: data.articlesCount,
      error: '',
    });
  };

  const handleFeedSelected = (val) => {
    setArticlesInfo({ ...articlesInfo, feedSelected: val });
  };

  const updateCurrentPageIndex = (val) => {
    setArticlesInfo({ ...articlesInfo, activePageIndex: val });
  };

  const followUser = (val) => {
    if (contextInfo.isUserLoggedIn) {
      fetchUser(`${getProfile}${profileInfo.username}/follow`, val);
    }
  };

  const likeArticle = async (favourted, slug) => {
    let isUserLoggedIn = contextInfo.isUserLoggedIn;
    let method = favourted === true ? 'DELETE' : 'POST';
    if (isUserLoggedIn) {
      await makeApiCall(`${singleArticleURL}/${slug}/favorite`, method);

      fetchArticles();
    }
  };

  let { articlesCount, articlesPerPage, activePageIndex } = articlesInfo;
  if (error || articlesInfo.error) return <Error error={error} />;
  if (isLoading) return <Loading />;
  return (
    <div className='profile-holder'>
      <Banner
        profile={profileInfo}
        user={contextInfo.user}
        followUser={followUser}
      />
      <div className='container'>
        <ProfileFeedNav
          feedSelected={articlesInfo.feedSelected}
          handleFeedSelected={handleFeedSelected}
        />
        <Posts
          articles={articlesInfo.articles}
          user={contextInfo.user}
          likeArticle={likeArticle}
        />
        {articlesInfo.articlesCount > 10 ? (
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
    </div>
  );
}

function Banner(props) {
  let contextInfo = useContext(LoginUserContext);
  if (props.profile === null) return <Loading />;
  return (
    <section id='user-profile-hero-section'>
      <img
        className='user-profile-image'
        src={props.profile.image}
        alt={props.profile.username}
      />
      <h2 className='user-profile-name'>{props.profile.username}</h2>
      <h3 className='user-profile-bio'>{props.profile.bio}</h3>
      {!contextInfo.user ? (
        ''
      ) : contextInfo.user &&
        props.profile.username !== contextInfo.user.username ? (
        !props.profile.following ? (
          <button
            onClick={() => props.followUser('POST')}
            className='follow-user flex align-center '
          >
            <BiPlusMedical />
            Follow user
          </button>
        ) : (
          <button
            onClick={() => props.followUser('DELETE')}
            className='follow-user unFollow-user flex align-center'
          >
            <FaMinus />
            UnFollow user
          </button>
        )
      ) : (
        <Link to='/setting'>
          <button className='follow-user flex align-center user-setting'>
            <AiFillSetting className='setting-icon' />
            Profile Settings
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
