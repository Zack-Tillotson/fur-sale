// Minimax look ahead engine

import Immutable from 'immutable';

import selector from '../selector';
import engine from '../gameEngine';

function getOptions(state) {
  
  const transformedState = selector(state);
  
  if(transformedState.phase === 'buy') {

    const activePlayer = transformedState.players.find(player => player.get('isActive'));

    const buyOptions = [];
    for(let i = activePlayer.get('minBid') ; i <= activePlayer.get('maxBid'); i++) {
      buyOptions.push(Immutable.fromJS({choice: 'raiseTo', amount: i}));
    }
    return [Immutable.fromJS({choice: 'pass'}), ...buyOptions];

  } else {

    const sellOptions = [];

    transformedState.players
      .filter(player => player.get('isActive'))
      .forEach(activePlayer => {
        activePlayer.get('buyCards').map(card => {
          sellOptions.push(Immutable.fromJS({choice: 'sell', card, playerId: activePlayer.get('playerId')}));
        });
      });

    return sellOptions;

  }
}

function isStateTerminal(transformedState) {
  return transformedState.phase === 'postgame';
}

function shouldRecurse(transformedState, depth) {
  return depth < 4;
}

function getStateScore(transformedState) {
  const highScore = transformedState.players.reduce((highScore, player) => {
    return player.get('totalMoney') > highScore ? player.get('totalMoney') : highScore
  }, 0);
  return transformedState.players.map(player => {
    return player.get('totalMoney') - highScore;
  })
  .toJS();
}

function getStateHeuristicScore(transformedState) {
  // TODO Heuristic!
  //console.log("Heuristic time!", transformedState);
  return transformedState.players.map(player => 0);
}

function compareStateScores(state, scoreA, scoreB) {
  return scoreB - scoreA;
}

function transitionState(state, option) {
  const seed = state.firebaseApp.getIn(['upstream', 'rngSeed']);
  const engineState = state.firebaseApp.get('engine');
  return {
    ...state, 
    firebaseApp: state.firebaseApp.set('engine', engine.applyDecision(seed, option, engineState)),
  }
}

// Minimax algorithm /////////////////////////////

function minimax(state, depth = 0) {

  const options = getOptions(state);

  const optionScores = options.map(option => {
    const score = minimaxRecursor(transitionState(state, option), depth);
    return {option, score}
  })
  .sort((a, b) => compareStateScores(state, a.score, b.score));
  const scores = optionScores.map(op => op.score);

  return optionScores[0];
}

function minimaxRecursor(state, depth = 0) {

  const transformedState = selector(state);

  if(isStateTerminal(transformedState)) { // If game over
    return getStateScore(transformedState);
  } else if(!shouldRecurse(transformedState, depth)) { // Else if we're giving up
    return getStateHeuristicScore(transformedState);
  } else {
    return minimax(state, depth + 1).score;
  }

}

export default minimax;