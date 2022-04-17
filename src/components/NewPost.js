import React from 'react';
import { withRouter } from 'react-router';
import { addArticleURL } from '../utils/constant';
class NewPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: '',
      tagList: '',
      description: '',
      errors: {
        title: '',
        body: '',
        tagList: '',
        description: '',
      },
    };
  }

  handleChange = (event) => {
    let { name, value } = event.target;
    let { errors } = this.state;
    if (!value) {
      errors[name] = "Can't be empty";
    } else {
      errors[name] = '';
    }

    this.setState({ [name]: value, errors });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let { title, body, description, tagList, errors } = this.state;
    let token = this.props.user.token;
    if (title && body && description && tagList) {
      tagList = tagList.split(' ');
      fetch(addArticleURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          article: { title, body, description, tagList },
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
        .then((article) => {
          console.log(article, 'NEW ARTICLE');
          this.setState({ title: '', body: '', description: '', tagList: '' });
          this.props.history.push('/article/' + article.article.slug);
        })
        .catch((errors) => console.log(errors, 'NEW ARTICLE ERROR'));
    } else {
      if (!title) {
        errors.title = "Can't be Empty";
      }
      if (!body) {
        errors.body = "Can't be Empty";
      }
      if (!description) {
        errors.description = "Can't be Empty";
      }
      if (!tagList) {
        errors.tagList = "Can't be Empty";
      }
      this.setState({ errors });
    }
  };

  render() {
    let { title, body, tagList, description, errors } = this.state;
    return (
      <div className='new-post'>
        <form className='new-post-form' onSubmit={this.handleSubmit}>
          <input
            onChange={this.handleChange}
            className='input-article-title'
            name='title'
            type='text'
            placeholder='Article Title'
            value={title}
          />
          <h2 className='err-msg'>{errors.title ? errors.title : ''}</h2>
          <input
            name='body'
            className='input-article-body'
            type='text'
            onChange={this.handleChange}
            placeholder={`What's this article about?`}
            value={body}
          />
          <h2 className='err-msg'>{errors.body ? errors.body : ''}</h2>
          <textarea
            name='description'
            onChange={this.handleChange}
            className='input-article-description'
            value={description}
            placeholder={`Write your article (in markdown)`}
          ></textarea>
          <h2 className='err-msg'>
            {errors.description ? errors.description : ''}
          </h2>
          <input
            name='tagList'
            type='text'
            className='input-article-body'
            placeholder='Enter Tags'
            value={tagList}
            onChange={this.handleChange}
          />
          <h2 className='err-msg'>{errors.tagList ? errors.tagList : ''}</h2>
          <input
            type='submit'
            value='Publish Article'
            className='publish-article pointer'
          />
        </form>
      </div>
    );
  }
}

export default withRouter(NewPost);
