import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

import PlayerScores from '../PlayerScores';
import FullHistory from '../FullHistory';
import GameAnalysis from '../GameAnalysis';

export default React.createClass({

  render() {

    return (
      <InlineCss stylesheet={styles} componentName="component">

        <PlayerScores players={this.props.players} />
        <FullHistory history={this.props.history} />
        <GameAnalysis />

      </InlineCss>
    );
  }
});