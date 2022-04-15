import React from 'react';
import Header from './Header';
import Home from './Home';
import NotFound from './NotFound';
import { Switch, Route, withRouter } from 'react-router-dom';
import Signin from './Signin';
import Signup from './Signup';
import NewPost from './NewPost';
import SingleArticle from './SingleArticle';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
    };
  }
  componentDidUpdate(_prevProps, prevState) {
    let token = JSON.parse(localStorage.getItem('token'));
    if (prevState.token !== token) {
      this.setState({ token });
    }
  }
  render() {
    let token = JSON.parse(localStorage.getItem('token'));
    return (
      <React.StrictMode>
        <Header token={token} />
        <Switch>
          <Route path='/' exact>
            <Home token={token} />
          </Route>
          <Route path='/newPost'>
            <NewPost token={token} />
          </Route>
          <Route path='/login'>
            <Signin />
          </Route>
          <Route path='/register'>
            <Signup />
          </Route>
          <Route
            path='/article/:slug'
            token={token}
            component={SingleArticle}
            exact
          />
          <Route path='*'>
            <NotFound />
          </Route>
        </Switch>
      </React.StrictMode>
    );
  }
}

export default withRouter(App);
