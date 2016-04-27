const ROUND_COUNTS = {
  2: 5,
  3: 8,
  4: 7,
  5: 6,
  6: 5,
}

export default {

  // A bid amount's predicted value (relative to other bid amounts and the pass option)
  //   + player money
  //   + owned buy cards
  //   - bid amount
  //   + average of visible cards
  //   + # rounds left * average card
  predictBidOptionValue(transformedState, bidAmount) {

    const activePlayer = transformedState.players.find(player => player.get('isActive'));
    const visibleCards = transformedState.visibleCards;
    const totalRounds = ROUND_COUNTS[transformedState.players.size];
    const roundsLeft = totalRounds - activePlayer.get('buyCards').size;
    const averageCardValue = 15.5; // sum(1...30)/30
    
    const money = activePlayer.get('money');
    const ownedBuyCards = activePlayer.get('buyCards').reduce((soFar, card) => soFar + card, 0);
    const averageVisibleCard = visibleCards.reduce((soFar, card) => soFar + card) / (visibleCards.size || 1);
    const predictedRestOfCards = roundsLeft * averageCardValue;

    return money + ownedBuyCards - bidAmount + averageVisibleCard + predictedRestOfCards;
    
  },

  // Pass option value (relative to bid amounts)
  //   + player money
  //   + owned buy cards
  //   + bid refund
  //   + lowest value visible card
  //   + # rounds left * average card
  predictPassOptionValue(transformedState) {

    const activePlayer = transformedState.players.find(player => player.get('isActive'));
    const visibleCards = transformedState.visibleCards;
    const totalRounds = ROUND_COUNTS[transformedState.players.size];
    const roundsLeft = totalRounds - activePlayer.get('buyCards').size;
    const averageCardValue = 15.5; // sum(1...30)/30
    
    const money = activePlayer.get('money');
    const ownedBuyCards = activePlayer.get('buyCards').reduce((soFar, card) => soFar + card, 0);
    const bidRefund = Math.floor(activePlayer.get('currentBid') / 2);
    const lowestVisibleCard = visibleCards.get(0);
    const predictedRestOfCards = roundsLeft * averageCardValue;

    return money + ownedBuyCards + bidRefund + lowestVisibleCard + predictedRestOfCards;
    
  },

  predictSellOptionValue() {

  },

  // Predict how well a player will do during the buy phase
  //   + player money
  //   + owned buy cards
  predictBuyPhaseScore(transformedState) {

    const highScore = transformedState.players.reduce((highScore, player) => {
      const buyCardsValue = player.get('buyCards').reduce((soFar, card) => soFar + card, 0);
      const money = player.get('money') + player.get('currentBid');
      return Math.max(buyCardsValue + money, highScore);
    }, 0);

    return transformedState.players.map(player => {
      const buyCardsValue = player.get('buyCards').reduce((soFar, card) => soFar + card, 0);
      const money = player.get('money') + player.get('currentBid');
      return buyCardsValue + money - highScore;
    });
  },

  // Predict how well a player will do during the sell phase
  //   + player money
  //   + owned sell cards
  //   + owned buy card value * average sell value per buy value
  predictSellPhaseScore(transformedState) {

    const highScore = transformedState.players.reduce((highScore, player) => {
      const money = player.get('money');
      const sellCardsValue = player.get('sellCards').reduce((soFar, card) => soFar + card, 0);
      const buyCardsValue = player.get('buyCards').reduce((soFar, card) => soFar + card, 0);
      const avgBuyToSellProportion = 2; // Buy cards are worth ~2x a sell card

      return Math.max(money + sellCardsValue + buyCardsValue / avgBuyToSellProportion, highScore);
    }, 0);

    return transformedState.players.map(player => {
      const money = player.get('money');
      const sellCardsValue = player.get('sellCards').reduce((soFar, card) => soFar + card, 0);
      const buyCardsValue = player.get('buyCards').reduce((soFar, card) => soFar + card, 0);
      const avgBuyToSellProportion = 2; // Buy cards are worth ~2x a sell card

      return money + sellCardsValue + buyCardsValue / avgBuyToSellProportion - highScore;
    });
  },

}