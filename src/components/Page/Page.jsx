import React from 'react';

import InlineCss from 'react-inline-css';
import styles from './styles';

import Header from '../Header';
import Body from '../Body';
import Footer from '../Footer';

const Page = React.createClass({

  propTypes: {
    showHeader: React.PropTypes.bool,
    showHelpLink: React.PropTypes.bool,
    onHelpClick: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      showHeader: true,
      showHelpLink: false,
      onHelpClick: () => {},
    }
  },

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component">
        {this.props.showHeader && (
          <Header showHelpLink={this.props.showHelpLink} onHelpClick={this.props.onHelpClick} />
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