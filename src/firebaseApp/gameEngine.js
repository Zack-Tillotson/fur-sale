// Given a random seed and a list of decions made by the players
// return the current state of the game.

import util from './util';

const INITIAL_DISCARD_SIZE = 6;
const INITIAL_PLAYER_MONEY = 14;

// State shape:
// {
//   phase: 'pregame', // [pregame, buy, sell, postgame] From game mode and decisions
//   table: {
//     deckCards: [], // The cards left in the deck
//     goneCardCount: 0, // How many cards from the deck have been secretely discarded
//     visibleCards: [], // The visible cards on the table
//   },
//   players: [], // Maps to the sessions, {playerId, money, cards}
//   currentPlayer: '',
//   rngUse: 0, // The number of times the RNG has been used since seeding
// }

function getInitialState(seed, sessions) {

  const rng = util.getRng(seed);

  const phase = 'buy';
  const players = sessions.map((session, playerId) => {
    return session.merge({
      playerId,
      money: INITIAL_PLAYER_MONEY
     });
  });
  const currentPlayer = players.first().get('playerId');

  const cards = [];
  for(let i = 1 ; i <= 30 ; i++) {
    cards.push(i);
  }
  util.shuffle(rng, cards);

  const visibleCards = cards.slice(0, players.size);
  const deckCards = cards.slice(players.size);
  const goneCardCount = INITIAL_DISCARD_SIZE;

  const table = {deckCards, visibleCards, goneCardCount};

  const rngUse = rng.getUseCount();

  return {phase, table, players, currentPlayer, rngUse};
  
}

function applyDecision(seed, decision, state) {

  return state.toJS();

}

export default {getInitialState, applyDecision};