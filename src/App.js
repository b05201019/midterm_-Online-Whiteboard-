import React, {Component} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Switch, Route} from 'react-router-dom'
import './App.css'
import Footer from './containers/Footer';
import Home from './containers/Home';
import Room from './containers/Room';

class App extends Component {
  render() {
		return (
      <BrowserRouter>
          <div id = 'layer' style = {{display: 'none'}}></div>
          <Switch>
            <Route exact path = '/' component = {Home}></Route>
            <Route path = '/room/:id?' component = {Room}></Route>
          </Switch>
          <Footer />
      </BrowserRouter>
		)
	}
}

export default App;