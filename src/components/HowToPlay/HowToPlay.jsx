import React from 'react';

import InlineCss from 'react-inline-css';
import styles from './styles';

const HowToPlay = React.createClass({

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component">
        <section className="overview">
          <div className="desc">
            <div className="majorPoint">Fur Sale is fast and fun card game you play with your friends!</div>
            <div className="cardPoints">
              <div className="cardPoint">
                The game is played in two rounds - the <span className="buyPhaseName">Buy Phase</span> and the <span className="sellPhaseName">Sell Phase</span>.
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
                Each round every player gets an investment card and players bid to get the best cards.
                <div className="cardPointLogo">
                  <img src="/assets/howToPlay/buycards.png" />
                </div>
              </div>
              <div className="cardPoint">
                When a player chooses to <b>pass</b> they get the lowest card on the table and are refunded half of their previous bid.
                <div className="cardPointLogo">
                  <img src="/assets/howToPlay/passrefund.png" />
                </div>
              </div>
              <div className="cardPoint">
                The player who wins the bid gets the highest card but does not get a refund.
                <div className="cardPointLogo">
                  <img src="/assets/howToPlay/passwin.png" />
                </div>
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
                Each round every players sells an investment card and gains a price card.
                <div className="cardPointLogo">
                  <img src="/assets/howToPlay/sellcards.png" />
                </div>
              </div>
              <div className="cardPoint">
                Eeryone secretly choose one of their investments to sell.
                <div className="cardPointLogo">
                  <img src="/assets/howToPlay/choosesell.png" />
                </div>
              </div>
              <div className="cardPoint">
                The highest investment card gets the top price! Each other players gets the next highest price in turn.
                <div className="cardPointLogo">
                  <img src="/assets/howToPlay/matchingcards.png" />
                </div>
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
                 <div className="cardPointLogo">
                  <img className="luckyCat" src="/assets/howToPlay/luckycat.png" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </InlineCss>
    );
  }
});

export default HowToPlay;