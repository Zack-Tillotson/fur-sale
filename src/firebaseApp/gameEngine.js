// Given a random seed and a list of decions made by the players
// return the current state of the game.

import Immutable from 'immutable';
import util from './util';

const INITIAL_PLAYER_MONEY = 14;
const DECK_SIZE = 30;
const GONE_CARD_COUNTS = {2: 24, 3: 6, 4: 0, 5: 0};

// State shape:
// {
//   phase: 'pregame', // [pregame, buy, sell, postgame] From game mode and decisions
//   table: {
//     deckCards: [], // The cards left in the deck
//     goneCardCount: 0, // How many cards from the deck have been secretely discarded
//     visibleCards: [], // The visible cards on the table
//   },
//   players: [], // Maps to the sessions, {playerId, money, buyCards, sellCards, currentBid, currentOffer}
//   currentPlayer: 0,
//   rngUse: 0, // The number of times the RNG has been used since seeding
//   diffs: [], // Important differences in game states (when players make bids or take cards)
// }

function getInitialBuyPhaseState(seed, sessions) {

  const rng = util.getRng(seed);

  const players = sessions.map((session, playerId) => {
    return session.merge({
      playerId,
      money: INITIAL_PLAYER_MONEY,
      currentBid: 0,
      hasPassed: false,
      buyCards: [],
     });
  }).toList().toJS();
  util.shuffle(rng, players);

  const cards = [];
  for(let i = 1 ; i <= DECK_SIZE ; i++) {
    cards.push(i);
  }
  util.shuffle(rng, cards);

  const phase = 'buy';
  const currentPlayer = 0;
  const visibleCards = cards.slice(0, players.length).sort();
  const deckCards = cards.slice(players.length);
  const goneCardCount = GONE_CARD_COUNTS[players.length] || 0;

  const rngUse = rng.getUseCount();

  const state = Immutable.fromJS({
    phase, 
    table: {deckCards, visibleCards, goneCardCount}, 
    players, 
    currentPlayer,
    rngUse,
    diffs: [{
      action: 'buyPhaseStarts',
    }],
  });
  
  return state;
}

function getInitialSellPhaseState(state, rng) {

  const players = state.get('players').map(player => {
    return player.merge({
      usedBuyCards: [],
      sellCards: [],
      currentOffer: 0,
    })
    .remove('currentBid')
    .remove('hasPassed')
    .remove('maxBid')
    .remove('minBid')
    .remove('prevAction');
  });

  const cardsAry = [];
  for(let i = 0 ; i <= 15 ; i++) {
    if(i == 1) {
      i++;
    }
    cardsAry.push(i);
    cardsAry.push(i);
  }
  util.shuffle(rng, cardsAry);
  const cards = Immutable.fromJS(cardsAry);

  const phase = 'sell';
  const visibleCards = cards.take(players.size).sort();
  const deckCards = cards.skip(players.size);
  const goneCardCount = GONE_CARD_COUNTS[players.size] || 0;

  const diffs = state.get('diffs').push(Immutable.fromJS({
    action: 'sellPhaseStarts',
  }));

  state = state.merge({
    phase,
    table: Immutable.Map({deckCards, visibleCards, goneCardCount}),
    players,
    diffs,
  });

  return state;

}

function findNextPlayers(state) {

  const currentPlayer = state.get('currentPlayer');
  const activeBidders = [];

  let nextPlayer = currentPlayer;
  for(let i = 0 ; i < state.get('players').size ; i++) {
    nextPlayer = (nextPlayer + 1) % state.get('players').size;
    
    if(!state.getIn(['players', nextPlayer, 'hasPassed'])) {
      activeBidders.push(nextPlayer);
    }
  }

  return activeBidders;

}

// 1. Set player bet to bet amount
// 2. Set current player to the next non passed player
function applyBuyDecisionToRaise(decision, state) {

  const bid = decision.get('amount');
  const currentPlayer = state.get('currentPlayer');

  state = state.setIn(['players', currentPlayer, 'currentBid'], bid);

  let nextPlayer = findNextPlayers(state)[0];
  state = state.set('currentPlayer', nextPlayer);

  state = state.updateIn(['diffs'], diffs => diffs.push(Immutable.fromJS({
    action: 'bid',
    player: currentPlayer,
    nextPlayer,
    bid,
  })));

  return state;

}

// 1. Show the current player as having passed
// 2. Remove their bid loss (half or all)
// 3. Move the lowest visible card to the player card list
function cashOutBid(state, playerIndex, bidLost) {
  const cardGained = state.getIn(['table', 'visibleCards', 0]);

  state = state.setIn(['players', playerIndex, 'hasPassed'], true);
  state = state.updateIn(['players', playerIndex, 'money'], money => money - bidLost);
  state = state.updateIn(['players', playerIndex, 'buyCards'], Immutable.List(), cards => 
    cards.push(cardGained)
  );
  state = state.updateIn(['table', 'visibleCards'], Immutable.List(), cards => cards.shift());

  return state;
}

// 1. Cash out the current player
// 2. If there is only one player left reset the round
// 3. Resetting is: if cards left in buy round then start over otherwise
//    initialize selling phase
function applyBuyDecisionToPass(rng, decision, state) {

  const currentPlayer = state.get('currentPlayer');
  const currentBid = state.getIn(['players', currentPlayer, 'currentBid']);
  const currentBidLost = Math.ceil(currentBid / 2);
  state = cashOutBid(state, currentPlayer, currentBidLost);

  const effects = [{
    player: currentPlayer,
    reclaims: currentBid - currentBidLost,
    pays: currentBidLost,
    card: state.getIn(['players', currentPlayer, 'buyCards']).last(),
  }];

  const activeBidders = findNextPlayers(state);
  state = state.set('currentPlayer', activeBidders[0]);
  
  let endOfRound = false;
  if(activeBidders.length === 1) { // Round over!
    
    const winningPlayer = activeBidders[0];
    const winningBid = state.getIn(['players', winningPlayer, 'currentBid']);
    state = cashOutBid(state, winningPlayer, winningBid);

    effects.push({
      player: winningPlayer,
      reclaims: 0,
      pays: winningBid,
      card: state.getIn(['players', winningPlayer, 'buyCards']).last(),
    });

    endOfRound = true;
  }

  state = state.updateIn(['diffs'], diffs => diffs.push(Immutable.fromJS({
    action: 'pass',
    player: currentPlayer,
    endOfRound,
    effects
  })));

  if(endOfRound) {

    const cardsInDeck = state.getIn(['table', 'deckCards']).size - state.getIn(['table', 'goneCardCount']);
    const playerCount = state.get('players').size;

    if(cardsInDeck > 0) { // Still have cards to buy?

      state = state.updateIn(['table'], table => {
        const visibleCards = table.get('deckCards').take(playerCount).sort();
        const deckCards = table.get('deckCards').skip(playerCount);
        return table.merge({visibleCards, deckCards});
      });
      state = state.updateIn(['players'], Immutable.List(), players => 
        players.map(player => player.merge({
          hasPassed: false,
          currentBid: 0
        }))
      );

    } else { // Buy phase over - selling time!
      state = getInitialSellPhaseState(state, rng);
    }
  }

  return state;

}


function applySellDecision(decision, state) {

  const playerId = decision.get('playerId');
  const card = decision.get('card');

  state = state.updateIn(['players'], players => players.map(player => {
    if(player.get('playerId') === playerId) {
      player = player.set('currentOffer', parseInt(card));
    }
    return player;
  }));

  const allPlayersIn = !state.get('players').filter(player => player.get('currentOffer') == 0).size;

  if(allPlayersIn) {

    const effects = [];

    // Move visible cards to players according to their offered card
    while(state.hasIn(['table', 'visibleCards', 0])) {
      const cardToGive = state.getIn(['table', 'visibleCards']).last();
      const highBid = state
        .get('players')
        .sort((a, b) => a.get('currentOffer') - b.get('currentOffer'))
        .last()
        .get('currentOffer');
      state = state.updateIn(['table', 'visibleCards'], cards => cards.skipLast(1));
      state = state.updateIn(['players'], (players, index) => players.map((player, index) => {
        if(player.get('currentOffer') == highBid) {
          player = player.merge({
            currentOffer: 0,
            sellCards: player.get('sellCards').push(cardToGive),
            buyCards: player.get('buyCards').filter(card => card != highBid),
            usedBuyCards: player.get('usedBuyCards').push(highBid),
          });
          effects.push({
            player: index,
            buyCard: highBid,
            sellCard: cardToGive,
          });
        }
        return player;
      }));
    }

    state = state.updateIn(['diffs'], diffs => diffs.push(Immutable.fromJS({
      action: 'sell',
      effects,
    })));

    const cardsInDeck = state.getIn(['table', 'deckCards']).size - state.getIn(['table', 'goneCardCount']);
    const playerCount = state.get('players').size;

    if(cardsInDeck > 0) { // Still have cards to sell?
      state = state.updateIn(['table'], table => {
        const visibleCards = table.get('deckCards').take(playerCount).sort();
        const deckCards = table.get('deckCards').skip(playerCount);
        return table.merge({visibleCards, deckCards});
      });
    } else {
      state = state.set('phase', 'postgame');
      state = state.updateIn(['diffs'], diffs => diffs.push(Immutable.fromJS({
        action: 'gameover',
      })));
    }

  }

  return state;
}

function applyDecision(seed, decision, state) {

  const rng = util.getRng(seed, state.get('rngUse'));

  switch(state.get('phase')) {
    case 'buy':
      if(decision.get('choice') === 'raiseTo') {
        state = applyBuyDecisionToRaise(decision, state);
      } else if(decision.get('choice') === 'pass') {
        state = applyBuyDecisionToPass(rng, decision, state);
      } 
      
      break;

    case 'sell':
      state = applySellDecision(decision, state);
      break;
  }

  state = state.set('rngUse', rng.getUseCount());

  return state;

}

export default {getInitialBuyPhaseState, applyDecision};