import React from 'react';
import InlineCss from "react-inline-css";

import {connect} from 'react-redux';
import {selector as appSelector, dispatcher as appDispatcher} from '../../../firebaseApp';
import fbSelector from '../../../firebase/selector';

import styles from './styles';

import Page from '../../Page';
import LoginForm from '../../LoginForm';
import PhaseTitle from '../PhaseTitle';
import CardTable from '../CardTable';
import PlayerList from '../PlayerList';
import PlayerSessions from '../PlayerSessions';
import PregameActions from '../PregameActions';

const GameView = React.createClass({

  propTypes: {
    furSale: React.PropTypes.object.isRequired,
    passBet: React.PropTypes.func.isRequired,
    makeBet: React.PropTypes.func.isRequired,
  },

  componentDidMount() {
    if(this.props.firebase.isLoggedIn) {
      this.connectToFirebaseData();
    }
  },

  componentWillReceiveProps(nextProps) {
    if(!this.props.firebase.isLoggedIn && nextProps.firebase.isLoggedIn) {
      this.connectToFirebaseData();
    }
  },

  connectToFirebaseData() {
    this.props.beginSyncGameData(this.props.params.gameId)
       .then(() => {
        if(this.props.furSale.canJoinGame) {
          this.props.joinGame();
        }
      });
  },

  componentWillUnmount() {
    this.props.endSyncGameData(this.props.params.gameId);
  },

  render() {
    return (
      <Page>
        <InlineCss stylesheet={styles} componentName="component">

          {this.props.firebase.isLoggedIn && (

            <div className="gameContainer">

              <PhaseTitle 
                phase={this.props.furSale.phase} />

              {this.props.furSale.phase === 'pregame' && (

                <div className="pregame">

                  <PlayerSessions 
                    canJoinGame={this.props.furSale.canJoinGame}
                    sessions={this.props.furSale.sessions} 
                    updatePlayerName={this.props.updatePlayerName} />

                  <PregameActions
                    canStartGame={this.props.furSale.isGameOwner && this.props.furSale.readyToStart}
                    playerCount={this.props.furSale.players.size}
                    startGame={this.props.startGame} />                

                </div>

              )}

              {this.props.furSale.phase !== 'pregame' && (

                <div className="inGame">

                  <CardTable 
                    visibleCardsGone={this.props.furSale.visibleCardsGone}
                    visibleCards={this.props.furSale.visibleCards} />

                  <PlayerList
                    players={this.props.furSale.players} 
                    passBet={this.props.passBet}
                    makeBet={this.props.makeBet} />

                </div>

              )}

          </div>

        )}

        {!this.props.firebase.isLoggedIn && (
          <div className="loginGate">
            <h1>Please log in before joining this game.</h1>
            <LoginForm />
          </div>
        )}

        </InlineCss>
      </Page>
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

export default connect(selector, dispatcher)(GameView);