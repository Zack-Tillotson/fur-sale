// Fur Sale AI using minimax lookahead

import selector from '../selector';
import heuristics from './heuristics';

// Buy Phase /////////////////////////////
// Calculate expected costs for each place
//   eg. Winning bid will be $7
// Calculate worth of each placement in rankings
//   eg. Winning card worth $7.5, second worth $3, last worth $1
// Calculate expected return per bid (only consider taking top, second, or last)
//   eg. Bidding 8 => Wins bid worth $7.5 => Net -$0.5
//   eg. Bidding 7 => Wins bid worth $7.5 => Net $0
//   eg. Bidding 6 => Takes second best card worth $3 and refund $3 => Net $6
//   eg. ...
//   eg. Pass => Takes card worth $1 => Net $1
// Sort by Net value and take first!
//
// Sell Phase /////////////////////////////
// ??? Not sure!
///////////////////////////////////////////
function makeDecision(state) {

  state = selector(state);

  if(state.phase === 'buy') {

    const currentPlayer = state.players.find(player => player.get('isActive'));

    const expectedHighBid = heuristics.predictHighBid(state);
    const expectedCardValues = heuristics.predictCardValues(state);

    const bids = [0]; // Can always pass
    for(let i = currentPlayer.get('minBid'); i <= currentPlayer.get('maxBid'); i++) {
      bids.push(i);
    }

    const bidArray = bids.map(bid => {

      let value;
      if(bid === 0) { // Will pass
        value = (expectedCardValues.first() - expectedCardValues.unshift().first()) / 2 + Math.floor(currentPlayer.get('currentBid') / 2);
      } else if(bid >= expectedHighBid) { // Will win
        value = expectedCardValues.last() / 2 - bid;
      } else {
        value = expectedCardValues.pop().last() / 2 - Math.ceil(bid / 2);
      }

      return {bid, value}
    });

    const bestBid = bidArray.sort((a, b) => b.value - a.value || a.bid - b.bid)[0];

    if(bestBid.bid === 0) {
      return {choice: 'pass'}
    } else {
      return {choice: 'raiseTo', amount: bestBid.bid};
    }

  } else if(state.phase === 'sell') {

    const player = state.players.find(player => player.get('playerId') === state.activeAiId);

    const playerId = player.get('playerId');
    const card = player.get('buyCards').sort((a, b) => Math.random() - .5).first();
    
    return {choice: 'sell', card, playerId};
  }

}

export default makeDecision;