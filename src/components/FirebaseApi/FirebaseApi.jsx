import React from 'react';
import InlineCss from "react-inline-css";

import {connect} from 'react-redux';
import {selector, dispatcher} from '../../firebaseApp';

import styles from './styles';

const FirebaseApp = React.createClass({

  createGameHandler() {
    this.props.createGame();
  },

  joinGameHandler() {
    this.props.joinGame(this.refs.joinId.value);
  },

  readyUpHandler() {
    this.props.readyUp('ready');
  },

  startGameHandler() {
    this.props.startGame();
  },

  makeBetHandler() {

  },

  foldBetHandler() {

  },

  selectCardHandler() {

  },

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="container">
        <h1>Firebase API</h1>
        <section>
          <h3>Configure Game</h3>
          <button onClick={this.createGameHandler}>Create Game</button>
          <br />
          <input ref="joinId" type="text" placeholder="Game ID" />
          <br />
          <button onClick={this.joinGameHandler}>Join Game</button>
          <button onClick={this.readyUpHandler}>Ready Up</button>
          <br />
          <button onClick={this.startGameHandler}>Start Game</button>
        </section>
        <section>
          <h3>Buy Phase</h3>
          <input type="text" ref="betAmount" placeholder="Bet amount" />
          <button onClick={this.makeBetHandler}>Make Bet</button>
          <br />
          <button onClick={this.foldBetHandler}>Fold Bet</button>
        </section>
        <section>
          <h3>Sell Phase</h3>
          <select ref="cardSelect">

          </select>
          <button onClick={this.selectCardHandler}>Select Card</button>
        </section>
      </InlineCss>
    );
  }
});

export default connect(selector, dispatcher)(FirebaseApp);