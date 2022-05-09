import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import validate from '../utils/validate';
import { loginURL } from '../utils/constant';

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: {
        email: '',
        password: '',
      },
    };
  }

  handleChange = (event) => {
    let { name, value } = event.target;
    let errors = { ...this.state.errors };
    validate(errors, name, value);
    this.setState({ [name]: value, errors });
  };

  loginInUser = (email, password) => {
    fetch(loginURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: { email, password },
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        }
        return res.json();
      })
      .then(({ user }) => {
        this.props.updateUser(user);
        this.props.history.push('/');
      })
      .catch((errors) => {
        this.setState((prevState) => {
          return {
            ...prevState,
            errors: {
              ...prevState.errors,
              email: 'Email or Password is incorrect',
            },
          };
        });
      });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let { email, password } = this.state;
    if (email && password) {
      this.loginInUser(email, password);
    }
  };

  validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  validatePassword = (password) => {
    var numeric_alpha = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
    return password.match(numeric_alpha);
  };
  render() {
    return (
      <div className='signin'>
        <form
          className='sign-in-form'
          onSubmit={(event) => this.handleSubmit(event)}
        >
          <h2 className='signin-heading'>Sign In</h2>
          <Link to='/register' className='need-account'>
            Need an account?
          </Link>
          <input
            type='text'
            name='email'
            placeholder='Email'
            onChange={(event) => this.handleChange(event)}
            value={this.state.email}
            className='signin-input'
          />
          <h2 className='err-msg'>
            {this.state.errors.email ? this.state.errors.email : ''}
          </h2>
          <input
            type='password'
            name='password'
            placeholder='Password'
            onChange={(event) => this.handleChange(event)}
            value={this.state.password}
            className='signin-input'
          />
          <h2 className='err-msg'>
            {this.state.errors.password ? this.state.errors.password : ''}
          </h2>
          <input type='submit' value='Sign in' className='signin-submit' />
        </form>
      </div>
    );
  }
}

export default withRouter(Signin);
