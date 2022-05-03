import React from 'react';
import Header from './Header';
import Home from './Home';
import NotFound from './NotFound';
import { Switch, Route, withRouter } from 'react-router-dom';
import Signin from './Signin';
import Signup from './Signup';
import NewPost from './NewPost';
import SingleArticle from './SingleArticle';
import { localStorageKey, userVerifyURL } from '../utils/constant';
import FullPageSppiner from './fullPageSpinner';
import Settings from './Settings';
import Profile from './Profile';
import Error from './Error';
import UpdatePost from './UpdatePost';

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

    return (
      <>
        <React.StrictMode>
          <Header isUserLoggedIn={isUserLoggedIn} user={user} />
          {isUserLoggedIn ? (
            <AuthenticatedApp
              isUserLoggedIn={isUserLoggedIn}
              user={user}
              logoutUser={this.logoutUser}
              updateArticle={this.updateArticle}
              article={this.state.article}
            />
          ) : (
            <UnAuthenticatedApp
              isUserLoggedIn={isUserLoggedIn}
              user={user}
              updateUser={this.updateUser}
              article={this.state.article}
            />
          )}
        </React.StrictMode>
      </>
    );
  }
}

function AuthenticatedApp(props) {
  return (
    <Switch>
      <Route path='/' exact>
        <Home isUserLoggedIn={props.isUserLoggedIn} user={props.user} />
      </Route>
      <Route path='/newPost'>
        <NewPost isUserLoggedIn={props.isUserLoggedIn} user={props.user} />
      </Route>
      <Route path='/setting'>
        <Settings user={props.user} logoutUser={props.logoutUser} />
      </Route>
      <Route path='/profile/:username' exact>
        <Profile isUserLoggedIn={props.isUserLoggedIn} user={props.user} />
      </Route>
      <Route path='/article/edit/:slug'>
        <UpdatePost isUserLoggedIn={props.isUserLoggedIn} user={props.user} />
      </Route>
      <Route path='/article/:slug'>
        <SingleArticle
          isUserLoggedIn={props.isUserLoggedIn}
          user={props.user}
        />
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
        <Home isUserLoggedIn={props.isUserLoggedIn} user={props.user} />
      </Route>
      <Route path='/login'>
        <Signin updateUser={props.updateUser} />
      </Route>
      <Route path='/register'>
        <Signup updateUser={props.updateUser} />
      </Route>
      <Route path='/profile/:username'>
        <Profile isUserLoggedIn={props.isUserLoggedIn} user={props.user} />
      </Route>
      <Route path='/article/:slug'>
        <SingleArticle
          isUserLoggedIn={props.isUserLoggedIn}
          user={props.user}
        />
      </Route>
      <Route path='*'>
        <NotFound />
      </Route>
    </Switch>
  );
}
export default withRouter(App);
