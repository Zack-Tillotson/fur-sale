import React from 'react';
import InlineCss from "react-inline-css";

import {connect} from 'react-redux';
import {selector as appSelector, dispatcher as appDispatcher} from '../../../firebaseApp';
import fbSelector from '../../../firebase/selector';

import styles from './styles';

import LoginForm from '../../LoginForm';

const NewGameButton = React.createClass({

  propTypes: {
    furSale: React.PropTypes.object.isRequired,
    createGame: React.PropTypes.func.isRequired,
  },

  createGameAndNavigate() {
    this.props.createGame().then(this.navigateToGame);
  },

  navigateToGame(id) {
    window.location = `/games/${id}/`;
  },

  render() {

    return (
      <InlineCss stylesheet={styles} componentName="component" className="newGameButton">

        {!this.props.firebase.isLoggedIn && (
          <section>
            <p>Please log in to play.</p>
            <LoginForm />
          </section>
        )}

        {this.props.firebase.isLoggedIn && (
          <button onClick={this.createGameAndNavigate}>Create Game</button>
        )}

      </InlineCss>
    );
  }
});

const selector = (state) => {
  const furSale = appSelector(state);
  const firebase = fbSelector(state);
  return {furSale, firebase};
}

const dispatcher = (dispatch) => {
  const furSale = appDispatcher(dispatch);
  return {...furSale};
}

export default connect(selector, dispatcher)(NewGameButton);