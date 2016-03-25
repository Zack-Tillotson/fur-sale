import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

export default React.createClass({

  propTypes: {
    canStartGame: React.PropTypes.bool.isRequired,
    startGame: React.PropTypes.func.isRequired,
  },

  startGameHandler(event) {
    event.preventDefault();
    this.props.startGame();
  },

  render() {
    if(this.props.canStartGame) {

      const readyToStartClass = this.props.readyToStart ? 'startable' : 'unstartable';

      return (
        <InlineCss stylesheet={styles} componentName="component">
          <div className="startGame">
            <button 
              disabled={!this.props.canStartGame} 
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