import React from 'react';
import InlineCss from "react-inline-css";

import Page from '../Page';
import HowToPlay from '../HowToPlay';
import CreateOrJoinControls from '../CreateOrJoinControls';

import styles from './styles';

const Homepage = React.createClass({

  render() {

    return (
      <Page showHeader={true}>
        <InlineCss stylesheet={styles} componentName="container">
          <div className="headline"></div>
          <div className="gameControls">
            <CreateOrJoinControls />
          </div>
          <HowToPlay />
        </InlineCss>
      </Page>
    );

  }
});

export default Homepage;