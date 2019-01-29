import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

import Nav from './components/Nav';
import Login from './components/Login';
import Register from './components/Register';
import Protected from './components/Protected';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Nav />
          <Route exact path="/" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/protected" component={Protected} />
        </div>
      </Router>
    );
  }
}

export default App;