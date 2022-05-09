import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = { hasError: false, error: null, errorInfo: null };
  // }

  state = {
    error: null,
    errorInfo: null,
    hasError: false,
  };

  static getDerivedStateFromError(error) {
    console.log(error, 'getDerivedStateFromError');

    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, 'componentDidCatch');

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='error-holder'>
          <h1 className='err-msg err-msg-heading'>SomeThing Went Wrong</h1>
          {/* <Redirect push to="/" className='home-btn'>
            <button>Home</button>
          </Redirect> */}
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
