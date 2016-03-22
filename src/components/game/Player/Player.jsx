import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

import Card from '../Card';

export default React.createClass({

  propTypes: {
    player: React.PropTypes.object.isRequired,
    passBet: React.PropTypes.func.isRequired,
    makeBet: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      bidAmount: 0,
    }
  },

  componentWillReceiveProps(nextProps) {
    const {bidAmount} = this.state;
    if(bidAmount > nextProps.player.get('maxBid')) {
      this.setState({bidAmount: nextProps.player.get('maxBid')});
    } else if(bidAmount < nextProps.player.get('minBid')) {
      this.setState({bidAmount: nextProps.player.get('minBid')});
    }
  },

  passClickHandler() {
    this.props.passBet();
  },

  betClickHandler() {
    this.props.makeBet(this.state.bidAmount);
  },

  increaseBid() {
    if(this.props.player.get('money') > this.state.bidAmount) {
      this.setState({bidAmount:  this.state.bidAmount + 1});
    }
  },

  lowerBid() {
    if(this.state.bidAmount > this.props.player.get('minBid')) {
      this.setState({bidAmount:  this.state.bidAmount - 1});
    }
  },

  render() {

    const {player} = this.props;

    const isActiveClass = player.get('isActive') ? 'active' : 'inactive';
    const isSelfClass = player.get('isSelf') ? 'self' : 'other';

    const action = player.get('prevAction') !== 'noAction' && player.get('prevAction');

    return (
      <InlineCss stylesheet={styles} componentName="component" className={`${isActiveClass} ${isSelfClass}`}>
        <div className="prevAction">
          {action}
          {player.get('currentBid') > 0 && player.get('currentBid')}
        </div>
        <div className="playerName">
          {player.get('name')}
        </div>
        <div className="money">
          ${player.get('money')}
        </div>
        <div className="cardList">
          {player.get('ownCards').map((card, index) => (
            <Card key={index} size="small" value={card} />
          ))}
        </div>
        {player.get('isSelf') && (
          <div className="controls">
            <button disabled={!player.get('isActive')} onClick={this.passClickHandler}>Pass</button>
            <div>
              <button disabled={!player.get('isActive')} onClick={this.lowerBid}>▼</button>
              <span>{this.state.bidAmount}</span>
              <button disabled={!player.get('isActive')} onClick={this.increaseBid}>▲</button>
              <button disabled={!player.get('isActive')} onClick={this.betClickHandler}>Bet</button>
            </div>
          </div>
        )}

      </InlineCss>
    );
  }
});