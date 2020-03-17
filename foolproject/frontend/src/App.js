import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { Provider } from 'react-redux';

import ShoppingCard from './Components/Shoppingcart'
import Navbar from './Components/Navbar.js'
import Card from './Components/Card.js'
import store from './store';
import Login from './Components/accounts/Login.js'
import Register from './Components/accounts/Register';

import { loadUser } from './Actions/auth'


class App extends Component {
  render(){
    return (
      <Provider store={store}>
        <Router>
            <Navbar />
            <Switch>
                <Route exact path="/shoppingcart" component={ShoppingCard} />
                <Route exact path="/" component={Card} />
            </Switch>
        </Router>
      </Provider>
    );
  } 
}

export default App;
