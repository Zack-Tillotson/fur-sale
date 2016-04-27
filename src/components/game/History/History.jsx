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

  getHistoryItem(item, index) {

    const hoverControls = {
      key: index,
      onMouseEnter: this.onItemHover.bind(this, item),
      onMouseLeave: this.onItemUnhover,
      onTouchStart: this.onItemHover.bind(this, item),
      onTouchEnd: this.onItemUnhover,
    }

    switch(item.get('action')) {
      case 'buyPhaseStarts':
        return (
          <div className="historyItem buyStart" {...hoverControls}>&nbsp;</div>
        );
      case 'bid':
        return (
          <div className="historyItem bid" {...hoverControls}>
            ${item.get('bid')}
          </div>
        );
      case 'pass':
        const endOfBiddingClass = item.get('endOfRound') ? 'endOfRound' : 'midRound';
        return (
          <div className={`historyItem pass ${endOfBiddingClass}`} {...hoverControls}>
            &nbsp;
          </div>
        );
      case 'sellPhaseStarts':
        return (
          <div className="historyItem sellStart" {...hoverControls}>&nbsp;</div>
        );
      case 'sell':
        return (
          <div className="historyItem sell" {...hoverControls}>&nbsp;</div>
        );
      case 'gameover':
        return (
          <div className="historyItem gameOver" {...hoverControls}>&nbsp;</div>
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
    const historyItem = this.state.hoveredItem;
    switch(historyItem.get('action')) {
      case 'buyPhaseStarts':
        return (
          <div className="historyItemDetail buyStart">
            Buy Phase Starts!
          </div>
        );
      case 'sellPhaseStarts':
        return (
          <div className="historyItemDetail sellStart">
            Sell Phase Starts!
          </div>
        );
      case 'bid':
        const isSelf = historyItem.get('player').get('isSelf');
        return (
          <div className="historyItemDetail bidAction">
            {isSelf && `You bid`}
            {!isSelf && `${historyItem.get('player').get('name')} bids`}
            &nbsp;
            ${historyItem.get('bid')}!
          </div>
        );
      case 'pass':
        return (
           <div className="historyItemDetail passAction">
            <div className="playerPasses">
              {historyItem.get('player').get('name')} passes!
            </div>
            {historyItem.get('effects').map((effect, index) => {
              const isSelf = effect.get('player').get('isSelf');
              return (
                <div className="passEffect" key={index}>
                  {isSelf && 'You '}
                  {!isSelf && effect.get('player').get('name')}
                  &nbsp;
                  paid ${effect.get('pays')} for the {effect.get('card')} card (${effect.get('reclaims')} refund).
                </div>
              );
            })}
           </div>
        );
      case 'sell':
        return (
           <div className="historyItemDetail sellAction">
            <div className="sellTitle">
              Everyone has chosen their card!
            </div>
            {historyItem.get('effects').map((effect, index) => {
              const isSelf = effect.get('player').get('isSelf');
              return (
                <div className="passEffect" key={index}>
                  {isSelf && 'You sell '}
                  {!isSelf && `${effect.get('player').get('name')} sells `}
                  the {effect.get('buyCard')} for ${effect.get('sellCard')}.
                </div>
              );
            })}
           </div>
        );
      case 'gameover':
        return (
           <div className="historyItemDetail gameover">
             Game Over!
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
          {this.props.history.reverse().take(10).map(this.getHistoryItem)}
        </div>
        {this.state.hoveredItem && this.getHistoryItemDetail()}
      </InlineCss>
    );
  }
});

export default History;