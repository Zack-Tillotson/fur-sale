// Classic minimax test case - tic tac toe!
//
// State is an array with 9 items, each of value 0, 1, or 2. 0 is means
// unoccupied, 1 and 2 are the players. The array indeces translate to a 
// 3x3 board like this:
//    0 | 1 | 2
//    ---------
//    3 | 4 | 5
//    ---------
//    6 | 7 | 8
//
// The current player is implicit by the number of non zero values. Player 1
// goes first, player 2 goes second, then again player 1, etc. If there are 
// 3 non 0 values then it's player 2's turn.
//
// The score of a game is an array with two values, one for each player.
// Each player's score is from their own perspective and 1 if they've won,
// -1 if they've lost, and 0 otherwise.

import minimax from './minimax';

// Should never get more than 50 levels deep
function shouldRecurse(state, depth) {
  return depth < 50;
}

function isStateTerminal(state) {
  return getWinner(state) > 0 || typeof state.find(item => item === 0) === 'undefined';
}

function getWinner(state) {
  return areAllSame(state, 0, 1, 2)
    || areAllSame(state, 3, 4, 5)
    || areAllSame(state, 6, 7, 8)
    || areAllSame(state, 0, 3, 6)
    || areAllSame(state, 1, 4, 7)
    || areAllSame(state, 2, 5, 8)
    || areAllSame(state, 0, 4, 8)
    || areAllSame(state, 2, 4, 6);
}

function areAllSame(state, a, b, c) {
  const player = state[a];
  const areSame = state[a] === state[b] && state[b] === state[c];
  return areSame ? player : 0;
}

function getStateScore(state) {
  const winner = getWinner(state);
  const aScore = winner === 1 ? 1 : (winner === 2 ? -1 : 0);
  const bScore = -1 * aScore;
  return [aScore, bScore];
}

// Shouldn't be called
function getStateHeuristicScore(state) {
  return [0, 0];
}

function getOptions(state) {
  return state.map((value, index) => value === 0 ? index : -1).filter(value => value >= 0);
}

function getCurrentPlayer(state) {
  return state.filter(value => value > 0).length % 2 + 1;
}

function compareStateScores(state, scoreA, scoreB) {
  const currentPlayer = getCurrentPlayer(state) - 1;
  const difference = scoreB[currentPlayer] - scoreA[currentPlayer];
  return difference !== 0 ? difference : Math.random() - .5;
}

function transitionState(state, option) {
  const currentPlayer = getCurrentPlayer(state);
  const newState = [...state];
  newState[option] = currentPlayer;
  return newState;
}

//////// Runner ////////////

let state = [0, 0, 0, 0, 0, 0, 0, 0, 0];
printState(state);

let turn = 0;
while(!isStateTerminal(state) && turn < 9) {

  turn++;

  const bestOption = minimax(state, {
    shouldRecurse,
    isStateTerminal,
    getStateScore,
    getStateHeuristicScore,
    getOptions,
    getCurrentPlayer,
    compareStateScores,
    transitionState,
  }).option;

  const options = getOptions(state);
  const chosenOption = Math.random() > 0 ? bestOption : options.sort((a, b) => Math.random() - .5)[0];

  const newState = transitionState(state, chosenOption);

  console.log(`Player ${getCurrentPlayer(state)} chooses ${chosenOption}`);
  printState(newState);
  
  state = newState;

}

function printState(state) {
  function who(state, index) {
    switch(state[index]) {
      case 0: return ' ';
      case 1: return 'x';
      case 2: return 'o';
    }
  }
  console.log(` ${who(state, 0)} | ${who(state, 1)} | ${who(state, 2)}`);
  console.log('---|---|---');
  console.log(` ${who(state, 3)} | ${who(state, 4)} | ${who(state, 5)}`);
  console.log('---|---|---');
  console.log(` ${who(state, 6)} | ${who(state, 7)} | ${who(state, 8)}`);
}

const winningPlayer = getWinner(state);
if(winningPlayer > 0) {
  console.log(`Game Over! Player ${getWinner(state)} won in ${turn} turns`);
} else {
  console.log(`Game Over! Tie game after ${turn} turns`);
}
