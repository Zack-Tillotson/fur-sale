import React from 'react';
import InlineCss from "react-inline-css";
import styles from './styles.raw.less';
import Card from '../Card';

export default React.createClass({

  propTypes: {
    visibleCards: React.PropTypes.object.isRequired,
    visibleCardsGone: React.PropTypes.number.isRequired,
  },

  getGoneCardsArray() {
    const ret = [];
    for(let i = 0 ; i < this.props.visibleCardsGone ; i++) {
      ret.push(0);
    }
    return ret;
  },

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component">
        {this.props.visibleCards.map(card => (
            <Card key={card} value={card} size="large" />
          )
        )}
        {this.getGoneCardsArray().map((card, index) => (
            <div className="card gone" key={'gone' + index}>X</div>
          )
        )}
      </InlineCss>
    );
  }
});