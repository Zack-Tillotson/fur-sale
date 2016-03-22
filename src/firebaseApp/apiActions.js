import actions from './actions';
import firebaseSelector from '../firebase/selector';
import selector from './selector';
import utils from '../firebase/utils';
import Firebase from 'firebase';

// This folder contains thunks for interacting with Fur Sale on Firebase.

// Callbacks

function success(dispatch, event, data) {
	dispatch(actions.apiSuccessful(event, data));
}

function failure(dispatch, event, message) {
	dispatch(actions.apiFailed(event, message));
}

// Thunks

function beginSyncGameData(gameId) {

  const event = 'gameData';

  return (dispatch, getState) => {

    const {isLoggedIn, authInfo} = firebaseSelector(getState());

    if(!isLoggedIn) {
      failure(dispatch, event, 'not logged in');
    } else {

      if(!gameId) {
        failure(dispatch, event, 'no game joined');
      } else {

        utils.connect('games')
          .child(gameId)
          .on('value', snapshot => {
            success(dispatch, 'syncGameId', snapshot.key());
            dispatch(actions.dataReceived(snapshot.val()));

            dispatch(touchSession());

          });
      }
    }
  }
}

function touchSession() {

  const event = 'touchSession';

  return (dispatch, getState) => {

    const {isLoggedIn, authInfo} = firebaseSelector(getState());

    if(!isLoggedIn) {
      failure(dispatch, event, 'not logged in');
    } else {

      const gameId = selector(getState()).game.get('gameId');

      if(!gameId) {
        failure(dispatch, event, 'no game joined');
      } else {

        utils.connect('games')
          .child(gameId)
          .child('sessions')
          .child(authInfo.uid)
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
}

function endSyncGameData() {

  const event = 'gameData';

  return (dispatch, getState) => {

    const gameId = selector(getState()).game.get('gameId');

    if(!gameId) {
      failure(dispatch, event, 'no game joined');
    } else {

      utils.connect('games')
        .child(gameId)
        .off('value');
    }
  }
}

function createGame(onSuccess) {

  const event = 'createGame';

  return (dispatch, getState) => {

    const {authInfo, isLoggedIn} = firebaseSelector(getState());

    if(!isLoggedIn) {
      failure(dispatch, event, 'not logged in');
    } else {

      const owner = authInfo.uid;
      const rngSeed = Math.random().toString(36);
      const gameMode = 'lobby';
      const createdAt = Firebase.ServerValue.TIMESTAMP;
    
      utils.connect('games')
        .push({owner, rngSeed, gameMode, createdAt})
        .then(ref => {
          const id = ref.key();
          success(dispatch, event, id);
          !!onSuccess && onSuccess(id);
        });
    }
  }
}

function joinGame() {

  const event = 'joinGame';

  return (dispatch, getState) => {

    const {authInfo, isLoggedIn} = firebaseSelector(getState());

    if(!isLoggedIn) {
      failure(dispatch, event, 'not logged in');
    } else {

      const uid = authInfo.uid;
      const gameId = selector(getState()).game.get('gameId');
      
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

          const name = authInfo[authInfo.provider].name || 'Anonymous Player';
          const color = `rgb(${parseInt(Math.random() * 256)}, ${parseInt(Math.random() * 256)}, ${parseInt(Math.random() * 256)})`;

          return {
            status: 'notReady', 
            connectionStatus: 'online',
            joinedAt: Firebase.ServerValue.TIMESTAMP, 
            activeAt: Firebase.ServerValue.TIMESTAMP,
            name,
            color
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
}

function toggleReady() {

  const event = 'toggleReady';

  return (dispatch, getState) => {

    const {authInfo, isLoggedIn} = firebaseSelector(getState());
    
    if(!isLoggedIn) {
      failure(dispatch, event, 'not logged in');
    } else {

      const uid = authInfo.uid;

      const gameId = selector(getState()).game.get('gameId');

      if(!gameId) {
        failure(dispatch, event, 'no game joined');
      } else {

        let status = 'unknown';

        utils.connect('games')
        .child(gameId)
        .child('sessions')
        .child(uid)
        .child('status')
        .transaction(statusData => {
          if(statusData === 'ready') {
            status = 'notReady';
          } else {
            status = 'ready';
          }
          return status;
        }, error => {
          if(!error) {
            success(dispatch, event, status);
          } else {
            failure(dispatch, event, error.code)
          }
        });

      }
    }
  }
}

function startGame() {

  const event = 'startGame';

  return (dispatch, getState) => {

    const {authInfo, isLoggedIn} = firebaseSelector(getState());
    
    if(!isLoggedIn) {
      failure(dispatch, event, 'not logged in');
    } else {

      const uid = authInfo.uid;

      const state = selector(getState()).game;
      const gameId = state.get('gameId');
      const status = state.getIn(['upstream', 'gameMode']);

      if(!gameId) {
        failure(dispatch, event, 'no game joined');
      } else if(status !== 'lobby') {
        failure(dispatch, event, 'can only start games in lobby mode');
      } else {

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
  }

}

function makeBet(amount) {

  const event = 'makeBet';

  return (dispatch, getState) => {

    const {authInfo, isLoggedIn} = firebaseSelector(getState());
    
    if(!isLoggedIn) {
      failure(dispatch, event, 'not logged in');
    } else {

      const uid = authInfo.uid;

      const state = selector(getState()).game;
      const gameId = state.get('gameId');

      if(!gameId) {
        failure(dispatch, event, 'no game joined');
      } else {

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
  }
}

function passBet() {

  const event = 'passBet';

  return (dispatch, getState) => {

    const {authInfo, isLoggedIn} = firebaseSelector(getState());
    
    if(!isLoggedIn) {
      failure(dispatch, event, 'not logged in');
    } else {

      const uid = authInfo.uid;

      const state = selector(getState()).game;
      const gameId = state.get('gameId');

      if(!gameId) {
        failure(dispatch, event, 'no game joined');
      } else {

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
  }
}

function sellCard(card) {

  const event = 'selectCard';

  return (dispatch, getState) => {

    const {authInfo, isLoggedIn} = firebaseSelector(getState());
    
    if(!isLoggedIn) {
      failure(dispatch, event, 'not logged in');
    } else {

      const uid = authInfo.uid;

      const state = selector(getState()).game;
      const gameId = state.get('gameId');

      if(!gameId) {
        failure(dispatch, event, 'no game joined');
      } else {

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
  }

}

function updateSessionInfo(info) {

  const event = 'updateSessionInfo';

  return (dispatch, getState) => {

    const {authInfo, isLoggedIn} = firebaseSelector(getState());
    
    if(!isLoggedIn) {
      failure(dispatch, event, 'not logged in');
    } else {

      const uid = authInfo.uid;

      const state = selector(getState()).game;
      const gameId = state.get('gameId');

      if(!gameId) {
        failure(dispatch, event, 'no game joined');
      } else {

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
  }
}

export default {
  beginSyncGameData,
  endSyncGameData,
  createGame,
  joinGame,
  toggleReady,
  startGame,
  makeBet,
  passBet,
  sellCard,
  updateSessionInfo,
}