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

export default {
	apiSuccessful, apiFailed, dataReceived
}