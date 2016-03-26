import React from 'react';
import {connect} from 'react-redux';

import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Homepage from '../components/Homepage';
import Preferences from '../components/Preferences';
import GameView from '../components/game/GameView';
import FirebaseApi from '../components/FirebaseApi';

import firebase from '../firebase';
import actions from '../firebase/actions';

const selector = (state) => {
  return {};
}

const Application = React.createClass({

  componentDidMount() {
    this.props.firebase.monitorConnection();
  },

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/">
          <IndexRoute component={Homepage} />
          <Route path="games/:gameId/" component={GameView} />
          <Route path="firebase">
            <IndexRoute component={FirebaseApi} />
          </Route>
          <Route path="preferences">
            <IndexRoute component={Preferences} />
          </Route>
        </Route>
      </Router>
    );
  }
});

export default connect(selector, actions)(Application);