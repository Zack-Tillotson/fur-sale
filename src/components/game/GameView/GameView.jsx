import React from 'react';
import InlineCss from "react-inline-css";

import {connect} from 'react-redux';
import {selector as appSelector, dispatcher as appDispatcher} from '../../../firebaseApp';
import fbSelector from '../../../firebase/selector';

import styles from './styles';

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
      this.props.registerGameId(this.props.params.gameId);
      this.connectToFirebaseData();
    }
  },

  componentWillReceiveProps(nextProps) {
    if(!this.props.firebase.isLoggedIn && nextProps.firebase.isLoggedIn) {
      setTimeout(this.connectToFirebaseData, 250);
    }
  },

  connectToFirebaseData() {
    this.props.beginSyncGameData(this.props.params.gameId);
  },

  componentWillUnmount() {
    this.props.endSyncGameData(this.props.params.gameId);
  },

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component">

        {this.props.firebase.isLoggedIn && (

          <div className="gameContainer">

            <PhaseTitle 
              phase={this.props.furSale.phase} />

            {this.props.furSale.phase === 'pregame' && (

              <div className="pregame">

                <PlayerSessions 
                  sessions={this.props.furSale.sessions} 
                  showReadyStatus={this.props.furSale.phase === 'pregame'}
                  toggleReady={this.props.toggleReady}
                  updatePlayerName={this.props.updatePlayerName} />

                <PregameActions
                  canJoin={this.props.furSale.canJoinGame && !this.props.furSale.hasJoinedGame}
                  joinGame={this.props.joinGame}
                  canStartGame={this.props.furSale.isGameOwner}
                  readyToStart={this.props.furSale.readyToStart}
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
        <LoginForm />
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

export default connect(selector, dispatcher)(GameView);