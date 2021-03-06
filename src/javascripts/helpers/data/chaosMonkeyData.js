import axios from 'axios';
import apiKeys from '../apiKeys.json';
// eslint-disable-next-line import/no-cycle
import overview from '../../components/overview/overview';

const baseUrl = apiKeys.firebaseKeys.databaseURL;
const moment = require('moment');

const getAllChaosEvents = () => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/chaosMonkeyEvents.json`)
    .then((response) => {
      const allEvents = response.data;
      const eventsArray = [];
      if (allEvents) {
        Object.keys(allEvents).forEach((eventId) => {
          allEvents[eventId].id = eventId;
          eventsArray.push(allEvents[eventId]);
        });
      }
      resolve(eventsArray);
    })
    .catch((err) => console.error('problem with getAllChaosEvents', reject(err)));
});

const postChaosEvent = (event) => axios.post(`${baseUrl}/chaosMonkeyEvents.json`, event);

const addEventToChaosHistory = (eventType, entityId) => {
  if (eventType === 'kidnap') {
    const newEvent = {
      affectedEntityId: entityId,
      eventType: 'kidnap',
      timestamp: moment().format('MMMM Do YYYY, h:mm a'),
    };
    postChaosEvent(newEvent);
  } else if (eventType === 'broken') {
    const newEvent = {
      affectedEntityId: entityId,
      eventType: 'broken',
      timestamp: moment().format('MMMM Do YYYY, h:mm a'),
    };
    postChaosEvent(newEvent);
  } else {
    const newEvent = {
      affectedEntityId: entityId,
      eventType: 'stolen',
      timestamp: moment().format('MMMM Do YYYY, h:mm a'),
    };
    postChaosEvent(newEvent);
  }
  overview.printOverviewDashboard();
};

export default { getAllChaosEvents, addEventToChaosHistory };
