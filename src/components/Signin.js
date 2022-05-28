import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';

import validate from '../utils/validate';
import { loginURL } from '../utils/constant';
import useFetch from '../customHooks/useFetch';

function Signin(props) {
  const [inputInfo, setInputInfo] = useState({
    email: '',
    password: '',
    err: '',
  });
  const [inputError, setInputError] = useState({ email: '', password: '' });

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
    let { email, password } = inputInfo;
    if (!inputError.email && !inputError.password) {
      if (email && password) {
        handleLogin(
          loginURL,
          'POST',
          JSON.stringify({ user: { email, password } })
        );
        setInputInfo({ email: '', password: '' });
      }
    }
  };

  return (
    <div className='signin'>
      <form className='sign-in-form' onSubmit={(event) => handleSubmit(event)}>
        <h2 className='signin-heading'>Sign In</h2>
        <Link to='/register' className='need-account'>
          Need an account?
        </Link>
        <h3 className='err-msg'>
          {error && !inputInfo.email && !inputInfo.password
            ? 'Email or Password is Invalid'
            : ''}
        </h3>
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
          autoComplete={'current-email'}
          className='signin-input'
        />
        <h2 className='err-msg'>
          {inputError.password ? inputError.password : ''}
        </h2>
        <input type='submit' value='Sign in' className='signin-submit' />
      </form>
    </div>
  );
}

export default withRouter(Signin);
