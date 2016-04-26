import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

export default React.createClass({

  propTypes: {
    isOwner: React.PropTypes.bool.isRequired,
    readyToStart: React.PropTypes.bool.isRequired,
    startGame: React.PropTypes.func.isRequired,
    addAiPlayer: React.PropTypes.func.isRequired,
  },

  startGameHandler(event) {
    event.preventDefault();
    this.props.startGame();
  },

  addAiPlayer(event) {
    event.preventDefault();
    this.props.addAiPlayer();
  },

  render() {
    if(this.props.isOwner) {

      const readyToStartClass = this.props.readyToStart ? 'startable' : 'unstartable';

      return (
        <InlineCss stylesheet={styles} componentName="component">
          <div className="addAi">
            <button onClick={this.addAiPlayer}>
              + Add AI Player
            </button>
          </div>
          <div className="startGame">
            <button 
              disabled={!this.props.readyToStart} 
              className={readyToStartClass} 
              onClick={this.startGameHandler}>
              Start Game
            </button>
          </div>
        </InlineCss>
      );
    } else {
      return  null;
    }
  }
  
});