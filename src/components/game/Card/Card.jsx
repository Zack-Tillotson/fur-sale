import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

export default React.createClass({

  propTypes: {
    value: React.PropTypes.number,
    size: React.PropTypes.string,
  },

  render() {

    
    return (
      <InlineCss stylesheet={styles} componentName="component" className={`card ${this.props.size}`}>
        {this.props.value}
      </InlineCss>
    );
  }
});