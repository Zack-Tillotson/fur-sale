import React from 'react';
import InlineCss from "react-inline-css";

import {connect} from 'react-redux';
import {selector as appSelector, dispatcher as appDispatcher} from '../../firebaseApp';
import fbSelector from '../../firebase/selector';

import NewGameForm from '../game/NewGameForm';

import styles from './styles';

const CreateOrJoinControls = React.createClass({

  propTypes: {
    publicGames: React.PropTypes.object.isRequired,
    beginSyncPublicGameList: React.PropTypes.func.isRequired,
    endSyncPublicGameList: React.PropTypes.func.isRequired,
  },

  componentDidMount() {
    this.props.beginSyncPublicGameList();
  },

  componentWillUnmount() {
    this.props.endSyncPublicGameList();
  },

  navigateToGame() {
    const gameId = this.getJoinableGameId();
    if(gameId) {
      window.location = `/games/${gameId}/`; 
    }
  },

  getJoinableGameId() {
    const joinableGame = this.props.publicGames.filter(game => game.get('createdAt') > Date.now() - 60*60*1000).first();
    if(joinableGame) {
      return joinableGame.get('gameId');
    } else {
      return;
    }
  },

  render() {
    const joinableGameId = this.getJoinableGameId();
    const hasJoinableGameClass = joinableGameId ? 'joinable' : 'unjoinable';
    return (
      <InlineCss stylesheet={styles} componentName="component">
        {joinableGameId && (
          <div className="optionTab joinTab" onClick={this.navigateToGame}>
            <div className="control">
              <button>Join Active Game</button>
            </div>
            <div className="description">Join a recently created game waiting for more players!</div>
          </div>
        )}
        <div className={`optionTab createTab ${hasJoinableGameClass}`}>
          <div className="control">
            <NewGameForm />
          </div>
          <div className="description">Create a new game. Anyone can join a public game but non-public games are only available to people via sharing the URL.</div>
        </div>
      </InlineCss>
    );
  }
});

const selector = (state) => {
  const {publicGames} = appSelector(state);

  return {publicGames};
}

const dispatcher = (dispatch) => {
  const furSale = appDispatcher(dispatch);
  const {beginSyncPublicGameList, endSyncPublicGameList, createGame} = furSale;
  return {
    beginSyncPublicGameList,
    endSyncPublicGameList,
  };
}

export default connect(selector, dispatcher)(CreateOrJoinControls);