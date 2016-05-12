import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

import PlayerScores from '../PlayerScores';
import GameAnalysis from '../GameAnalysis';

export default React.createClass({

  render() {

    return (
      <InlineCss stylesheet={styles} componentName="component">

        <PlayerScores players={this.props.players} />
        <GameAnalysis players={this.props.players} />

      </InlineCss>
    );
  }
});