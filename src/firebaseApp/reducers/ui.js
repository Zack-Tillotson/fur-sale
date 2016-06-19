import Immutable from 'immutable';
import actionTypes from '../actionTypes';

export const defaultUiState = Immutable.fromJS({
  showHelp: false
});

export default (state = defaultUiState, action) => {

  if(action.type === actionTypes.ui && action.action === 'toggleHelp') {
    state = state.set('showHelp', !state.get('showHelp'));
  }

  return state;

}