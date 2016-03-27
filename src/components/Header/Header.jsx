import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

import {Link} from 'react-router';

export default React.createClass({

  propTypes: {
    preferencesOpen: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      preferencesOpen: false,
    }
  },

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component">
        <header>
          <Link to="/">
            <h1>Fur Sale!</h1>
          </Link>
          {this.props.preferencesOpen && (
            <Link to="/">
              <div className="prefLink">
                ⓧ
              </div>
            </Link>
          )}
          {!this.props.preferencesOpen && (
            <Link to="/preferences/">
              <div className="prefLink">
                ☰
              </div>
            </Link>
          )}
        </header>
      </InlineCss>
    );
  }
});