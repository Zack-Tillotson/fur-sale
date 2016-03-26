import React from 'react';

import InlineCss from 'react-inline-css';
import styles from './styles';

import Header from '../Header';
import Body from '../Body';
import Footer from '../Footer';

const Page = React.createClass({

  propTypes: {
    showHeader: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      showHeader: true,
    }
  },

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component">
        {this.props.showHeader && (
          <Header />
        )}
        <Body>
          {this.props.children}
        </Body>
        <Footer />
      </InlineCss>
    );
  }
});

export default Page;