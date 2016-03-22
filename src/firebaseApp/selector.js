import firebaseSelector from '../firebase/selector';

export default (state) => {

  const {authInfo, isLoggedIn} = firebaseSelector(state);

  const game = state.firebaseApp;
  const engine = game.get('engine');

  // Phase title
  const phase = engine.get('phase');

  // Table
  const visibleCards = engine.getIn(['table', 'visibleCards']);
  const visibleCardsGone = engine.get('players').size - visibleCards.size;
  const deckCardCount = engine.getIn(['table', 'deckCards']).size - engine.getIn(['table', 'goneCardCount']);
  const minBid = phase == 'buy'
    ? engine.get('players').sort((a, b) => b.get('currentBid') - a.get('currentBid')).first().get('currentBid') + 1
    : 0;

    // Sessions
  const sessions = game.get('sessions').map(session => {
    const isSelf = authInfo.uid == session.get('playerId');

    return session.merge({
      isSelf
    });
  });

  // Players
  const activePlayerId = phase == 'buy'
    ? engine.getIn(['players', engine.get('currentPlayer')]).get('playerId')
    : '';
  const players = engine.get('players').map(player => {

    const isSelf = authInfo.uid == player.get('playerId');
    const isActive = player.get('playerId') == activePlayerId;

    let prevAction;
    if(player.get('hasPassed')) {
      prevAction = 'pass';
    } else if(player.get('currentBid') > 0) {
      prevAction = 'bet';
    } else {
      prevAction = 'noAction';
    }

    const money = player.get('money') - player.get('currentBid');
    const maxBid = player.get('money');

    const ownCards = player.get('buyCards').map(card => isSelf ? card : 0);
    //TODO empty cards

    return player.merge({
      isSelf, isActive, prevAction, ownCards, money, minBid, maxBid
    });

  });

  // Meta information
  const isGameOwner = isLoggedIn && game.getIn(['upstream', 'owner']) === authInfo.uid;
  const canJoinGame = isLoggedIn && !!game.get('gameId') && phase === 'pregame';
  const hasJoinedGame = isLoggedIn && sessions.find(session => session.get('playerId') === authInfo.uid && session.get('connectionStatus') !== 'offline');
  const readyToStart = isLoggedIn && phase === 'pregame' && sessions.size > 2 && sessions.size < 7 && !sessions.find(session => session.get('status') !== 'ready');

  return {game, phase, visibleCards, visibleCardsGone, deckCardCount, minBid, players, sessions, isGameOwner, canJoinGame, hasJoinedGame, readyToStart};
  
}