import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

export default React.createClass({

  propTypes: {
    player: React.PropTypes.object.isRequired,
    passBet: React.PropTypes.func.isRequired,
    makeBet: React.PropTypes.func.isRequired,
  },

  passClickHandler() {
    this.props.passBet();
  },

  betClickHandler() {
    this.props.makeBet(this.refs.bidAmount.value);
  },

  render() {

    const {player} = this.props;

    const isActiveClass = player.get('isActive') ? 'active' : 'inactive';
    const isSelfClass = player.get('isSelf') ? 'self' : 'other';

    return (
      <InlineCss stylesheet={styles} componentName="component" className={`${isActiveClass} ${isSelfClass}`}>
        <div className="prevAction">
          {player.get('prevAction')}
          {player.get('currentBid') > 0 && player.get('currentBid')}
        </div>
        <div className="playerName">
          Player Name....
        </div>
        <div className="money">
          ${player.get('money')}
        </div>
        <div className="cardList">
          {player.get('ownCards').map((card, index) => (
            <div key={index} className="card">{card}</div>
          ))}
        </div>
        {player.get('isSelf') && (
          <div className="controls">
            <button disabled={!player.get('isActive')} onClick={this.passClickHandler}>Pass</button>
            <input ref="bidAmount" disabled={!player.get('isActive')} type="range" min={player.get('minBid')} max={player.get('maxBid')} step="1" />
            <button disabled={!player.get('isActive')} onClick={this.betClickHandler}>Bet</button>
          </div>
        )}

      </InlineCss>
    );
  }
});