import React from 'react';
import { singleArticleURL } from '../utils/constant';

class AddComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      commentInput: '',
      error: '',
    };
  }

  handleChange = (event) => {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  };

  componentDidMount() {
    this.getComments();
  }

  getComments = () => {
    let token = this.props.user.token;
    fetch(singleArticleURL + this.props.slug + '/comments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Comments didn't fetched");
        }
        return res.json();
      })
      .then(({ comments }) => {
        this.setState({ comments });
      })
      .catch((error) => {
        this.setState({ error: '' });
      });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let token = this.props.user.token;
    let { commentInput } = this.state;
    fetch(singleArticleURL + this.props.slug + '/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        comment: { body: commentInput },
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Comments didn't fetched");
        }
        return res.json();
      })
      .then((comments) => {
        this.setState({ commentInput: '' }, this.getComments);
      })
      .catch((error) => {
        this.setState({ error: '' }, this.getComments);
      });
  };

  updatedDate = (val) => {
    let newDate = new Date(val);
    return newDate.toDateString();
  };

  render() {
    return (
      <>
        <div className='comment-box-holder'>
          <form onSubmit={this.handleSubmit} className='comment-form'>
            <div>
              <textarea
                onChange={this.handleChange}
                name='commentInput'
                className='commentInput'
                placeholder='Write a comment...'
                value={this.state.commentInput}
              ></textarea>
            </div>
            <div className='flex space-btw post-comment-holder'>
              <div className='comment-user-info'>
                {this.props.user.username}
              </div>
              <input
                type='submit'
                value='Post Comment'
                className='signin-submit post-comment'
              />
            </div>
          </form>
        </div>
        <div>
          {this.state.comments.map((comment) => {
            return (
              <div key={comment.id} className='comment-list-holder'>
                <div>
                  <p className='comment-text'>{comment.body}</p>
                </div>
                <div className='flex space-btw post-comment-holder'>
                  <div className='comment-user-info align-center flex gap-half'>
                    <img
                      src={comment.author.image}
                      alt={comment.author.username}
                    />
                    <h3 className='comment-username'>
                      {comment.author.username}
                    </h3>
                    <h3>{this.updatedDate(comment.createdAt)}</h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

export default AddComment;
