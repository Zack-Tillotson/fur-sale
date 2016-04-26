import apiActions from './apiActions';
import ai from './ai';
import selector from './selector';

function requestAction() {
  return function(dispatch, getState) {
    
    const state = getState();
    const hasActiveAi = !!selector(state).activeAiId;

    console.log("Shall we do an AI action?", hasActiveAi);

    if(hasActiveAi) {
      const action = ai(state);
      console.log("making an AI move!", action);
      switch(action.choice) {
        case 'pass':
          console.log("passing!");
          dispatch(apiActions.passBet(action.playerId));
          break;
        case 'raiseTo':
          console.log("raising to " + action.amount);
          dispatch(apiActions.makeBet(action.amount));
          break;
        case 'sell':
          console.log("selling!", action.card, action.playerId);
          dispatch(apiActions.sellCard(action.card, action.playerId));
          break;
      }
    }
  }
}

export default {
  requestAction,
}