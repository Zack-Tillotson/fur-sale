import types from './actionTypes';

function apiSuccessful(event, data) {
  return {type: types.apiSuccessful, event, data}
}

function apiFailed(event, data) {
  return {type: types.apiFailed, event, data}
}

function dataReceived(data) {
  return {type: types.dataReceived, data}
}

function toggleHelp(shouldShow = false) {
  return {type: types.ui, action: 'toggleHelp', shouldShow}
}

export default {
  apiSuccessful, apiFailed, dataReceived, toggleHelp
}