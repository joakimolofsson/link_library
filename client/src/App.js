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
  state = {
    auth: false
  }

  handleAuth = (authState) => {
    authState ?
    this.setState({auth: true}) :
    this.setState({auth: false});
  }

  handleLogout = (logoutState) => {
    if(logoutState) {
      window.localStorage.removeItem('token');
      this.setState({auth: false});
    }
  }

  render() {
    return (
      <div className="App">
        {this.state.auth && <Nav handleLogout={this.handleLogout}/>}
        <Route render={({location}) => (
          <TransitionGroup>
            <CSSTransition key={location.key} timeout={4000} classNames="fade">
              <Switch location={location}>
              <Route exact path="/" render={(props) => <Login {...props} handleAuth={this.handleAuth}/>} />
              <Route exact path="/register" component={Register} />
              <ProtectedRoute exact path="/links" component={Links} auth={this.state.auth} handleAuth={this.handleAuth}/>
              <ProtectedRoute exact path="/addlink" component={AddLink} auth={this.state.auth} handleAuth={this.handleAuth}/>
              <ProtectedRoute exact path="/profile" component={Profile} auth={this.state.auth} handleAuth={this.handleAuth}/>
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