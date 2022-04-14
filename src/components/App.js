import React from 'react';
import Header from './Header';
import Home from './Home';
import NotFound from './NotFound';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Signin from './Signin';
import Signup from './Signup';
import SingleArticle from './SingleArticle';
class App extends React.Component {
  render() {
    return (
      <React.StrictMode>
        <Header />
        <Switch>
          <Route path='/' exact>
            <Home />
          </Route>
          <Route path='/login' exact>
            <Signin />
          </Route>
          <Route path='/register' exact>
            <Signup />
          </Route>
          <Route path='/article/:slug' component={SingleArticle} exact />
          <Route path='*' exact>
            <NotFound />
          </Route>
        </Switch>
      </React.StrictMode>
    );
  }
}

export default App;
