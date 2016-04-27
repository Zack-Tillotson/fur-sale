import apiActions from './apiActions';
import ai from './ai';
import selector from './selector';

function requestAction() {
  return function(dispatch, getState) {
    
    const state = getState();
    const hasActiveAi = !!selector(state).activeAiId;

    if(hasActiveAi) {
      const action = ai(state);
      switch(action.choice) {
        case 'pass':
          dispatch(apiActions.passBet(action.playerId));
          break;
        case 'raiseTo':
          dispatch(apiActions.makeBet(action.amount));
          break;
        case 'sell':
          dispatch(apiActions.sellCard(action.card, action.playerId));
          break;
      }
    }
  }
}

export default {
  requestAction,
}