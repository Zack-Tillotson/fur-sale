import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

export default React.createClass({

  propTypes: {
    isOwner: React.PropTypes.bool.isRequired,
    toggleReady: React.PropTypes.func.isRequired,
    startGame: React.PropTypes.func.isRequired,
  },

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component">
        <button onClick={this.props.toggleReady}>Ready</button>
        <button onClick={this.props.startGame}>Start Game</button>
      </InlineCss>
    );
  }
  
});