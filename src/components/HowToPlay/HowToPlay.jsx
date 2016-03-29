import React from 'react';

import InlineCss from 'react-inline-css';
import styles from './styles';

const HowToPlay = React.createClass({

  propTypes: {

  },

  getDefaultProps() {
    return {

    }
  },

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component">
        <h3>How To Play</h3>
        <section>
          <h4>Overview</h4>
          <p>Fur Sale is fast and fun card game to play with your friends! You are an investor looking to make money, first acquire investments in the <b>Buy Phase</b> and then flip them for profit in the <b>Sell Phase</b>.</p>
        </section>
        <section>
          <h4>Buy Phase</h4>
          <p></p>
        </section>
        <section>
          <h4>Sell Phase</h4>
        </section>
      </InlineCss>
    );
  }
});

export default HowToPlay;