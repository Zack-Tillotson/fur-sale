import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

import CardTable from '../CardTable';

export default React.createClass({

  propTypes: {
    player: React.PropTypes.object.isRequired,
    passBet: React.PropTypes.func.isRequired,
    makeBet: React.PropTypes.func.isRequired,
    sellCard: React.PropTypes.func.isRequired,
    phase: React.PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      bidAmount: this.props.player.get('minBid'),
    }
  },

  componentWillReceiveProps(nextProps) {
    if(!this.props.player.get('isActive') && nextProps.player.get('isActive')) {
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
    if(this.props.player.get('maxBid') > this.state.bidAmount) {
      this.setState({bidAmount:  this.state.bidAmount + 1});
    }
  },

  lowerBid() {
    if(this.state.bidAmount > this.props.player.get('minBid')) {
      this.setState({bidAmount:  this.state.bidAmount - 1});
    }
  },

  cardClickHandler(value) {
    this.props.sellCard(value);
  },

  render() {

    const {player} = this.props;

    const action = player.get('prevAction') !== 'noAction' && player.get('prevAction');

    const isActiveClass = player.get('isActive') ? 'active' : 'inactive';
    const isSelfClass = player.get('isSelf') ? 'self' : 'other';
    const isOwnerClass = player.get('isOwner') ? 'owner' : 'notOwner';
    const isPassed = action === 'pass' ? 'passed' : 'notPassed';

    let actionText = '';
    if(action === 'pass') {
      actionText = 'Passes';
    } else if(action === 'bet') {
      actionText = 'Bids $' + player.get('currentBid');
    }

    return (
      <InlineCss 
        stylesheet={styles} 
        componentName="component" 
        className={`${isActiveClass} ${isSelfClass} ${isOwnerClass} ${isPassed}`}>
        <div className="playerName">
          {player.get('name')}
        </div>
        <div className="prevAction">
          {actionText}
        </div>
        <div className="money">
          ${player.get('money')}
        </div>
        {player.get('isSelf') && this.props.phase === 'buy' && (
          <div className="controls">
            <div className="betContainer">
              <button className="bet" disabled={!player.get('isActive')} onClick={this.betClickHandler}>Bid ${this.state.bidAmount}</button>
              <div className="plusMinus">
                <button 
                  className="minus" 
                  disabled={!(player.get('isActive') && this.state.bidAmount > player.get('minBid'))} 
                  onClick={this.lowerBid}>
                    -
                </button>
                <button 
                  className="plus" 
                  disabled={!(player.get('isActive') && this.state.bidAmount < player.get('maxBid'))} 
                  onClick={this.increaseBid}>
                    +
                 </button>
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
            <CardTable phase={this.props.phase} small={true} visibleCards={player.get('ownCards')} visibleCardsGone={0} cardClickHandler={this.cardClickHandler} />
          </div>
        )}

        {player.get('isActive') && (
          <div className="playerMarker"></div>
        )}
      </InlineCss>
    );
  }
});