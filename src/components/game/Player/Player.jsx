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
      bidAmount: 1,
    }
  },

  componentWillReceiveProps(nextProps) {
    const {bidAmount} = this.state;
    if(bidAmount < nextProps.player.get('minBid')) {
      this.setState({bidAmount: nextProps.player.get('minBid')});
    }
    if(bidAmount > nextProps.player.get('maxBid')) {
      this.setState({bidAmount: nextProps.player.get('maxBid')});
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
    const isOwnerClass = player.get('isOwner') ? 'owner' : 'notOwner';

    const action = player.get('prevAction') !== 'noAction' && player.get('prevAction');

    return (
      <InlineCss stylesheet={styles} componentName="component" className={`${isActiveClass} ${isSelfClass} ${isOwnerClass}`}>
        <div className="playerName">
          {player.get('name')}
        </div>
        <div className="prevAction">
          {action}
          {player.get('currentBid') > 0 && player.get('currentBid')}
        </div>
        <div className="money">
          ${player.get('money')}
        </div>
        {player.get('isSelf') && (
          <div className="controls">
            <div className="betContainer">
              <button className="bet" disabled={!player.get('isActive')} onClick={this.betClickHandler}>Bet ${this.state.bidAmount}</button>
              <div className="plusMinus">
                <button className="minus" disabled={!player.get('isActive')} onClick={this.lowerBid}>-</button>
                <button className="plus" disabled={!player.get('isActive')} onClick={this.increaseBid}>+</button>
              </div>
            </div>
            <div className="passContainer">
              <button className="pass" disabled={!player.get('isActive')} onClick={this.passClickHandler}>Pass</button>
            </div>
          </div>
        ) || player.get('isActive') && (
          <div className="playerStatus">
            {player.get('connectionStatus') === 'online' && (
              <span className="animatedEllipses">Thinking</span>
            ) || (
              <span className="offline">offline</span>
            )}
          </div>
        )}
        {player.get('isSelf') && (
          <div className="cardList">
            {player.get('ownCards').map((card, index) => (
              <Card key={index} size="small" value={card} />
            ))}
          </div>
        )}

        {player.get('isActive') && (
          <div className="playerMarker"></div>
        )}
      </InlineCss>
    );
  }
});