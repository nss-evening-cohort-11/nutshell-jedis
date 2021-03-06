import firebase from 'firebase/app';
import 'firebase/auth';

import utils from '../../helpers/utils';


const signMeIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
};

const loginButton = () => {
  const domString = '<button id="google-auth" class="btn"><i class="fab fa-google"></i></button>';
  utils.printToDom('auth', domString);
  $('#google-auth').click(signMeIn);
};

const logoutEvent = () => {
  $('#logout-btn').click(() => {
    window.location.reload(false);
    firebase.auth().signOut();
  });
};


export default {
  loginButton,
  logoutEvent,
};
