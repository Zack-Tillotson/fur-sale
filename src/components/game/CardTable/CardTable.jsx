import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';
import Card from '../Card';

export default React.createClass({

  propTypes: {
    visibleCards: React.PropTypes.object.isRequired,
    visibleCardsGone: React.PropTypes.number.isRequired,
    phase: React.PropTypes.string.isRequired,
  },

  getCards() {
    const ret = [];
    for(let i = 0 ; i < this.props.visibleCardsGone ; i++) {
      ret.push(this.getCard(i, 0, true));
    }
    for(let i = 0 ; i < this.props.visibleCards.size ; i++) {
      const key = this.props.visibleCardsGone + i;
      const card = this.props.visibleCards.get(i);
      ret.push(this.getCard(key, card));
    }
    return ret;
  },

  getCard(key, value = 0, isTaken = false) {
    const takenClass = isTaken ? 'taken' : 'notTaken';
    
    return (
      <div key={key} className={`card value${value} ${takenClass} ${this.props.phase}}`}>
        {value > 0 && value}
        <div className="cover takenCover">Taken</div>
        <div className="cover dealingCover">Dealing</div>
      </div>
    );
  },

  render() {
    const sizeClass = this.props.small ? 'small' : 'large';
    return (
      <InlineCss stylesheet={styles} componentName="component" className={sizeClass}>
        {this.getCards()}
      </InlineCss>
    );
  }
});