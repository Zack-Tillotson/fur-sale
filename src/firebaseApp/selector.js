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
  
  // Sessions
  const ownerId = game.getIn(['upstream', 'owner']);

  const sessions = game.get('sessions').map(session => {
    const isSelf = authInfo.uid == session.get('playerId');
    const isOwner = session.get('playerId') === ownerId;

    return session.merge({
      isSelf, isOwner
    });
  });

  // Players
  let players;
  let roundNum = 1;
  if(phase === 'buy') {

    const activePlayerId = engine.getIn(['players', engine.get('currentPlayer')]).get('playerId');
    const minBid = engine.get('players').sort((a, b) => b.get('currentBid') - a.get('currentBid')).first().get('currentBid') + 1;

    players = engine.get('players').map(player => {

      const isSelf = authInfo.uid == player.get('playerId');
      const isActive = player.get('playerId') == activePlayerId;
      const isOwner = player.get('playerId') === ownerId;

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
      roundNum = 1 + ownCards.size;
      
      return player.merge({
        isSelf, isActive, isOwner, prevAction, ownCards, money, minBid, maxBid
      });

    });


  } else if(phase === 'sell') {

    players = engine.get('players').map(player => {

      const isSelf = authInfo.uid == player.get('playerId');
      const isActive = player.get('currentOffer') === 0;
      const isOwner = player.get('playerId') === ownerId;

      const money = player.get('money');

      let ownCards = player.get('buyCards').map(card => isSelf ? card : 0).sort();
      
      return player.merge({
        isSelf, isActive, isOwner, ownCards, money
      });

    });

  } else {

    players = engine.get('players').map(player => {

      const isSelf = authInfo.uid == player.get('playerId');
      const isActive = player.get('currentOffer') === 0;
      const isOwner = player.get('playerId') === ownerId;

      const money = player.get('money');

      let ownCards = player.get('buyCards').map(card => isSelf ? card : 0).sort();
      
      return player.merge({
        isSelf, isActive, isOwner, ownCards, money
      });

    });
  }

  const history = engine.get('diffs');

  // Meta information
  const isGameOwner = isLoggedIn && ownerId === authInfo.uid;
  const canJoinGame = isLoggedIn && !!game.get('gameId') && phase === 'pregame';
  const hasJoinedGame = isLoggedIn && sessions.find(session => session.get('playerId') === authInfo.uid && session.get('connectionStatus') !== 'offline');
  const readyToStart = isLoggedIn && phase === 'pregame' && sessions.size > 1 && sessions.size < 7;

  return {
    game,
    phase,
    roundNum,
    visibleCards,
    visibleCardsGone,
    deckCardCount,
    players,
    history,
    roundNum,
    sessions,
    isGameOwner,
    canJoinGame,
    hasJoinedGame,
    readyToStart
  };
  
}