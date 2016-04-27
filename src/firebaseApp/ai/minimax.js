// Minimax look ahead engine

import Immutable from 'immutable';

import selector from '../selector';
import engine from '../gameEngine';
import heuristics from './heuristics';

function getOptions(state) {
  
  const transformedState = selector(state);
  
  if(transformedState.phase === 'buy') {

    const activePlayer = transformedState.players.find(player => player.get('isActive'));

    const buyOptions = [];
    for(let amount = activePlayer.get('minBid') ; amount <= activePlayer.get('maxBid'); amount++) {
      const predictedValue = heuristics.predictBidOptionValue(transformedState, amount);
      buyOptions.push(Immutable.fromJS({choice: 'raiseTo', amount, predictedValue}));
    }
    const passOption = Immutable.fromJS({
      choice: 'pass', 
      predictedValue: heuristics.predictPassOptionValue(transformedState)
    });

    const bidOptions = [passOption, ...buyOptions];

    return bidOptions.sort((a, b) => b.predictedValue - a.predictedValue).slice(0, 3); // Only return most promising 3!

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

// End state score
function getStateScore(transformedState) {
  const highScore = transformedState.players.reduce((highScore, player) => {
    return player.get('totalMoney') > highScore ? player.get('totalMoney') : highScore
  }, 0);
  return transformedState.players.reduce(player => player.get('totalMoney') - highScore);
}

// Pre end state scoring
function getStateHeuristicScore(transformedState) {
  switch(transformedState.phase) {
    case 'buy':
      return heuristics.predictBuyPhaseScore(transformedState);
    case 'sell':
      return heuristics.predictSellPhaseScore(transformedState);
  }
}

function compareStateScores(transformedState, scoreA, scoreB, depth) {
  
  let currentPlayerIndex = 0;
  transformedState.players.forEach((player, index) => {
    if(player.get('playerId') == transformedState.activeAiId) {
      currentPlayerIndex = index;
    }
  });

  const diff = scoreB.get(currentPlayerIndex) - scoreA.get(currentPlayerIndex);
  return !diff ? diff : Math.random() - .5;
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
  const transformedState = selector(state);

  const optionScores = options.map(option => {
    const score = minimaxRecursor(transitionState(state, option), depth);
    return {option, score}
  })
  .sort((a, b) => compareStateScores(transformedState, a.score, b.score, depth));

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