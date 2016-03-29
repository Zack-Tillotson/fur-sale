import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

export default React.createClass({

  propTypes: {
    phase: React.PropTypes.string.isRequired,
  },

  getPhase() {
    switch(this.props.phase) {
      case 'pregame':
        return 'Game preparing to start...';
      case 'buy':
        return 'Buy Phase';
      case 'sell':
        return 'Sell Phase';
      case 'postgame':
        return 'Game Over!';
    }
  },

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component">
        {this.getPhase()}
      </InlineCss>
    );
  }
  
});