import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

import {Link} from 'react-router';

export default React.createClass({

  propTypes: {
    preferencesOpen: React.PropTypes.bool,
    onHelpClick: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      preferencesOpen: false,
      onHelpClick: () => {},
    }
  },

  handleHelpClick() {
    this.props.onHelpClick();
  },

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component">
        <header>
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
          {this.props.showHelpLink && (
            <span className="helpLink" onClick={this.handleHelpClick}>
              Help
            </span>
          )}
          <Link to="/">
            <img src="/assets/title.png" alt="Fur Sale!" />
          </Link>
        </header>
      </InlineCss>
    );
  }
});