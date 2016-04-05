import React from 'react';
import InlineCss from "react-inline-css";

import styles from './styles';

const History = React.createClass({

  propTypes: {
    history: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      hoveredItem: null,
    }
  },

  onItemHover(hoveredItem) {
    this.setState({hoveredItem});
  },

  onItemUnhover() {
    this.setState({hoveredItem: null});
  },

  getHistoryItem(item) {

    const hoverControls = {
      key: item,
      onMouseEnter: this.onItemHover.bind(this, item),
      onMouseLeave: this.onItemUnhover,
      onTouchStart: this.onItemHover.bind(this, item),
      onTouchEnd: this.onItemUnhover,
    }

    switch(item.get('action')) {
      case 'buyPhaseStarts':
        return (
          <div className="historyItem buyStart" {...hoverControls}>
            Buy Starts
          </div>
        );
      case 'bid':
        return (
          <div className="historyItem bid" {...hoverControls}>
            Bids ${item.get('bid')}
          </div>
        );
      case 'pass':
        const endOfBiddingClass = item.get('endOfRound') ? 'endOfRound' : 'midRound';
        return (
          <div className={`historyItem pass ${endOfBiddingClass}`} {...hoverControls}>
            Pass
          </div>
        );
      case 'sellPhaseStarts':
        return (
          <div className="historyItem sellStart" {...hoverControls}>
            Sell Starts
          </div>
        );
      case 'sell':
        return (
          <div className="historyItem sell" {...hoverControls}>
            Sale
          </div>
        );
      default:
        return (
          <div className="historyItem" {...hoverControls}>
            ?
          </div>
        );
    }
  },

  getHistoryItemDetail() {
    const event = this.state.hoveredItem;
    switch(event.get('action')) {
      case 'buyPhaseStarts':
        return (
           <div className="historyItemDetail">
             Buy Phase Starts!
           </div>
        );
      case 'sellPhaseStarts':
        return (
           <div className="historyItemDetail">
             Buy Phase Complete, Sell Phase Starts!
           </div>
        );
      case 'bid':
        return (
           <div className="historyItemDetail">
             bidding!
           </div>
        );
      case 'pass':
        return (
           <div className="historyItemDetail">
             passed!
           </div>
        );
      case 'sell':
        return (
           <div className="historyItemDetail">
             sell!
           </div>
        );
      default:
        return (
           <div className="historyItemDetail">
             ?
           </div>
        );
    }
  },

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component" className="history">
        <div className="historyItems">
          {this.props.history.reverse().take(15).map(this.getHistoryItem)}
        </div>
        {this.state.hoveredItem && this.getHistoryItemDetail()}
      </InlineCss>
    );
  }
});

export default History;