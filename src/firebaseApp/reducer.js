import Immutable from 'immutable';

import actionTypes from './actionTypes';

import gameReducer from './reducers/game';
import upstreamReducer from './reducers/upstream';
import sessionReducer from './reducers/sessions';
import uiReducer from './reducers/ui';

import {defaultUiState} from './reducers/ui';

import util from './util';

const defaultState = Immutable.fromJS({

  // The list of public games
  publicGames: [],

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
    currentPlayer: '',
    // List of important (note-worthy) changes between states. Not all decisions
    // will generate a new diff
    // e.g. basic decision {
    //   player: 0,
    //   action: 'bid',
    //   value: 3
    // }
    // e.g. pass {
    //   player: 3,
    //   action: 'pass',
    //   effects: [{
    //     player: 3,
    //     pays: 3,
    //     reclaims: 2,
    //     card: 13
    //   }, {
    //     player: 1,
    //     pays: 5,
    //     reclaims: 0,
    //     card: 21
    //   }]
    // e.g. sell decision {
    //   action: 'sell',
    //   effects: [{
    //     player: 3,
    //     buyCard: 23
    //     sellCard: 14
    //   }, {
    //     player: 1,
    //     buyCard: 13 
    //     sellCard: 3
    //   }]
    // }
    diffs: [],
  },

  sessions: [],

  ui: defaultUiState,

});

export default function(state = defaultState, action) {

  switch(action.type) {

    case actionTypes.apiSuccessful:
      switch(action.event) {

        case 'beginSyncGameData':
          return state.merge({
            gameId: action.data,
          });

        case 'beginSyncGameList':
          return state.merge({
            publicGames: action.data,
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

    case actionTypes.ui:

      return state.set('ui', uiReducer(state.get('ui'), action));
  
  }

  return state;

}