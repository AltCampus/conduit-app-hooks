import React from 'react';
import { BiTrash } from 'react-icons/bi';
import { AiOutlineUser } from 'react-icons/ai';

import Loading from './Loading';
import { singleArticleURL } from '../utils/constant';
import LoginUserContext from '../ContextAPI/LoginUserContext';
import Error from './Error';

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      commentInput: '',
      error: '',
    };
    this.contextInfo = null;
  }

  handleChange = (event) => {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  };

  componentDidMount() {
    this.getComments();
  }

  getComments = () => {
    let token = this.contextInfo.user ? this.contextInfo.user.token : '';
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
    let token = this.contextInfo.user.token;
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

  handleDeleteComment = (id) => {
    let token = this.contextInfo.user.token;
    fetch(singleArticleURL + this.props.slug + '/comments/' + id, {
      method: 'DELETE',
      headers: {
        authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 204) {
          throw new Error('Comment did not delete');
        }
        this.getComments();
      })
      .catch((error) => {
        this.setState({ error }, this.getComments);
      });
  };

  updatedDate = (val) => {
    let newDate = new Date(val);
    return newDate.toDateString();
  };

  static contextType = LoginUserContext;

  render() {
    this.contextInfo = this.context;
    if (!this.contextInfo) return <Loading />;
    if (this.state.error) return <Error error={this.state.error} />;
    return (
      <>
        <div className='comment-box-holder'>
          <form
            onSubmit={(event) => this.handleSubmit(event)}
            className='comment-form'
          >
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
              <div className='comment-user-info flex align-center'>
                {this.contextInfo.user.image ? (
                  <img
                    className='header-user-img'
                    src={this.contextInfo.user.image}
                    alt={this.contextInfo.user.username}
                  />
                ) : (
                  <AiOutlineUser className='margin-rigth-5' />
                )}
                {this.contextInfo.user.username}
              </div>
              <input
                type='submit'
                value='Post Comment'
                className='signin-submit post-comment pointer'
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
                  {comment.author.username ===
                  this.contextInfo.user.username ? (
                    <button
                      onClick={(event) => this.handleDeleteComment(comment.id)}
                      className='pointer delete-comment'
                    >
                      <BiTrash />
                    </button>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

export default Comment;
