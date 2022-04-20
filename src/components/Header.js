import React from 'react';
import { NavLink, Link } from 'react-router-dom';

function Header(props) {
  return (
    <header>
      <div className='container flex space-btw align-center'>
        <div className='logo-holder'>
          <Link className='logo' to='/'>
            conduit
          </Link>
        </div>
        <nav>
          {props.isUserLoggedIn ? (
            <AuthHeader user={props.user} />
          ) : (
            <NotAuthHeader />
          )}
        </nav>
      </div>
    </header>
  );
}

function AuthHeader(props) {
  return (
    <ol className='flex gap-2'>
      <li>
        <NavLink to='/' className='nav-link' activeclassname='active' exact>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to='/newPost' className='nav-link' activeclassname='active'>
          <i className='ion-compose'></i>
          New Article
        </NavLink>
      </li>
      <li>
        <NavLink
          to='/setting'
          className='nav-link flex align-center'
          activeclassname='active'
        >
          <i className='ion-ios-gear'></i>
          Setting
        </NavLink>
      </li>
      <li>
        <NavLink
          to={`/profile/${props.user.username}`}
          className='nav-link flex align-center'
          activeclassname='active'
        >
          {props.user.image ? (
            <img
              className='header-user-img'
              src={props.user.image}
              alt='user-image'
            />
          ) : (
            <i className='ion-android-contact'></i>
          )}
          {props.user.username}
        </NavLink>
      </li>
    </ol>
  );
}

function NotAuthHeader() {
  return (
    <ol className='flex gap-2'>
      <li>
        <NavLink to='/' className='nav-link' activeclassname='active' exact>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to='/login' className='nav-link' activeclassname='active'>
          Sign in
        </NavLink>
      </li>
      <li>
        <NavLink to='/register' className='nav-link' activeclassname='active'>
          Sign up
        </NavLink>
      </li>
    </ol>
  );
}

export default Header;
