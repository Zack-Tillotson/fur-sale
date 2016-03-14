import Firebase from 'firebase';

const firebaseUrlBase = __FIREBASE_URL__; // From webpack

function getFirebaseUrl(path) {
  return [firebaseUrlBase, path]
    .filter(section => !!section)
    .join('/');
}

function connect(path) {
  const firebaseUrl = getFirebaseUrl(path);
  return new Firebase(firebaseUrl);
}

export default {connect};