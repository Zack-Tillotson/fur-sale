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

    startGame() {
      dispatch(apiActions.startGame());
    },

    makeBet(amount) {
      dispatch(apiActions.makeBet(amount));
    },

    passBet() {
      dispatch(apiActions.passBet());
    },

    sellCard(card) {
      dispatch(apiActions.sellCard(card));
    },

	};
}