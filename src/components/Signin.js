import React from 'react';
import { Link } from 'react-router-dom';
import validate from '../utils/validate';
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

  handleSubmit = (event) => {
    event.preventDefault();
    let { email, password, errors } = this.state;
    this.setState({ email, password, errors });
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
    let errors = this.state;
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
          <input
            type='submit'
            value='Sign in'
            disabled
            className='signin-submit'
          />
        </form>
      </div>
    );
  }
}

export default Signin;
