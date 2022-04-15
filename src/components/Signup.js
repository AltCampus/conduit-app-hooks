import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import validate from '../utils/validate';
import { Root_url } from '../utils/constant';
import Error from './Error';
class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      error: '',
      errors: {
        username: '',
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

  signInUser = (username, email, password) => {
    fetch(Root_url + 'users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: { username, email, password },
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        this.setState({ username: '', email: '', password: '' });
        localStorage.setItem('token', JSON.stringify(data.user.token));
        this.props.history.push('/');
      })
      .catch((err) => this.setState({ error: err }));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let { username, email, password } = this.state;
    if (username && email && password) {
      this.signInUser(username, email, password);
    }
  };

  render() {
    let { error } = this.state;
    if (error) return <Error error={error} />;
    return (
      <div className='signin'>
        <form
          className='sign-in-form'
          onSubmit={(event) => this.handleSubmit(event)}
        >
          <h2 className='signin-heading'>Sign Up</h2>
          <Link to='/login' className='need-account'>
            Have an account?
          </Link>
          <span className='err-msg'></span>
          <input
            type='text'
            name='username'
            placeholder='Username'
            onChange={(event) => this.handleChange(event)}
            value={this.state.username}
            className='signin-input'
          />
          <h2 className='err-msg'>
            {this.state.errors.username ? this.state.errors.username : ''}
          </h2>
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
          <input type='submit' value='Sign up' className='signin-submit' />
        </form>
      </div>
    );
  }
}

export default withRouter(Signup);
