import React from 'react';
import InlineCss from "react-inline-css";

import Page from '../Page';
import LoginForm from '../LoginForm';
import FirebaseStatus from '../FirebaseStatus';

import styles from './styles';

const Preferences = React.createClass({

  render() {
    return (
      <Page>
        <InlineCss stylesheet={styles} componentName="container">
          <LoginForm />
          <FirebaseStatus />
        </InlineCss>
      </Page>
    );
  }
});

export default Preferences;