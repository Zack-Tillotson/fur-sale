import React from 'react';
import InlineCss from "react-inline-css";

import {connect} from 'react-redux';
import {selector as appSelector, dispatcher as appDispatcher} from '../../firebaseApp';
import fbSelector from '../../firebase/selector';

import NewGameForm from '../game/NewGameForm';

import styles from './styles';

const tabTitles = ['Create', 'Join Game'];

const CreateOrJoinControls = React.createClass({

  propTypes: {
    publicGames: React.PropTypes.object.isRequired,
    beginSyncPublicGameList: React.PropTypes.func.isRequired,
    endSyncPublicGameList: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      activeTab: tabTitles[0],
    };
  },

  componentDidMount() {
    this.props.beginSyncPublicGameList();
  },

  componentWillUnmount() {
    this.props.endSyncPublicGameList();
  },

  changeActiveTab(activeTab) {
    this.setState({activeTab});
  },

  navigateToGame(gameId) {
    window.location = `/games/${gameId}/`; 
  },

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component">
        <div className="tabTitles">
          {tabTitles.map(tabTitle => {
            const activeClass = this.state.activeTab === tabTitle ? 'active' : 'inactive';
            return (
              <div key={tabTitle}
                className={`tabTitle ${tabTitle} ${activeClass}`}
                onClick={this.changeActiveTab.bind(this, tabTitle)}>
                {tabTitle}
              </div>
            );
          })}
        </div>
        <div className="tabContent">
          {this.state.activeTab === tabTitles[0] && (
            <div className="createTab">
              <h3>Create New Game</h3>
              <NewGameForm />
            </div>
          )}
          {this.state.activeTab === tabTitles[1] && (
            <div className="joinTab">
              <h3>Join A Game!</h3>
              <div className="publicGameList">
                {this.props.publicGames.sort().reverse().map((game, index)=> {
                  return (
                    <div className="game" onClick={this.navigateToGame.bind(this, game.get('gameId'))}>
                      {parseInt((Date.now() - game.get('createdAt')) / 1000 / 60)} minutes ago.
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </InlineCss>
    );
  }
});

const selector = (state) => {
  const {publicGames} = appSelector(state);

  return {publicGames};
}

const dispatcher = (dispatch) => {
  const furSale = appDispatcher(dispatch);
  const {beginSyncPublicGameList, endSyncPublicGameList, createGame} = furSale;
  return {
    beginSyncPublicGameList,
    endSyncPublicGameList,
  };
}

export default connect(selector, dispatcher)(CreateOrJoinControls);