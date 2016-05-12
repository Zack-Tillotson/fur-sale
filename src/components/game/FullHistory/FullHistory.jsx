import React from 'react';
import InlineCss from "react-inline-css";

import styles from './styles';

const FullHistory = React.createClass({

  propTypes: {
    history: React.PropTypes.object.isRequired,
  },

  getHistoryItem(item, index) {

    switch(item.get('action')) {
      case 'buyPhaseStarts':
        return (
          <div className="historyItem buyStart">&nbsp;</div>
        );
      case 'bid':
        return (
          <div className="historyItem bid">
            ${item.get('bid')}
          </div>
        );
      case 'pass':
        const endOfBiddingClass = item.get('endOfRound') ? 'endOfRound' : 'midRound';
        return (
          <div className={`historyItem pass ${endOfBiddingClass}`}>
            &nbsp;
          </div>
        );
      case 'sellPhaseStarts':
        return (
          <div className="historyItem sellStart">&nbsp;</div>
        );
      case 'sell':
        return (
          <div className="historyItem sell">&nbsp;</div>
        );
      case 'gameover':
        return (
          <div className="historyItem gameOver">&nbsp;</div>
        );
      default:
        return (
          <div className="historyItem">
            ?
          </div>
        );
    }
  },

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component" className="history">
        <div className="historyItems">
          {this.props.history.reverse().take(10).map(this.getHistoryItem)}
        </div>
      </InlineCss>
    );
  }
});

export default FullHistory;