import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';

import Persona from '../Persona';

export default React.createClass({

  propTypes: {
    className: React.PropTypes.string,
    name: React.PropTypes.string,
    persona: React.PropTypes.string,
    personaColor: React.PropTypes.string,
    leftBubble: React.PropTypes.string,
    rightBubble: React.PropTypes.string,
    highlightLevel: React.PropTypes.oneOf(['max', 'high', 'standard']),
  },

  getDefaultProps() {
    return {
      className: '',
      persona: '/assets/personas/bah.png',
      personaColor: '#fff',
      highlightLevel: 'standard',
    }
  },

  getBubble(contents, className) {
    if(!contents) {
      return null;
    } else {

      const bubbleAttrs = {};
      if(this.props.highlightLevel === 'max' || this.props.highlightLevel === 'high') {
        bubbleAttrs.style = {backgroundColor: this.props.personaColor}
      } else {
        bubbleAttrs.style = {borderColor: this.props.personaColor}
      }
      
      return (<div className={className} {...bubbleAttrs}>{contents}</div>);
    }
  },

  getPersona() {
    const styles = {backgroundImage: `url('${this.props.persona}')`};
    if(this.props.highlightLevel === 'max' || this.props.highlightLevel === 'high') {
      styles.backgroundColor = this.props.personaColor;
    } else {
      styles.borderColor = this.props.personaColor;
    }
    return (
      <div className="playerIcon" style={styles}></div>
    )
  },

  getPlayerName() {
    return (
      <div className="playerName">{this.props.name}</div>
    );
  },

  render() {

    const {
      className,
      leftBubble,
      rightBubble,
      highlightLevel,
    } = this.props;

    return (
      <InlineCss stylesheet={styles} componentName="component" className={`player persona ${className} ${highlightLevel}`}>
        {this.getBubble(leftBubble, 'leftBubble')}
        {this.getBubble(rightBubble, 'rightBubble')}
        {this.getPersona()}
        {this.getPlayerName()}
      </InlineCss>
    );
  }
});