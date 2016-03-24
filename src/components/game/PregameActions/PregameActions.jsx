import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

export default React.createClass({

  propTypes: {
    canJoin: React.PropTypes.bool.isRequired,
    joinGame: React.PropTypes.func.isRequired,
    canStartGame: React.PropTypes.bool.isRequired,
    startGame: React.PropTypes.func.isRequired,
  },

  joinGameHandler(event) {
    event.preventDefault();
    this.props.joinGame();
  },

  startGameHandler(event) {
    event.preventDefault();
    this.props.startGame();
  },

  render() {

    const readyToStartClass = this.props.readyToStart ? 'startable' : 'unstartable';

    return (
      <InlineCss stylesheet={styles} componentName="component">
        {this.props.canJoin && (
          <button onClick={this.joinGameHandler}>Join Game</button>
        )}
        {this.props.canStartGame && (
          <div className="startGame">
            <button disabled={!this.props.readyToStart} className={readyToStartClass} onClick={this.startGameHandler}>Start Game</button>        
            {!this.props.readyToStart && (
              <ul>
                {this.props.playerCount < 2 && (
                  <li>Must have at least two players.</li>
                )}
                {this.props.playerCount > 6 && (
                  <li>Can't have more than six players.</li>
                )}
                <li>Everyone must be ready.</li>
              </ul>
            )}
          </div>
        )}
      </InlineCss>
    );
  }
  
});