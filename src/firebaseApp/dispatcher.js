import actions from './actions';
import apiActions from './apiActions';
import aiActions from './aiActions';

export default function(dispatch, props) {

	return {

		createGame(onSuccess) {
      return dispatch(apiActions.createGame());
    },

    joinGame(gameId) {
      dispatch(apiActions.joinGame(gameId));
    },

    startGame() {
      dispatch(apiActions.startGame());
    },

    addAiPlayer() {
      dispatch(apiActions.addAiPlayer());
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

    requestAiAction() {
      dispatch(aiActions.requestAction());
    },

    updatePlayerName(name) {
      dispatch(apiActions.updateSessionInfo({name}));
    },

    beginSyncPublicGameList() {
      return dispatch(apiActions.beginSyncGameList());
    },

    endSyncPublicGameList(id) {
      dispatch(apiActions.endSyncGameList());
    },

    beginSyncGameData(id) {
      return dispatch(apiActions.beginSyncGameData(id));
    },

    endSyncGameData(id) {
      dispatch(apiActions.endSyncGameData(id));
    },

	};
}