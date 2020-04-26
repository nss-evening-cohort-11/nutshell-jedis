import axios from 'axios';
import apiKeys from '../apiKeys.json';

const baseUrl = apiKeys.firebaseKeys.databaseURL;

const getAllDaysOfTheWeek = () => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/calendar.json`)
    .then((response) => {
      const daysOfTheWeek = response.data;
      const days = [];
      Object.keys(daysOfTheWeek).forEach((dayId) => {
        daysOfTheWeek[dayId].id = dayId;
        days.push(daysOfTheWeek[dayId]);
      });
      resolve(days);
    })
    .catch((err) => reject(err));
});

const getDayById = (dayId) => axios.get(`${baseUrl}/calendar/${dayId}.json`);

export default { getAllDaysOfTheWeek, getDayById };
