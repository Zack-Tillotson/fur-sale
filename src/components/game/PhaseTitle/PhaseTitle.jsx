import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

export default React.createClass({

  propTypes: {
    phase: React.PropTypes.string.isRequired,
  },

  getPhase() {
    switch(this.props.phase) {
      case 'buy':
        return 'Buy';
      case 'sell':
        return 'Sell';
    }
  },

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component">
        {this.getPhase()} Phase
      </InlineCss>
    );
  }
});