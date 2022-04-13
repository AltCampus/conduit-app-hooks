import React from 'react';
import { Link } from 'react-router-dom';
class Error extends React.Component {
  render() {
    return (
      <div>
        <p>{this.props.error}</p>
        <Link to='/'>Home</Link>
      </div>
    );
  }
}

export default Error;
