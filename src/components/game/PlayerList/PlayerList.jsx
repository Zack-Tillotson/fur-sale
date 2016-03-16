import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

import Player from '../Player';

export default React.createClass({

  propTypes: {
    players: React.PropTypes.object.isRequired,
    passBet: React.PropTypes.func.isRequired,
    makeBet: React.PropTypes.func.isRequired,
  },

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component">
        {this.props.players.map((player, index) => (
          <Player key={index} player={player} passBet={this.props.passBet} makeBet={this.props.makeBet} />
        ))}
      </InlineCss>
    );
  }
});