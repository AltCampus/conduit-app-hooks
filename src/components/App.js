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
import UserInfo from './UserInfo';
import Profile from './Profile';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserLoggedIn: false,
      user: null,
      isVerifying: true,
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
        .catch((errors) => console.log(errors));
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
    // localStorage.setItem(localStorageKey, '');
    localStorage.removeItem(localStorageKey);
    this.props.history.push('/');
  };

  render() {
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
            />
          ) : (
            <UnAuthenticatedApp
              isUserLoggedIn={isUserLoggedIn}
              user={user}
              updateUser={this.updateUser}
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
      <Route path='/profile' exaxt>
        <UserInfo user={props.user} />
      </Route>
      <Route path='/setting'>
        <Settings user={props.user} logoutUser={props.logoutUser} />
      </Route>
      <Route path='/profiles/:username' component={Profile} exact />
      <Route path='/article/:slug' component={SingleArticle} exact />
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
      <Route path='/profiles/:username' component={Profile} exact />
      <Route path='/article/:slug' component={SingleArticle} exact />
      <Route path='*'>
        <NotFound />
      </Route>
    </Switch>
  );
}
export default withRouter(App);
