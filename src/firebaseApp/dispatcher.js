import actions from './actions';
import apiActions from './apiActions';

export default function(dispatch, props) {

	return {

		createGame() {
      dispatch(apiActions.createGame());
    },

    joinGame(gameId) {
      dispatch(apiActions.joinGame(gameId));
    },

    readyUp(status) {
      dispatch(apiActions.readyUp(status));
    },

	};
}