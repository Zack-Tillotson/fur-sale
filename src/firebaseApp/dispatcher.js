import actions from './actions';
import apiActions from './apiActions';
import aiActions from './aiActions';

const persona = ['default'];

export default function(dispatch, props) {

	return {

		createGame(isPublic) {
      return dispatch(apiActions.createGame(isPublic));
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

    updatePlayerColor(color) {
      dispatch(apiActions.updateSessionInfo({color}));
    },

    updatePlayerPersona(persona) {
      dispatch(apiActions.updateSessionInfo({persona}));
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