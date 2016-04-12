import React from 'react';

import InlineCss from 'react-inline-css';
import styles from './styles';

const HowToPlay = React.createClass({

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component">
        <section className="overview">
          <h4>How To Play</h4>
          <div className="desc">
            <div className="majorPoint">Fur Sale is fast and fun card game to play with your friends!</div>
            <div className="cardPoints">
              <div className="cardPoint">
                The game is played in two rounds - the <span className="buyPhaseName">Buy Phase</span> and the <span className="sellPhaseName">Sell Phase</span>.
              </div>
              <div className="cardPoint">
                <img src="image of happy cats and money!" />
              </div>
            </div>
          </div>
        </section>
        <section className="buy">
          <h4>Buy Phase</h4>
          <div className="desc">
            <div className="majorPoint">
              In this phase you acquire investments (kittens)!
            </div>
            <div className="cardPoints">
              <div className="cardPoint">
                You have to spend money to make money, players bid in turn on the shown cards.
                <img src="show some buy cards" />
              </div>
              <div className="cardPoint">
                When a player chooses to <b>pass</b> they get the lowest card on the table and are refunded half of their previous bid.
              </div>
              <div className="cardPoint">
                The player who wins the bid gets the highest card but does not get a refund.
              </div>
            </div>
          </div>
        </section>
        <section className="sell">
          <h4>Sell Phase</h4>
          <div className="desc">
            <div className="majorPoint">
              In this phase sell your investments fur lots of money!
            </div>
            <div className="cardPoints">
              <div className="cardPoint">
                Each round players secretly choose one of their investments to sell.
              </div>
              <div className="cardPoint">
                Everyone reveals their card! The top investment gets the top price! Each other players gets the next highest price in turn.
              </div>
            </div>
          </div>
        </section>
        <section className="endOfGame">
          <h4>End of Game</h4>
          <div className="desc">
            <div className="majorPoint">
              The game is over when all your investments have been sold.
            </div>
            <div className="cardPoints">
              <div className="cardPoint">
                 Everyone adds their payments received and their leftover investment money, the player with the highest wins!
              </div>
            </div>
          </div>
        </section>
      </InlineCss>
    );
  }
});

export default HowToPlay;