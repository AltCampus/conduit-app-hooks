import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AiFillSetting, AiOutlineUser } from 'react-icons/ai';
import { GiNotebook } from 'react-icons/gi';

import LoginUserContext from '../ContextAPI/LoginUserContext';

function Header() {
  const contextInfo = useContext(LoginUserContext);
  return (
    <header>
      <div className='container flex space-btw align-center'>
        <div className='logo-holder'>
          <Link className='logo' to='/'>
            BLOG
          </Link>
        </div>
        <nav>
          {contextInfo.isUserLoggedIn ? <AuthHeader /> : <NotAuthHeader />}
        </nav>
      </div>
    </header>
  );
}

function AuthHeader() {
  const contextInfo = useContext(LoginUserContext);
  return (
    <ol className='flex gap-2 align-center'>
      <li>
        <NavLink to='/' className='nav-link' activeclassname='active' exact>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to='/newPost'
          className='nav-link flex align-center'
          activeclassname='active'
        >
          <GiNotebook className='margin-rigth-5' />
          New Article
        </NavLink>
      </li>
      <li>
        <NavLink
          to='/setting'
          className='nav-link flex align-center'
          activeclassname='active'
        >
          <AiFillSetting className='margin-rigth-5' />
          Setting
        </NavLink>
      </li>
      <li>
        <NavLink
          to={`/profile/${contextInfo.user.username}`}
          className='nav-link flex align-center'
          activeclassname='active'
        >
          {contextInfo.user.image ? (
            <img
              className='header-user-img'
              src={contextInfo.user.image}
              alt='user-profile'
            />
          ) : (
            <AiOutlineUser className='margin-rigth-5' />
          )}
          {contextInfo.user.username}
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
