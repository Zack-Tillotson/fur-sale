import actions from './actions';
import firebaseSelector from '../firebase/selector';
import selector from './selector';
import utils from '../firebase/utils';
import Firebase from 'firebase';

// This folder contains thunks for interacting with Fur Sale on Firebase.

// Decorators

// Must be logged in, adds user id to options
function requireLogin(event, dispatch, getState) {
  const {isLoggedIn, authInfo} = firebaseSelector(getState());

  if(!isLoggedIn) {
    failure(dispatch, event, 'not logged in');
  } else {
    return authInfo.uid;
  }
}

// Must have joined game, add game id to options
function requireGame(event, dispatch, getState) {
  
  const gameId = selector(getState()).game.get('gameId');

  if(!gameId) {
    failure(dispatch, event, 'no game joined');
  } else {
    return gameId;
  }
}

// Callbacks

function success(dispatch, event, data) {
	dispatch(actions.apiSuccessful(event, data));
}

function failure(dispatch, event, message) {
	dispatch(actions.apiFailed(event, message));
}

function beginSyncGameData(gameId) {
  return function(dispatch, getState) {

    const event = 'beginSyncGameData';
    const uid = requireLogin(event, dispatch, getState);

    return  new Promise((resolve, reject) => {
      if(uid) {

        utils.connect('games')
          .child(gameId)
          .on('value', snapshot => {
            success(dispatch, event, snapshot.key());
            dispatch(actions.dataReceived(snapshot.val()));
            dispatch(touchSession());
            resolve();
          });
      } else {
        reject();
      }
    })
  }
}

function touchSession() {
  return function(dispatch, getState) {

    const event = 'touchSession';
    const uid = requireLogin(event, dispatch, getState);
    const gameId = requireGame(event, dispatch, getState);

    if(uid && gameId) {

      utils.connect('games')
        .child(gameId)
        .child('sessions')
        .child(uid)
        .transaction(value => {
          if(value && value.connectionStatus === 'offline') {
            return {
              ...value,
              activeAt: Firebase.ServerValue.TIMESTAMP,
              connectionStatus: 'online',
            } 
          } else {
            return undefined;
          }
        }, result => {
          success(dispatch, event, result);
      });
    }

  }
}

function endSyncGameData() {
  return function(dispatch, getState) {

    const event = 'endSyncGameData';
    const uid = requireLogin(event, dispatch, getState);
    const gameId = requireGame(event, dispatch, getState);

    if(uid && gameId) {

      utils.connect('games')
        .child(gameId)
        .off('value');
    }
  }
}

function createGame() {
  return function(dispatch, getState) {

    const event = 'createGame';
    const uid = requireLogin(event, dispatch, getState);

    const owner = uid;
    const rngSeed = Math.random() + Date.now();
    const gameMode = 'lobby';
    const createdAt = Firebase.ServerValue.TIMESTAMP;
    
    return new Promise(function(resolve, reject) {
      utils.connect('games')
        .push({owner, rngSeed, gameMode, createdAt})
        .then(ref => {
          const id = ref.key();
          success(dispatch, event, id);
          resolve(id);
        });
    });
  }
}

function joinGame() {
  return function(dispatch, getState) {

    const event = 'joinGame';
    const uid = requireLogin(event, dispatch, getState);
    const gameId = requireGame(event, dispatch, getState);
      
    const ref = utils.connect('games')
      .child(gameId)
      .child('sessions')
      .child(uid);

    ref.transaction(value => {

      // If so just update their activity time
      if(!!value) {

        return {
          ...value,
          activeAt: Firebase.ServerValue.TIMESTAMP,
          connectionStatus: 'online',
        }

      } else {

        const {authInfo} = firebaseSelector(getState());
        const name = authInfo[authInfo.provider].name || 'Anonymous Player';
        
        return {
          connectionStatus: 'online',
          joinedAt: Firebase.ServerValue.TIMESTAMP, 
          activeAt: Firebase.ServerValue.TIMESTAMP,
          name,
        }

      }
    }, error => {
      if(!error) {
        success(dispatch, event, gameId);
        ref.child('connectionStatus')
          .onDisconnect()
          .set('offline');
      } else {
        failure(dispatch, event, error.code);
      }
    });
  }
}

function startGame() {
  return function(dispatch, getState) {

    const event = 'startGame';
    const uid = requireLogin(event, dispatch, getState);
    const gameId = requireGame(event, dispatch, getState);
  
    utils.connect('games')
    .child(gameId)
    .child('gameMode')
    .set('playing', error => {
      if(!error) {
        success(dispatch, event);
      } else {
        failure(dispatch, event, error.code)
      }
    });
  }
}

function makeBet(amount) {
  return function(dispatch, getState) {

    const event = 'makeBet';
    const uid = requireLogin(event, dispatch, getState);
    const gameId = requireGame(event, dispatch, getState);

    const decision = {
      timestamp: Firebase.ServerValue.TIMESTAMP,
      choice: 'raiseTo',
      amount
    }

    utils.connect('games')
    .child(gameId)
    .child('decisions')
    .push(decision, error => {
      if(!error) {
        success(dispatch, event);
      } else {
        failure(dispatch, event, error.code)
      }
    });
  }
}

function passBet() {
  return function(dispatch, getState) {

    const event = 'passBet';
    const uid = requireLogin(event, dispatch, getState);
    const gameId = requireGame(event, dispatch, getState);

    const decision = {
      timestamp: Firebase.ServerValue.TIMESTAMP,
      choice: 'pass'
    }

    utils.connect('games')
    .child(gameId)
    .child('decisions')
    .push(decision, error => {
      if(!error) {
        success(dispatch, event);
      } else {
        failure(dispatch, event, error.code)
      }
    });
  }
}

function sellCard(card) {
  return function(dispatch, getState) {

    const event = 'sellCard';
    const uid = requireLogin(event, dispatch, getState);
    const gameId = requireGame(event, dispatch, getState);

    const decision = {
      timestamp: Firebase.ServerValue.TIMESTAMP,
      playerId: uid,
      card,
    }

    utils.connect('games')
    .child(gameId)
    .child('decisions')
    .push(decision, error => {
      if(!error) {
        success(dispatch, event);
      } else {
        failure(dispatch, event, error.code)
      }
    });
  }
}

function updateSessionInfo(info) {
  return function(dispatch, getState) {

    const event = 'updateSessionInfo';
    const uid = requireLogin(event, dispatch, getState);
    const gameId = requireGame(event, dispatch, getState);

    utils.connect('games')
    .child(gameId)
    .child('sessions')
    .child(uid)
    .update(info, error => {
      if(!error) {
        success(dispatch, event);
      } else {
        failure(dispatch, event, error.code)
      }
    });
  }
}

export default {
  beginSyncGameData, 
  touchSession, 
  endSyncGameData, 
  createGame, 
  joinGame, 
  startGame, 
  makeBet, 
  passBet,
  sellCard, 
  updateSessionInfo
}