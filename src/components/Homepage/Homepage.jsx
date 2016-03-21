import React from 'react';
import InlineCss from "react-inline-css";

import NewGameButton from '../game/NewGameButton';

import styles from './styles';

const Homepage = React.createClass({

  startNewGame(event) {
    event.preventDefault();

  },

  render() {

    return (
      <InlineCss stylesheet={styles} componentName="container">
        <h1>Fur Sale!</h1>
	      <section>
          <NewGameButton />
        </section>  
      </InlineCss>
    );

  }
});

export default Homepage;