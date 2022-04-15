import React from 'react';

class NewPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: '',
      tags: '',
      description: '',
    };
  }

  handleChange = (event) => {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state);
  };

  render() {
    let { title, body, tags, description } = this.state;
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
          <input
            name='body'
            className='input-article-body'
            type='text'
            onChange={this.handleChange}
            placeholder={`What's this article about?`}
            value={body}
          />
          <textarea
            name='description'
            onChange={this.handleChange}
            className='input-article-description'
            value={description}
            placeholder={`Write your article (in markdown)`}
          ></textarea>
          <input
            name='tags'
            type='text'
            className='input-article-body'
            placeholder='Enter Tags'
            value={tags}
            onChange={this.handleChange}
          />
          <input
            type='submit'
            value='Publish Article'
            className='publish-article'
          />
        </form>
      </div>
    );
  }
}

export default NewPost;
