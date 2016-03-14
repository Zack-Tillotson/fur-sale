import {combineReducers} from 'redux';
import firebase from '../../firebase/reducer';
import {reducer as firebaseApp} from '../../firebaseApp';

export default combineReducers({firebase, firebaseApp});