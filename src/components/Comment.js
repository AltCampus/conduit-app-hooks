import React, { useEffect, useState, useContext } from 'react';
import { BiTrash } from 'react-icons/bi';
import { AiOutlineUser } from 'react-icons/ai';

import Loading from './Loading';
import { singleArticleURL } from '../utils/constant';
import LoginUserContext from '../ContextAPI/LoginUserContext';
import Error from './Error';
import useFetch from '../customHooks/useFetch';

function Comment(props) {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');

  const contextInfo = useContext(LoginUserContext);

  let { makeApiCall, error, isLoading } = useFetch();

  useEffect(() => {
    fetchComments(singleArticleURL + props.slug + '/comments', 'GET');
  }, []);

  const fetchComments = async (url, method, body) => {
    let response = await makeApiCall(url, method, body);
    setComments(response.comments);
  };

  const handleComments = async (url, method, body) => {
    let data = await makeApiCall(url, method, body);
    fetchComments(singleArticleURL + props.slug + '/comments', 'GET');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleComments(
      singleArticleURL + props.slug + '/comments',
      'POST',
      JSON.stringify({ comment: { body: commentInput } })
    );
    setCommentInput('');
  };

  const handleDeleteComment = (id) => {
    handleComments(singleArticleURL + props.slug + '/comments/' + id, 'DELETE');
  };

  const handleChange = (event) => {
    let { value } = event.target;
    setCommentInput(value);
  };

  const updatedDate = (val) => {
    let newDate = new Date(val);
    return newDate.toDateString();
  };

  if (isLoading) return <Loading />;

  if (error) return <Error error={error} />;

  return (
    <>
      <div className='comment-box-holder'>
        <form
          onSubmit={(event) => handleSubmit(event)}
          className='comment-form'
        >
          <div>
            <textarea
              onChange={handleChange}
              name='commentInput'
              className='commentInput'
              placeholder='Write a comment...'
              value={commentInput}
            ></textarea>
          </div>
          <div className='flex space-btw post-comment-holder'>
            <div className='comment-user-info flex align-center'>
              {contextInfo.user.image ? (
                <img
                  className='header-user-img'
                  src={contextInfo.user.image}
                  alt={contextInfo.user.username}
                />
              ) : (
                <AiOutlineUser className='margin-rigth-5' />
              )}
              {contextInfo.user.username}
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
        {comments.map((comment) => {
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
                  <h3>{updatedDate(comment.createdAt)}</h3>
                </div>
                {comment.author.username === contextInfo.user.username ? (
                  <button
                    onClick={(event) => handleDeleteComment(comment.id)}
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

export default Comment;
