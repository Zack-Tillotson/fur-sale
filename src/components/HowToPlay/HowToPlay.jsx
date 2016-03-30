import React from 'react';

import InlineCss from 'react-inline-css';
import styles from './styles';

const HowToPlay = React.createClass({

  propTypes: {

  },

  getDefaultProps() {
    return {

    }
  },

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component">
        <h3>How To Play</h3>
        <section>
          <h4>Overview</h4>
          <p>Fur Sale is fast and fun card game to play with your friends! You are an investor looking to make money, first acquire investments in the <b>Buy Phase</b> and then flip them for profit in the <b>Sell Phase</b>.</p>
        </section>
        <section>
          <h4>Buy Phase</h4>
          <p>Take turns bidding on the shown cards. The first player to <b>pass</b> gets the lowest card left and half (rounded down) of any outstanding bids. The player who wins the bid gets the highest card but does not get a refund on his bid.</p>
        </section>
        <section>
          <h4>Sell Phase</h4>
          <p>Each round players secretly choose one of the cards they acquired in the Buy Phase to sell. When all players have chosen all cards are revealed, players receive the payment according to who revealed the highest valued cards.</p>
        </section>
      </InlineCss>
    );
  }
});

export default HowToPlay;