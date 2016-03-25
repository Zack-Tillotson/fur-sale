import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

export default React.createClass({

  propTypes: {
    canJoinGame: React.PropTypes.bool.isRequired,
    sessions: React.PropTypes.object.isRequired,
    updatePlayerName: React.PropTypes.func.isRequired,
    maxPlayers: React.PropTypes.number,
  },

  getDefaultProps() {
    return {
      maxPlayers: 6,
    }
  },

  getInitialState() {
    return {
      editName: false,
    }
  },

  getPlayerName(session) {
    const name = session.get('name');
    if(session.get('isSelf')) {
      if(this.state.editName) {
        return (
          <form onSubmit={this.playerNameFormSubmitHandler}>
            <div className="editing">
              <input type="text" defaultValue={name} ref="playerNameInput" on />
              <button className="saveButon">💾</button>
            </div>
          </form>
        );
      } else {
        return (
          <div className="clickToEdit" onClick={this.toggleEditName}>
            {name}
            <span className="editIcon">✎</span>
          </div>
        );
      }
    } else {
      return name;
    }
  },

  playerNameFormSubmitHandler(event) {
    event.preventDefault();
    this.updatePlayerName();
  },

  updatePlayerName(event) {
    const value = this.refs.playerNameInput.value;
    this.props.updatePlayerName(value);
    this.toggleEditName(false);
  },

  toggleEditName(editName = !this.state.editName) {
    this.setState({editName});
  },

  getPlayerPlaceholders() {
    const placeHolderCount = this.props.maxPlayers - this.props.sessions.size;
    const ret = [];
    for(let i = 0 ; i < placeHolderCount ; i++) {
      ret.push(
        <tr key={'placeholder ' + i}>
          <td colSpan={2} className="placeholder">
            Empty
          </td>
        </tr>
      );
    }
    return ret;
  },

  render() {

    const {sessions} = this.props;

    return (
      <InlineCss stylesheet={styles} componentName="component">
        <h3>Players In This Game</h3>
        <table className="sessionTable">
          <thead>
            <tr>
              <td className="playerName">Name</td>
              <td className="connectionStatus"></td>
            </tr>
          </thead>
          <tbody>
            {sessions.map(session => {

              const selfClass = session.get('isSelf') ? 'isSelf' : 'notSelf';
              const connectionClass = session.get('connectionStatus');

              return (
                <tr key={session.get('playerId')} className={selfClass}>
                  <td className="playerName">
                    {this.getPlayerName(session)}
                  </td>
                  <td className="connectionStatus">
                    {session.get('connectionStatus') === 'offline' && 'offline'}
                  </td>
                </tr>
              );

            })}
            {this.getPlayerPlaceholders()}
          </tbody>
        </table>

      </InlineCss>
    );
  }
});