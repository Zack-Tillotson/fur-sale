import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

export default React.createClass({

  render() {

    const players = this.props.players.sort((a,b) => b.get('totalMoney') - a.get('totalMoney'));
    const firstPlayer = players.first();

    return (
      <InlineCss stylesheet={styles} componentName="component">
        <div key={1} className={"player rank1"}>
          <div className="placement" style={{backgroundColor: firstPlayer.get('color')}}>1</div>
          <div className="playerIcon" style={{backgroundImage: `url('${firstPlayer.get('persona')}')`, backgroundColor: firstPlayer.get('color')}}></div>
          <div className="playerName">{firstPlayer.get('name')}</div>
          <div className="playerScore" style={{backgroundColor: firstPlayer.get('color')}}>${firstPlayer.get('totalMoney')}</div>
        </div>
        <div className="losers">
          {players.shift().map((player, index) => {
            const rank = index + 2;
            return (
              <div key={rank} className={"player rank" + rank}>
                <div className="placement">{rank}</div>
                <div className="playerIcon" style={{backgroundImage: `url('${player.get('persona')}')`, borderColor: player.get('color')}}></div>
                <div className="playerName">{player.get('name')}</div>
                <div className="playerScore">${player.get('totalMoney')}</div>
              </div>
            );
          })}
        </div>
      </InlineCss>
    );
  }
});