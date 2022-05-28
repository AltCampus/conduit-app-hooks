import React, { useEffect, useState } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import Header from './Header';
import Home from './Home';
import NotFound from './NotFound';
import Signin from './Signin';
import Signup from './Signup';
import NewPost from './NewPost';
import SingleArticle from './SingleArticle';
import FullPageSppiner from './fullPageSpinner';
import Settings from './Settings';
import Profile from './Profile';
import UpdatePost from './UpdatePost';
import { localStorageKey, userVerifyURL } from '../utils/constant';
import LoginUserContext from '../ContextAPI/LoginUserContext';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import useFetch from '../customHooks/useFetch';

function App(props) {
  let initialInfo = {
    isUserLoggedIn: false,
    user: null,
    isVerifying: true,
    error: '',
  };

  const [userInfo, setUserInfo] = useState(initialInfo);

  let { makeApiCall, isLoading } = useFetch();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    let response = await makeApiCall(userVerifyURL, 'GET');
    if (response && response.user) {
      setUserInfo({
        ...userInfo,
        isUserLoggedIn: true,
        isVarifying: false,
        user: response.user,
      });
    } else {
      setUserInfo({
        ...userInfo,
        isUserLoggedIn: false,
        isVarifying: false,
        user: null,
      });
    }
  };

  const updateUser = (user) => {
    setUserInfo({
      ...userInfo,
      isUserLoggedIn: true,
      user,
      isVerifying: false,
    });
    localStorage.setItem(localStorageKey, user.token);
  };

  const logoutUser = () => {
    setUserInfo({
      ...userInfo,
      isUserLoggedIn: false,
      user: null,
      isVerifying: false,
    });
    localStorage.removeItem(localStorageKey);
    props.history.push('/');
  };

  if (isLoading) {
    return <FullPageSppiner />;
  }

  let { isUserLoggedIn, user } = userInfo;

  let contextInfo = { isUserLoggedIn, user, updateUser: updateUser };

  return (
    <>
      <React.StrictMode>
        <ErrorBoundary>
          <LoginUserContext.Provider value={contextInfo}>
            <Header />
            {isUserLoggedIn ? (
              <AuthenticatedApp
                logoutUser={logoutUser}
                article={userInfo.article}
                updateUser={updateUser}
              />
            ) : (
              <UnAuthenticatedApp
                updateUser={updateUser}
                article={userInfo.article}
              />
            )}
          </LoginUserContext.Provider>
        </ErrorBoundary>
      </React.StrictMode>
    </>
  );
}

function AuthenticatedApp(props) {
  return (
    <Switch>
      <Route path='/' exact>
        <Home />
      </Route>
      <Route path='/newPost' exact>
        <NewPost />
      </Route>
      <Route path='/setting' exact>
        <Settings logoutUser={props.logoutUser} updateUser={props.updateUser} />
      </Route>
      <Route path='/profile/:username' exact>
        <Profile />
      </Route>
      <Route path='/article/edit/:slug' exact>
        <UpdatePost />
      </Route>
      <Route path='/article/:slug' exact>
        <SingleArticle />
      </Route>
      <Route path='*'>
        <NotFound />
      </Route>
    </Switch>
  );
}

function UnAuthenticatedApp(props) {
  return (
    <Switch>
      <Route path='/' exact>
        <Home />
      </Route>
      <Route path='/login'>
        <Signin updateUser={props.updateUser} />
      </Route>
      <Route path='/register'>
        <Signup updateUser={props.updateUser} />
      </Route>
      <Route path='/profile/:username'>
        <Profile />
      </Route>
      <Route path='/article/:slug'>
        <SingleArticle />
      </Route>
      <Route path='*'>
        <NotFound />
      </Route>
    </Switch>
  );
}
export default withRouter(App);
