import React from 'react';
import { withRouter } from 'react-router';
import { articlesURL, singleArticleURL } from '../utils/constant';
import Error from './Error';

class UpdatePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: '',
      tagList: [],
      description: '',
      error: '',
      errors: {
        title: '',
        body: '',
        tagList: '',
        description: '',
      },
    };
  }

  componentDidMount() {
    this.getArticle(this.props.match.params.slug);
  }

  getArticle = (slug) => {
    fetch(singleArticleURL + slug)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(({ article }) => {
        this.setState({
          title: article.title,
          body: article.body,
          description: article.description,
          tagList: article.tagList,
          error: '',
        });
      })
      .catch((err) => this.setState({ error: err }));
  };

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
    let slug = this.props.match.params.slug;
    if (title && body && description && tagList) {
      if (typeof tagList === 'string') {
        tagList = tagList.split(',').map((tag) => tag.trim());
      }
      fetch(singleArticleURL + slug, {
        method: 'PUT',
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
            throw new Error('Can not create new article');
          }
          return res.json();
        })
        .then((article) => {
          this.setState({ title: '', body: '', description: '', tagList: '' });
          this.props.history.push('/article/' + article.article.slug);
        })
        .catch((errors) => {
          this.setState({
            title: '',
            description: '',
            body: '',
            tagList: '',
            error: errors,
          });
        });
    } else {
      if (!title) {
        errors.title = "Title Can't be Empty";
      }
      if (!body) {
        errors.body = "Body Can't be Empty";
      }
      if (!description) {
        errors.description = "Description Can't be Empty";
      }
      if (!tagList) {
        errors.tagList = "TagList Can't be Empty";
      }
      this.setState({ errors });
    }
  };

  render() {
    let { title, body, tagList, description, errors, error } = this.state;
    if (error) return <Error error={error} />;
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
            value='Update Article'
            className='publish-article pointer'
          />
        </form>
      </div>
    );
  }
}

export default withRouter(UpdatePost);
