import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import './App.css';
import Nav from './components/Nav';
import Login from './components/Login';
import Links from './components/Links';
import ShareLink from './components/ShareLink';
import Register from './components/Register';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';

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
        <Switch>
          <Route exact path="/" render={(props) => <Login {...props} handleAuth={this.handleAuth}/>} />
          <Route exact path="/register" component={Register} />
          <ProtectedRoute exact path="/links" component={Links} auth={this.state.auth} handleAuth={this.handleAuth}/>
          <ProtectedRoute exact path="/sharelink" component={ShareLink} auth={this.state.auth} handleAuth={this.handleAuth}/>
          <ProtectedRoute exact path="/profile" component={Profile} auth={this.state.auth} handleAuth={this.handleAuth}/>
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default App;