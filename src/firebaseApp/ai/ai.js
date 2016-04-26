// Fur Sale AI using minimax lookahead

import minimax from './minimax';

function makeDecision(state) {

  const bestOption = minimax(state).option;
  return bestOption.toJS();

}

export default makeDecision;