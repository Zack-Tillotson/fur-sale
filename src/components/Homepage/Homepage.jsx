import React from 'react';
import InlineCss from "react-inline-css";

import {Link} from 'react-router';
import Preferences from '../Preferences';

import styles from './styles';

const Homepage = React.createClass({

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="container">
      	<section>
	        <h1>Fur Sale!</h1>
	        <Link to="/preferences/">Preferences</Link>
          <Link to="/firebase/">Firebase</Link>
	       </section>
      </InlineCss>
    );
  }
});

export default Homepage;