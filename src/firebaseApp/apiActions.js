import actions from './actions';
import firebaseSelector from '../firebase/selector';
import utils from '../firebase/utils';
import Firebase from 'firebase';

// This folder contains thunks for interacting with Fur Sale on Firebase.

// Callbacks

function success(dispatch, event, data) {
	dispatch(actions.apiSuccessful(event, data));
}

function failure(dispatch, event, data) {
	dispatch(actions.apiFailed(event, data));
}

// Thunks

export default {

  createGame() {

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
          .then(ref => success(dispatch, event, ref));
    	}
    }
  },

  joinGame(gameId) {

    const event = 'joinGame';

    return (dispatch, getState) => {

      const {authInfo, isLoggedIn} = firebaseSelector(getState());

      if(!isLoggedIn) {
        failure(dispatch, event, 'not logged in');
      } else {

        const uid = authInfo.uid;
        
        const ref = utils.connect('games')
          .child(gameId)
          .child('players')
          .child(uid);

        // Check to see if they already have joined the game
        ref.once('value', snapshot => {

          // If so just update their activity time
          if(snapshot.exists()) {

            ref.child('activeAt').set(Firebase.ServerValue.TIMESTAMP, error => {
              if(!error) {
                success(dispatch, event);
              } else {
                failure(dispatch, event, error.code);
              }
            });

          } else { // If not then add them

            ref.set({status: 'notReady', joinedAt: Firebase.ServerValue.TIMESTAMP, activeAt: Firebase.ServerValue.TIMESTAMP}, error => {
              if(!error) {
                success(dispatch, event);
              } else {
                failure(dispatch, event, error.code);
              }
            });
          }
        });
      }
    }
  },

  readyUp(status) {

    const event = 'readyUp';

    return (dispatch, getState) => {

      const {authInfo, isLoggedIn} = firebaseSelector(getState());
      
      if(!isLoggedIn) {
        failure(dispatch, event, 'not logged in');
      } else {

        const uid = authInfo.uid;

        const gameId = getState().firebaseApp.gameId;

        if(!gameId) {
          failure(dispatch, event, 'game not joined');
        } else {

          utils.connect('games')
          .child(gameId)
          .child('players')
          .child(uid)
          .child('status')
          .set(status, error => {
            if(!error) {
              success(dispatch, event);
            } else {
              failure(dispatch, event, error.code)
            }
          });

        }
      }
    }
  },

}