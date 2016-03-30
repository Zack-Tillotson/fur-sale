import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

import Card from '../Card';

export default React.createClass({

  propTypes: {
    visibleCards: React.PropTypes.object.isRequired,
    visibleCardsGone: React.PropTypes.number.isRequired,
    phase: React.PropTypes.string.isRequired,
    cardClickHandler: React.PropTypes.func,
    cardRound: React.PropTypes.oneOf(['large', 'small']),
  },

  getDefaultProps() {
    return {
      cardClickHandler() {},
      size: "large",
    }
  },

  cardClickHandler(value) {
    this.props.cardClickHandler(value);
  },

  render() {

    const sizeClass = this.props.size;

    return (
      <InlineCss stylesheet={styles} componentName="component" className={sizeClass}>
        <ReactCSSTransitionGroup
          transitionName="dealCardRound"
          transitionEnterTimeout={2000}
          transitionLeaveTimeout={2000}>
            <div className="cardRound" key={this.props.cardRound}>
              <ReactCSSTransitionGroup
                transitionName="dealCard"
                transitionEnterTimeout={2000}
                transitionAppear={true}
                transitionAppearTimeout={2000}
                transitionLeaveTimeout={2000}>
                {this.props.visibleCards.sort().map(card => (
                  <Card 
                    key={card}
                    value={card}
                    size={this.props.size}
                    type={this.props.phase}
                    cardClickHandler={this.props.cardClickHandler} 
                    isTaken={false} />
                ))}
              </ReactCSSTransitionGroup>
            </div>
        </ReactCSSTransitionGroup>
      </InlineCss>
    );
    
  }
});