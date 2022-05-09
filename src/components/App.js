import React from 'react';
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
import Error from './Error';
import UpdatePost from './UpdatePost';
import { localStorageKey, userVerifyURL } from '../utils/constant';
import LoginUserContext from '../ContextAPI/LoginUserContext';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserLoggedIn: false,
      user: null,
      isVerifying: true,
      error: '',
    };
  }

  componentDidMount() {
    let storageKey = localStorage[localStorageKey];
    if (storageKey) {
      fetch(userVerifyURL, {
        method: 'GET',
        headers: {
          authorization: `Token ${storageKey}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        })
        .then(({ user }) => this.updateUser(user))
        .catch((error) => this.setState({ error }));
    } else {
      this.setState({ isVerifying: false });
    }
  }

  updateUser = (user) => {
    this.setState({ isUserLoggedIn: true, user, isVerifying: false });
    localStorage.setItem(localStorageKey, user.token);
  };

  logoutUser = () => {
    this.setState({ isUserLoggedIn: false, user: null, isVerifying: false });
    localStorage.removeItem(localStorageKey);
    this.props.history.push('/');
  };

  render() {
    if (this.state.error) {
      return <Error error={this.state.error} />;
    }

    if (this.state.isVerifying) {
      return <FullPageSppiner />;
    }
    let { isUserLoggedIn, user } = this.state;
    let contextInfo = { isUserLoggedIn, user, updateUser: this.updateUser };

    return (
      <>
        <React.StrictMode>
          <ErrorBoundary>
            <LoginUserContext.Provider value={contextInfo}>
              <Header />
              {isUserLoggedIn ? (
                <AuthenticatedApp
                  logoutUser={this.logoutUser}
                  updateArticle={this.updateArticle}
                  article={this.state.article}
                  updateUser={this.updateUser}
                />
              ) : (
                <UnAuthenticatedApp
                  updateUser={this.updateUser}
                  article={this.state.article}
                />
              )}
            </LoginUserContext.Provider>
          </ErrorBoundary>
        </React.StrictMode>
      </>
    );
  }
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
