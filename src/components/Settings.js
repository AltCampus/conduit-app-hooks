import React from 'react';
import { getProfile, userVerifyURL } from '../utils/constant';
import validate from '../utils/validate';
class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    };
  }

  componentDidMount() {
    let token = this.props.user.token;
    fetch(userVerifyURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        }
        return res.json();
      })
      .then((profile) => {
        this.setState({
          email: profile.user.email,
          username: profile.user.username,
          image: profile.user.image,
          bio: profile.user.bio,
        });
      })
      .catch((error) => console.log(error));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let { username, email, image, bio, password, errors } = this.state;
    let token = this.props.user.token;

    if (!errors.username && !errors.email && !errors.password) {
      fetch(userVerifyURL, {
        method: 'PUT',
        body: JSON.stringify({
          user: { username, email, bio, password, image },
        }),
        headers: {
          'Content-Type': 'application/json',
          authorization: `Token ${token}`,
        },
      })
        .then((res) => {
          console.log(res);
          if (!res.ok) {
            return res.json().then((data) => {
              for (let key in data.errors) {
                errors[key] = `${key} ${data.errors[key]}`;
              }
              return Promise.reject({ errors });
            });
          }
          return res.json();
        })
        .then((profile) => {
          console.log(profile);
          // this.setState({
          //   email: profile.user.email,
          //   username: profile.user.username,
          //   image: profile.user.image,
          //   bio: profile.user.bio,
          //   password: profile.user.password,
          // });
        })
        .catch((error) => console.log(error));
    } else {
      //   if (!username) {
      //     errors.username = "Can't be Empty";
      //   }
      //   if (!email) {
      //     errors.email = "Can't be Empty";
      //   }
      //   if (!password) {
      //     errors.password = "Can't be Empty";
      //   }
      //   this.setState({ errors });
    }
  };

  handleChange = (event) => {
    let { name, value } = event.target;
    let errors = { ...this.state.errors };
    validate(errors, name, value);
    this.setState({ [name]: value, errors });
  };

  render() {
    let { username, email, bio, password, image, errors } = this.state;
    return (
      <div className='setting'>
        <form className='settings-from' onSubmit={this.handleSubmit}>
          <h2 className='setting-heading'>Your Settings</h2>
          <input
            onChange={this.handleChange}
            className='input-article-title'
            name='image'
            type='text'
            placeholder='URL of profile picture'
            value={image}
          />
          <h2 className='err-msg'>{errors.title ? errors.title : ''}</h2>
          <input
            name='username'
            className='input-article-body'
            type='text'
            onChange={this.handleChange}
            placeholder={`username`}
            value={username}
          />
          <h2 className='err-msg'>{errors.username ? errors.username : ''}</h2>
          <textarea
            name='bio'
            onChange={this.handleChange}
            className='input-article-description'
            value={bio}
            placeholder={`Short bio about you`}
          ></textarea>
          <h2 className='err-msg'>
            {errors.description ? errors.description : ''}
          </h2>
          <input
            name='email'
            className='input-article-body'
            type='text'
            onChange={this.handleChange}
            placeholder={`Email`}
            value={email}
          />
          <h2 className='err-msg'>{errors.email ? errors.email : ''}</h2>
          <input
            name='password'
            className='input-article-body'
            type='password'
            onChange={this.handleChange}
            placeholder={`New Password`}
            value={password}
          />
          <h2 className='err-msg'>{errors.password ? errors.password : ''}</h2>
          <input
            type='submit'
            value='Update Settings'
            className='publish-article pointer'
          />
        </form>
        <div className='logout-holder'>
          <button onClick={this.props.logoutUser} className='logout-btn'>
            Or click here to logout
          </button>
        </div>
      </div>
    );
  }
}

export default Settings;
