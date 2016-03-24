import Immutable from 'immutable';

import actionTypes from './actionTypes';

import gameReducer from './reducers/game';
import upstreamReducer from './reducers/upstream';
import sessionReducer from './reducers/sessions';

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

  sessions: [],

});

export default function(state = defaultState, action) {

  switch(action.type) {

    case actionTypes.apiSuccessful:
      switch(action.event) {

        case 'beginSyncGameData':
          return state.merge({
            gameId: action.data,
          });

        default:
          return state;
      }

    case actionTypes.dataReceived:

      // Put the data coming directly from Firebase into the state
      let newState = upstreamReducer(state, action.data);

      // Update the calculated data
      newState = newState.mergeIn(['engine'], Immutable.fromJS(gameReducer(state, newState)));

      // User session info!
      const sessions = (action.data || {}).sessions;
      newState = newState.set('sessions', Immutable.fromJS(sessionReducer(sessions)));

      return newState;
  
  }

  return state;

}