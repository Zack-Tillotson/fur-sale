import types from './actionTypes';

function apiSuccessful(event, data) {
	return {type: types.apiSuccessful, event, data}
}

function apiFailed(event, data) {
	return {type: types.apiFailed, event, data}
}

export default {
	apiSuccessful, apiFailed
}