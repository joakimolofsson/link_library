import React, {Component} from 'react';
import {Route, Switch} from "react-router-dom";
import './App.css';
import Nav from './components/Nav';
import Login from './components/Login';
import Links from './components/Links';
import AddLink from './components/AddLink';
import Register from './components/Register';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

class App extends Component {
  state = {}

  handleAuth = () => {
    const loggedIn = window.localStorage.getItem('loggedIn'),
    currentTime = new Date().getTime(),
    tenMin = 1000 * 60 * 10;
    return (currentTime - loggedIn) < tenMin ? true : false;
  }

  handleLogout = (logoutState) => {
    if(logoutState) {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('loggedIn');
      this.setState({auth: false});
    }
  }

  render() {
    return (
      <div className="App">
        {this.handleAuth() && <Nav handleLogout={this.handleLogout}/>}
        <Route render={({location}) => (
          <TransitionGroup>
            <CSSTransition key={location.key} timeout={2000} classNames="fade">
              <Switch location={location}>
              <Route exact path="/" render={(props) => <Login {...props} />} />
              <Route exact path="/register" component={Register} />
              <ProtectedRoute exact path="/links" component={Links} handleAuth={this.handleAuth} />
              <ProtectedRoute exact path="/addlink" component={AddLink} handleAuth={this.handleAuth} />
              <ProtectedRoute exact path="/profile" component={Profile} handleAuth={this.handleAuth} />
              <Route component={NotFound} />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        )} />
      </div>
    );
  }
}

export default App;