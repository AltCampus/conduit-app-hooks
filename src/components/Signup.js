import React from 'react';
import { Link } from 'react-router-dom';
class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      errors: {
        username: '',
        email: '',
        password: '',
      },
    };
  }

  handleChange = (event) => {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let { username, email, password, errors } = this.state;

    if (!username) {
      errors.username = `Username can't be empty`;
    } else if (username.length < 7) {
      errors.username = 'Username should be more than 6 charachter';
    } else {
      errors.username = '';
    }

    if (!email) {
      errors.email = "Email can't be empty";
    } else if (!this.validateEmail(email)) {
      errors.email = 'Enter a Valid Email';
    } else {
      errors.email = '';
    }

    if (!password) {
      errors.password = "Password can't be empty";
    } else if (password.length < 6) {
      errors.password = 'Password Should be atleast 6 character';
    } else if (!this.validatePassword(password)) {
      errors.password = 'Password should contain number and alphabet';
    } else {
      errors.password = '';
    }
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

export default Signup;
