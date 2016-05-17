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
import History from '../History';
import PostGame from '../PostGame';

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
    if(nextProps.furSale.activeAiId && !this.activeAiActionRequest) {
      this.startRequestAiAction();
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

  activeAiActionRequest: null, // Timeout ID for AI action

  startRequestAiAction() {
    this.activeAiActionRequest = setTimeout(this.requestAiAction, 1500);
  },

  requestAiAction() {
    if(this.props.furSale.isGameOwner) {
      this.props.requestAiAction();
      this.activeAiActionRequest = null;
    }
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
                    updatePlayerName={this.props.updatePlayerName}
                    updatePlayerColor={this.props.updatePlayerColor}
                    updatePlayerPersona={this.props.updatePlayerPersona} />

                  <PregameActions
                    isOwner={this.props.furSale.isGameOwner}
                    readyToStart={this.props.furSale.readyToStart}
                    startGame={this.props.startGame}
                    addAiPlayer={this.props.addAiPlayer} />

                </div>

              )}

              {(this.props.furSale.phase === 'buy' || this.props.furSale.phase === 'sell') && (

                <div className="inGame">

                  <History history={this.props.furSale.history} />

                  <div className="gameInfo">

                    <CardTable
                      key={this.props.roundNum}
                      phase={this.props.furSale.phase}
                      roundNum={this.props.furSale.roundNum}
                      visibleCardsGone={this.props.furSale.visibleCardsGone}
                      visibleCards={this.props.furSale.visibleCards} />

                    <PlayerList
                      phase={this.props.furSale.phase}
                      players={this.props.furSale.players} 
                      passBet={this.props.passBet}
                      makeBet={this.props.makeBet}
                      sellCard={this.props.sellCard} />

                  </div>

                </div>

              )}

              {this.props.furSale.phase === 'postgame' && (
                <div className="postGame">
                  <PostGame {...this.props.furSale} />
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