import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

export default React.createClass({

  propTypes: {
    sessions: React.PropTypes.object.isRequired,
    showReadyStatus: React.PropTypes.bool,
    updatePlayerName: React.PropTypes.func.isRequired,
    toggleReady: React.PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {showReadyStatus: true}
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


  toggleReadyHandler(event) {
    event.preventDefault();
    this.props.toggleReady();
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
              <td className="playerColor">Color</td>
              {this.props.showReadyStatus && [(
                <td key="status" className="readyStatus">Ready?</td>
              ), (
                <td key="action" className="actionButtons"></td>
              )]}
            </tr>
          </thead>
          <tbody>
            {sessions.size === 0 && (
              <tr className="noPlayersMessage">
                <td colSpan={2 + this.props.showReadyStatus ? 2 : 0}>No players yet</td>
              </tr>
            )}
            {sessions.map(session => {

              const connectionClass = session.get('connectionStatus');
              const readyClass = session.get('connectionStatus') === 'offline' ? 'offline' : session.get('status');

              const playerColor = session.get('color');

              return (
                <tr key={session.get('playerId')}>
                  <td className="playerName">
                    {this.getPlayerName(session)}
                  </td>
                  <td className={`playerColor`} style={{backgroundColor: playerColor}}> </td>
                  {this.props.showReadyStatus && [(
                    <td key="readystatus" className={`readyStatus ${readyClass} ${connectionClass}`}>
                      {session.get('connectionStatus') === 'offline' && 'offline'}
                    </td>
                  ), (
                    <td key="readybutton" className="actionButtons">
                      {session.get('isSelf') && (
                        <button onClick={this.toggleReadyHandler}>Ready</button>
                      )}
                    </td>
                  )]}
                </tr>
              );

            })}
          </tbody>
        </table>

      </InlineCss>
    );
  }
});