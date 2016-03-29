import Immutable from 'immutable';

import actionTypes from '../actionTypes';
import engine from '../gameEngine';

const defaultState = Immutable.fromJS({

  // From our successful 'joinGame' action
  gameId: '',

  // Directly from Firebase /games/[game id]/
  upstream: {
    owner: '',
    rngSeed: '',
    createdAt: 0,
    gameMode: 'out of game', // [out of game, lobby, playing]
    decisions: [],
    sessions: [],
  },

  // Calculated information based on Firebase data
  engine: {
    rngUse: 0, // The number of times the RNG has been used since seeding
    phase: 'pregame', // [pregame, buy, sell, postgame] From game mode and decisions
    table: {
      deckCards: [], // The cards left in the deck
      goneCardCount: 0, // How many cards from the deck have been secretely discarded
      visibleCards: [], // The visible cards on the table
    },
    players: [], // Maps to the sessions, {playerId, money, cards}
    currentPlayer: ''
  },

});

// If the game is first starting initialize the game state. If the game
// has decisions made also run through their result.
export default function syncronizeGameState(state, newState) {

  let gameState = newState.get('engine');

  // No game yet :]
  if(newState.getIn(['upstream', 'gameMode']) === 'pregame') {
    return gameState;
  }

  const seed = newState.getIn(['upstream', 'rngSeed']);

  // Starting the game!
  if(state.getIn(['upstream', 'gameMode']) !== 'playing' && newState.getIn(['upstream', 'gameMode']) === 'playing') {
    const sessions = newState.getIn(['upstream', 'sessions']);
    gameState = engine.getInitialBuyPhaseState(seed, sessions);
  }

  // Playing turns! (Only apply decisions that are new)
  newState.getIn(['upstream', 'decisions']).skip(state.getIn(['upstream', 'decisions']).size).forEach(decision => {
    gameState = engine.applyDecision(seed, decision, gameState);
  });
  
  return gameState;

}