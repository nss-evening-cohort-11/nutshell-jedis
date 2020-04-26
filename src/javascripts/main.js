import firebase from 'firebase/app';
import apiKeys from './helpers/apiKeys.json';
import overviewComponent from './components/overview/overview';
import navbarComponent from './components/navbar/navbar';
import dinosComponent from './components/dinos/dinos';
import staffComponent from './components/staff/staff';
import ridesComponent from './components/rides/rides';
import equipmentComponent from './components/equipmentStorageContainer/equipmentStorageContainer';
import vendorsComponent from './components/vendors/vendors';
import 'bootstrap';
import '../styles/main.scss';

import authData from './helpers/data/authData';
import auth from './components/auth/auth';
import chaosMonkey from './components/chaosMonkey/chaosMonkey';

const mainEvents = () => {
  $('body').on('click', '.nav-icon', navbarComponent.navbarEvents);
  $('body').on('click', '#test-button', chaosMonkey.unleashChaosMonkey);
};


const init = () => {
  firebase.initializeApp(apiKeys.firebaseKeys);
  authData.checkLoginStatus();
  auth.loginButton();
  auth.logoutEvent();
  mainEvents();
  overviewComponent.printOverviewDashboard();
  dinosComponent.printDinosDashboard();
  staffComponent.printStaffDashboard();
  ridesComponent.printRidesDashboard();
  equipmentComponent.printEquipmentDashboard();
  vendorsComponent.printVendorsDashboard();
  chaosMonkey.unleashChaosMonkey();
  vendorsComponent.checkIfVendorsAreStaffed();
};

init();
