import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

import Persona from '../Persona';

export default React.createClass({

  render() {

    const players = this.props.players.sort((a,b) => b.get('totalMoney') - a.get('totalMoney'));
    const firstPlayer = players.first();

    return (
      <InlineCss stylesheet={styles} componentName="component">
        <Persona
          key={1}
          className="rank1" 
          highlightLevel="max"
          name={firstPlayer.get('name')}
          persona={firstPlayer.get('persona')}
          personaColor={firstPlayer.get('color')}
          leftBubble={"1"}
          rightBubble={firstPlayer.get('totalMoney')} />
        <div className="losers">
          {players.shift().map((player, index) => {
            const rank = index + 2;
            return (
              <Persona
                key={rank}
                className={'rank' + rank}
                name={player.get('name')}
                persona={player.get('persona')}
                personaColor={player.get('color')}
                leftBubble={`${rank}`}
                rightBubble={player.get('totalMoney')} />
            );
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