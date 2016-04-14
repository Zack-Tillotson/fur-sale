import React from 'react';
import InlineCss from "react-inline-css";

import {connect} from 'react-redux';
import {selector as appSelector, dispatcher as appDispatcher} from '../../../firebaseApp';
import fbSelector from '../../../firebase/selector';

import styles from './styles';

import LoginForm from '../../LoginForm';

const NewGameForm = React.createClass({

  propTypes: {
    firebase: React.PropTypes.object.isRequired,
    createGame: React.PropTypes.func.isRequired,
  },

  createGameAndNavigate() {
    const isPublic = this.refs.publicToggleInput.value;
    this.props.createGame(isPublic).then(this.navigateToGame);
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
          <div className="newGameForm">
            <div className="publicToggle">
              <label htmlFor="publicToggle">Public?</label>
              <input type="checkbox" id="publicToggle" ref="publicToggleInput" defaultChecked={true} />
            </div>
            <button onClick={this.createGameAndNavigate}>Create Game</button>
          </div>
        )}

      </InlineCss>
    );
  }
});

const selector = (state) => {
  const firebase = fbSelector(state);

  return {firebase};
}

const dispatcher = (dispatch) => {
  const {createGame} = appDispatcher(dispatch);
  return {
    createGame,
  };
}

export default connect(selector, dispatcher)(NewGameForm);