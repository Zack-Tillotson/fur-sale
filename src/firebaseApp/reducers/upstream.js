import Immutable from 'immutable';

export default (state, data) => {

  let newState = state.mergeIn(['upstream'], Immutable.fromJS(data));
  newState = newState.updateIn(['upstream', 'decisions'], Immutable.List(), decisions => {
    return decisions.sort((a, b) => a.get('timestamp') - b.get('timestamp'))
  });

  return newState;

}