import firebaseSelector from '../firebase/selector';

export default (state) => {

  const {authInfo, isLoggedIn} = firebaseSelector(state);

  const game = state.firebaseApp;
  const publicGames = game.get('publicGames');
  const engine = game.get('engine');

  // Phase title
  const phase = engine.get('phase');
  const roundNum = engine.get('roundNum');

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
  let activeAiId = null;
  let isSelfActive = false;
  if(phase === 'buy') {

    const activePlayer = engine.getIn(['players', engine.get('currentPlayer')]);
    const activePlayerId = activePlayer.get('playerId');

    if(activePlayer.get('isAI')) {
      activeAiId = activePlayerId;
    }

    const minBid = engine.get('players').sort((a, b) => b.get('currentBid') - a.get('currentBid')).first().get('currentBid') + 1;

    players = engine.get('players').map(player => {

      const isSelf = authInfo.uid == player.get('playerId');
      const isActive = player.get('playerId') == activePlayerId;
      const isOwner = player.get('playerId') === ownerId;

      if(isSelf) {
        isSelfActive = isActive;
      }

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
      
      return player.merge({
        isSelf, isActive, isOwner, prevAction, ownCards, money, minBid, maxBid
      });

    });


  } else if(phase === 'sell') {

    players = engine.get('players').map(player => {

      const isSelf = authInfo.uid == player.get('playerId');
      const isActive = player.get('currentOffer') === 0;
      const isOwner = player.get('playerId') === ownerId;

      if(isSelf) {
        isSelfActive = isActive;
      }

      if(!activeAiId && isActive && player.get('isAI')) {
        activeAiId = player.get('playerId');
      }

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

      let totalMoney = money;
      if(phase === 'postgame') {
        totalMoney = player.get('sellCards').reduce((soFar, card) => soFar + card, money);
      }
      
      return player.merge({
        isSelf, isActive, isOwner, ownCards, money, totalMoney
      });

    });
  }

  const history = engine.get('diffs').map(diff => {

    const action = diff.get('action');

    switch(action) {
      case 'buyPhaseStarts':
        return diff;
      case 'bid':
        return diff.merge({
          player: players.get(diff.get('player')),
        });
      case 'pass':
      case 'sell':
        const effects = diff.get('effects').map(effect => {
          return effect.merge({
            player: players.get(effect.get('player')),
          });
        });
        return diff.merge({
          player: players.get(diff.get('player')),
          effects,
        });
      default: 
        return diff;
    }
  });

  // Meta information
  const isGameOwner = isLoggedIn && ownerId === authInfo.uid;
  const canJoinGame = isLoggedIn && !!game.get('gameId') && phase === 'pregame';
  const hasJoinedGame = isLoggedIn && sessions.find(session => session.get('playerId') === authInfo.uid && session.get('connectionStatus') !== 'offline');
  const readyToStart = isLoggedIn && phase === 'pregame' && sessions.size > 1 && sessions.size < 7;

  // UI information
  const ui = game.get('ui');

  return {
    publicGames,
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
    readyToStart,
    activeAiId,
    ui,
    isSelfActive,
  };
  
}