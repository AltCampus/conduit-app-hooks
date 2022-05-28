import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  state = {
    error: null,
    errorInfo: null,
    hasError: false,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='error-holder'>
          <h1 className='err-msg err-msg-heading'>SomeThing Went Wrong</h1>
          <h1 className='err-msg err-msg-heading'>Please Refresh Page</h1>
          <Link push to='/' className='home-btn'>
            <button>Home</button>
          </Link>
          <p className='err-msg'>{this.state.errorInfo}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
