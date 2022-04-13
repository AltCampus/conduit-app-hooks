import React from 'react';
import { NavLink, Link } from 'react-router-dom';
class Header extends React.Component {
  render() {
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
}

export default Header;
