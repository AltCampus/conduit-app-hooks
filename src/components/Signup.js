import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';

import validate from '../utils/validate';
import { signUpURL } from '../utils/constant';
import useFetch from '../customHooks/useFetch';

function Signup(props) {
  const [inputInfo, setInputInfo] = useState({
    username: '',
    email: '',
    password: '',
    err: '',
  });
  const [inputError, setInputError] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { makeApiCall, error } = useFetch();

  const handleLogin = async (url, method, body) => {
    let data = await makeApiCall(url, method, body);
    if (data) {
      props.updateUser(data.user);
      props.history.push('/');
    }
  };

  const handleChange = (event) => {
    let { name, value } = event.target;
    validate(inputError, name, value);
    setInputError({ ...inputError });
    setInputInfo({ ...inputInfo, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let { username, email, password } = inputInfo;
    if (username && email && password) {
      handleLogin(
        signUpURL,
        'POST',
        JSON.stringify({ user: { username, email, password } })
      );
      setInputInfo({ username: '', email: '', password: '' });
    }
    if (!username && !email && !password) {
      setInputError({
        ...inputError,
        username: 'Username is Required',
        password: 'PassWord is Requird',
        email: 'Email is requird',
      });
    }
    if (!username) {
      setInputError({ ...inputError, username: 'Username is Required' });
    }
    if (!password) {
      setInputError({ ...inputError, username: 'Password is Required' });
    }
    if (!email) {
      setInputError({ ...inputError, username: 'Email is Required' });
    }
  };

  return (
    <div className='signin'>
      <form className='sign-in-form' onSubmit={(event) => handleSubmit(event)}>
        <h2 className='signin-heading'>Sign Up</h2>
        <Link to='/login' className='need-account'>
          Have an account?
        </Link>
        <h3 className='err-msg'>
          {error &&
          !inputInfo.email &&
          !inputInfo.password &&
          !inputInfo.username
            ? 'User is already taken or Invalid'
            : ''}
        </h3>
        <input
          type='text'
          name='username'
          placeholder='Username'
          onChange={(event) => handleChange(event)}
          value={inputInfo.username}
          autoComplete={'current-username'}
          className='signin-input'
        />
        <h2 className='err-msg'>
          {inputError.username ? inputError.username : ''}
        </h2>
        <input
          type='text'
          name='email'
          placeholder='Email'
          onChange={(event) => handleChange(event)}
          value={inputInfo.email}
          autoComplete={'current-email'}
          className='signin-input'
        />
        <h2 className='err-msg'>{inputError.email ? inputError.email : ''}</h2>
        <input
          type='password'
          name='password'
          placeholder='Password'
          onChange={(event) => handleChange(event)}
          value={inputInfo.password}
          autoComplete={'current-password'}
          className='signin-input'
        />
        <h2 className='err-msg'>
          {inputError.password ? inputError.password : ''}
        </h2>
        <input type='submit' value='Sign up' className='signin-submit' />
      </form>
    </div>
  );
}

export default withRouter(Signup);
