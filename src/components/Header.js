import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaToolbox, FaUser } from 'react-icons/fa';

class Header extends React.Component {
  render() {
    let token = JSON.parse(localStorage.getItem('token'));
    if (token) {
      return <AuthHeader />;
    } else {
      return <NotAuthHeader />;
    }
  }
}

function AuthHeader() {
  return (
    <header>
      <div className='container flex space-btw align-center'>
        <div className='logo-holder'>
          <Link className='logo' to='/'>
            conduit
          </Link>
        </div>
        <nav>
          <ol className='flex gap-2'>
            <li>
              <NavLink
                to='/'
                className='nav-link'
                activeclassname='active'
                exact
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/newPost'
                className='nav-link'
                activeclassname='active'
              >
                New Post
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/register'
                className='nav-link'
                activeclassname='active'
              >
                <FaToolbox />
                Setting
              </NavLink>
            </li>
            <li>
              <NavLink to='/' className='nav-link' activeclassname='active'>
                <FaUser />
                username
              </NavLink>
            </li>
          </ol>
        </nav>
      </div>
    </header>
  );
}

function NotAuthHeader() {
  return (
    <header>
      <div className='container flex space-btw align-center'>
        <div className='logo-holder'>
          <Link className='logo' to='/'>
            conduit
          </Link>
        </div>
        <nav>
          <ol className='flex gap-2'>
            <li>
              <NavLink
                to='/'
                className='nav-link'
                activeclassname='active'
                exact
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/login'
                className='nav-link'
                activeclassname='active'
              >
                Sign in
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/register'
                className='nav-link'
                activeclassname='active'
              >
                Sign up
              </NavLink>
            </li>
          </ol>
        </nav>
      </div>
    </header>
  );
}

export default Header;
