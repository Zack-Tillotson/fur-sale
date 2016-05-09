
export default {

  // Buy phase - what is the highest bid going to be?
  // Starts with the average value of the winning card (eg. 30 => $15, 7 => $3.5, etc)
  // Add a constant value for the value of getting initial bid
  predictHighBid(state) {
    return (state.visibleCards.last() - state.visibleCards.pop().last()) / 2 + .5;
  },

  // This function predicts the likely value an investment card will give during
  // the sell phase. A 15 looks a lot better if every other card has been 0-10 and 
  // if every other card is 20-30!
  predictCardValues(state) {
    return state.visibleCards.map((card, index) => {
      const positionBenefit = 4 + index * 2;
      return card / 2 + positionBenefit;
    });
  },

}