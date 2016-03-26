import React from 'react';
import InlineCss from "react-inline-css";

import Page from '../Page';
import NewGameButton from '../game/NewGameButton';

import styles from './styles';

const Homepage = React.createClass({

  render() {

    return (
      <Page showHeader={false}>
        <InlineCss stylesheet={styles} componentName="container">
          <div className="headline">
            <img src="/assets/headline.png" />
            <NewGameButton />
          </div>
        </InlineCss>
      </Page>
    );

  }
});

export default Homepage;