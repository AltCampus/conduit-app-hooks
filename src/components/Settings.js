import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router';

import { userVerifyURL } from '../utils/constant';
import validate from '../utils/validate';
import LoginUserContext from '../ContextAPI/LoginUserContext';
import Error from './Error';
import useFetch from '../customHooks/useFetch';
import Loading from './Loading';

function Settings(props) {
  const initialState = {
    email: '',
    username: '',
    password: '',
    image: '',
    bio: '',
    errors: {
      username: '',
      email: '',
      password: '',
    },
    error: '',
  };
  const contextInfo = useContext(LoginUserContext);

  const [userInfo, setUserInfo] = useState(initialState);

  const { makeApiCall, error } = useFetch();

  useEffect(() => {
    let { email, username, image, bio } = contextInfo.user;
    setUserInfo({ ...userInfo, email, username, image, bio, password: '' });
  }, []);

  const uploadUserData = async (url, method, body) => {
    let profile = await makeApiCall(url, method, body);
    props.updateUser(profile.user);
    setUserInfo({
      ...userInfo,
      email: '',
      username: '',
      image: '',
      bio: '',
    });
    props.history.push('/');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let { username, email, image, bio, password, errors } = userInfo;

    if (!errors.username && !errors.email && !errors.password) {
      uploadUserData(
        userVerifyURL,
        'PUT',
        JSON.stringify({ user: { username, email, bio, password, image } })
      );
    }
  };

  const handleChange = (event) => {
    let { name, value } = event.target;
    let { errors } = userInfo;
    validate(errors, name, value, userInfo, setUserInfo);
    setUserInfo({ ...userInfo, [name]: value, errors });
  };

  let { username, email, bio, password, image, errors } = userInfo;
  if (!userInfo) return <Loading />;
  if (error) return <Error error={error} />;
  return (
    <div className='setting'>
      <form className='settings-from' onSubmit={handleSubmit}>
        <h2 className='setting-heading'>Your Settings</h2>
        <input
          onChange={handleChange}
          className='input-article input-article-title'
          name='image'
          type='text'
          placeholder='URL of profile picture'
          value={image}
          autoComplete={'current-img'}
        />
        <h2 className='err-msg'>{errors.title ? errors.title : ''}</h2>
        <input
          name='username'
          className='input-article input-article-body'
          type='text'
          onChange={handleChange}
          placeholder={`username`}
          value={username}
          autoComplete={'current-username'}
        />
        <h2 className='err-msg'>{errors.username ? errors.username : ''}</h2>
        <textarea
          name='bio'
          onChange={handleChange}
          className='input-article input-article-description'
          value={bio}
          placeholder={`Short bio about you`}
          autoComplete={'current-bio'}
        ></textarea>
        <h2 className='err-msg'>
          {errors.description ? errors.description : ''}
        </h2>
        <input
          name='email'
          className='input-article input-article-body'
          type='text'
          onChange={handleChange}
          placeholder={`Email`}
          value={email}
          autoComplete={'current-email'}
        />
        <h2 className='err-msg'>{errors.email ? errors.email : ''}</h2>
        <input
          name='password'
          className='input-article input-article-body'
          type='password'
          onChange={handleChange}
          placeholder={`New Password`}
          value={password}
          autoComplete={'current-password'}
        />
        <h2 className='err-msg'>{errors.password ? errors.password : ''}</h2>
        <input
          type='submit'
          value='Update Settings'
          className='publish-article pointer'
        />
      </form>
      <div className='logout-holder'>
        <button onClick={props.logoutUser} className='logout-btn'>
          Or click here to logout
        </button>
      </div>
    </div>
  );
}

export default withRouter(Settings);
