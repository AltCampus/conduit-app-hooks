import React from 'react';
import { Link } from 'react-router-dom';
import validate from '../utils/validate';
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
    let errors = { ...this.state.errors };

    validate(errors, name, value);
    // switch (name) {
    //   case 'email':
    //     let emailError = '';
    //     if (value.indexOf('@') === -1) {
    //       emailError = 'Email should contain @';
    //     }
    //     if (!value) {
    //       emailError = 'Email cant be empty';
    //     }
    //     errors.email = emailError;
    //     break;
    //   case 'username':
    //     let usernameError = '';
    //     if (value.length < 6) {
    //       usernameError = 'username should contain 6 charachter';
    //     }
    //     if (!value) {
    //       usernameError = 'Email cant be empty';
    //     }
    //     errors.username = usernameError;
    //     break;
    //   case 'password':
    //     let passwordError = '';
    //     var numeric_alpha = /^(?=.*[a-zA-Z])(?=.*[0-9])/;

    //     if (!value) {
    //       passwordError = "Password can't be empty";
    //     } else if (!numeric_alpha.test(value)) {
    //       passwordError = 'Password should contain one alphabet and one number';
    //     } else if (value.length < 7) {
    //       passwordError = 'Password should contain atleast 6 character';
    //     }
    //     errors.password = passwordError;
    //     break;
    //   default:
    //     break;
    // }

    this.setState({ [name]: value, errors });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let { username, email, password, errors } = this.state;
    this.setState({ username, email, password, errors });
  };

  render() {
    let errors = this.state;
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
          <input
            type='submit'
            value='Sign up'
            disabled={errors.username || errors.email || errors.password}
            className='signin-submit'
          />
        </form>
      </div>
    );
  }
}

export default Signup;
