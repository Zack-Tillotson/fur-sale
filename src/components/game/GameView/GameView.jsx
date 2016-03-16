import React from 'react';
import InlineCss from "react-inline-css";

import {connect} from 'react-redux';
import {selector as appSelector, dispatcher as appDispatcher} from '../../../firebaseApp';
import fbSelector from '../../../firebase/selector';

import styles from './styles';

import PhaseTitle from '../PhaseTitle';
import CardTable from '../CardTable';
import PlayerList from '../PlayerList';

const GameView = React.createClass({

  propTypes: {
    furSale: React.PropTypes.object.isRequired,
    passBet: React.PropTypes.func.isRequired,
    makeBet: React.PropTypes.func.isRequired,
  },

  componentDidMount() {
    if(this.props.firebase.isLoggedIn) {
      this.connectToFirebaseData();
    }
  },

  componentWillReceiveProps(nextProps) {
    if(!this.props.firebase.isLoggedIn && nextProps.firebase.isLoggedIn) {
      setTimeout(this.connectToFirebaseData, 250);
    }
  },

  connectToFirebaseData() {
    this.props.joinGame(this.props.params.gameId);
  },

  componentWillUnmount() {
    // TODO remove the data connection
  },

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component">

        <PhaseTitle 
          phase={this.props.furSale.phase} />

        <CardTable 
          visibleCardsGone={this.props.furSale.visibleCardsGone}
          visibleCards={this.props.furSale.visibleCards} />

        <PlayerList
          players={this.props.furSale.players} 
          passBet={this.props.passBet}
          makeBet={this.props.makeBet} />

      </InlineCss>
    );
  }
});

const selector = (state) => {
  const furSale = appSelector(state);
  const firebase = fbSelector(state);
  return {furSale, firebase};
}

const dispatcher = (dispatch) => {
  const furSale = appDispatcher(dispatch);
  return {...furSale};
}

export default connect(selector, dispatcher)(GameView);