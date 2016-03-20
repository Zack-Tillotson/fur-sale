import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

export default React.createClass({

  propTypes: {
    sessions: React.PropTypes.object.isRequired,
  },

  getConnectionStatus(session) {
    return session.get('connectionStatus');
  },

  getReadyStatus(session) {
    return session.get('status');
  },

  render() {

    const {sessions} = this.props;

    return (
      <InlineCss stylesheet={styles} componentName="component">
        Connections
        <ul>
          {sessions.map(session => (
            <li key={session.get('playerId')}>
              <div>[Player Name]</div>
              <div>Online? {this.getConnectionStatus(session)}</div>
              <div>Ready? {this.getReadyStatus(session)}</div>
            </li>
          ))}
        </ul>

      </InlineCss>
    );
  }
});