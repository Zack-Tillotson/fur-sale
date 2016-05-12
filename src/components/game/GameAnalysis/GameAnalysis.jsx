import React from 'react';
import InlineCss from "react-inline-css";

import styles from './styles';

import Card from '../Card';

const GameAnalysis = React.createClass({

  propTypes: {
    players: React.PropTypes.object.isRequired,
  },

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component">
        <h2>Score Details</h2>
        <div className="wide">
          <table>
            <tbody>
              {this.props.players.map(player => (
                <tr key={player.get('playerId')}>
                  <td className="playerName">{player.get('name')}</td>
                  <td className="buyCards">
                    {player.get('usedBuyCards').map((card, index) => (
                      <Card key={index} value={card} size="small" type="buy" isTaken={false} />
                    ))}
                  </td>
                  <td>=</td>
                  <td className="totals">{player.get('usedBuyCards').reduce((soFar, card) => (soFar + card), 0)}</td>
                  <td className="sellCards">
                    {player.get('sellCards').map((card, index) => (
                      <Card key={index} value={card} size="small" type="sell" isTaken={false} />
                    ))}
                  </td>
                  <td>=</td>
                  <td className="totals">${player.get('sellCards').reduce((soFar, card) => (soFar + card), 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="skinny">
          {this.props.players.map(player => (
            <div key={player.get('playerId')} className="player">
              <div className="playerName">{player.get('name')}</div>
              <div className="buyCards">
                {player.get('usedBuyCards').map((card, index) => (
                  <Card key={index} value={card} size="small" type="buy" isTaken={false} />
                ))}
                = {player.get('usedBuyCards').reduce((soFar, card) => (soFar + card), 0)}
              </div>
              <div className="sellCards">
                {player.get('sellCards').map((card, index) => (
                  <Card key={index} value={card} size="small" type="sell" isTaken={false} />
                ))}
                = ${player.get('sellCards').reduce((soFar, card) => (soFar + card), 0)}
              </div>
            </div>
          ))}
        </div>
      </InlineCss>
    );
  }
});

export default GameAnalysis;