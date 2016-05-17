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

  playerNameFormSubmitHandler(event) {
    event.preventDefault();
    this.updatePlayerName();
  },

  updatePlayerName(event) {
    const value = this.refs.playerNameInput.value;
    this.props.updatePlayerName(value);
    this.toggleEditName(false);
  },

  updatePlayerColor(color) {
    this.props.updatePlayerColor(color);
  },

  updatePlayerPersona(persona) {
    this.props.updatePlayerPersona(persona);
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
          <td colSpan={5} className="placeholder">
            Empty
          </td>
        </tr>
      );
    }
    return ret;
  },

  getPlayerName(session) {
    const name = session.get('name');
    if(session.get('isSelf')) {
      if(this.state.editName) {
        return (
          <form onSubmit={this.playerNameFormSubmitHandler}>
            <div className="editing">
              <input type="text" defaultValue={name} ref="playerNameInput" on />
              <button className="icon saveButon">💾</button>
            </div>
          </form>
        );
      } else {
        return (
          <div className="playerName clickToEdit" onClick={this.toggleEditName}>
            {name}
            <span className="icon editIcon">✎</span>
          </div>
        );
      }
    } else {
      return name;
    }
  },


  getPlayerColor(session) {
    const color = session.get('color');
    const compProps = {};

    const isSelf = session.get('isSelf');
    if(isSelf) {
      compProps.onClick = this.updatePlayerColor.bind(this, color);
    }
     
    return (
      <span 
        className="colorBox" 
        style={{backgroundColor: session.get('color')}}
        {...compProps} />
    );
  },

  getPlayerPersona(session) {
    const persona = session.get('persona');
    const compProps = {};

    const isSelf = session.get('isSelf');
    if(isSelf) {
      compProps.onClick = this.updatePlayerPersona.bind(this, persona);
    }
     
    return (
      <span 
        className="persona" 
        style={{backgroundImage: `url('${session.get('persona')}')`}} 
        {...compProps} />
    );
  },

  render() {

    const {sessions} = this.props;

    return (
      <InlineCss stylesheet={styles} componentName="component">
        <h3>Players In This Game</h3>
        <table className="sessionTable">
          <thead>
            <tr>
              <td className="isOwner"></td>
              <td className="playerName">Name</td>
              <td className="playerColorAndPersona" colSpan={2}>You</td>
              <td className="connectionStatus"></td>
            </tr>
          </thead>
          <tbody>
            {sessions.map(session => {

              const isOwnerClass = session.get('isOwner') ? 'owner' : 'notOwner';
              const selfClass = session.get('isSelf') ? 'isSelf' : 'notSelf';
              const connectionClass = session.get('connectionStatus');
              const isAiClass = session.get('isAI') ? 'isAi' : 'notAi';

              return (
                <tr key={session.get('playerId')} className={`${selfClass}`}>
                  <td className={`${isOwnerClass} ${isAiClass}`}></td>
                  <td className="playerName">
                    {this.getPlayerName(session)}
                  </td>
                  <td className="playerColor">
                    {this.getPlayerColor(session)}
                  </td>
                  <td className="playerPersona">
                    {this.getPlayerPersona(session)}
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