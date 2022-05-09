import React from 'react';
import { Link } from 'react-router-dom';

class Error extends React.Component {
  render() {
    return (
      <div>
        <p className='err-msg-heading'>{this.props.error}</p>
        <Link to='/'>
          <button className='home-btn'>Home</button>
        </Link>
      </div>
    );
  }
}

export default Error;
