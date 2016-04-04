import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

export default React.createClass({

  propTypes: {
    value: React.PropTypes.number.isRequired,
    type: React.PropTypes.oneOf(['buy', 'sell']).isRequired,
    isTaken: React.PropTypes.bool.isRequired,
    size: React.PropTypes.oneOf(['large', 'small']).isRequired,
    cardClickHandler: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      value: -1,
      size: 'large',
      cardClickHandler() {},
    }
  },

  cardClickHandler() {
    this.props.cardClickHandler(this.props.value);
  },

  render() {
    const {value, type, isTaken, size} = this.props;
    const takenClass = isTaken ? 'taken' : 'notTaken';
    return (
      <InlineCss 
        stylesheet={styles} 
        componentName="component"
        className={`card ${size} value${value} ${takenClass} ${this.props.type}`} 
        onClick={this.cardClickHandler}>
          {this.props.type === 'sell' && '$'}
          {value >= 0 && value}
      </InlineCss>
    );
  },

});