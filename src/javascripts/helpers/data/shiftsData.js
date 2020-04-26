import axios from 'axios';
import apiKeys from '../apiKeys.json';

const baseUrl = apiKeys.firebaseKeys.databaseURL;

const getAllShifts = () => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/shifts.json`)
    .then((response) => {
      const theShifts = response.data;
      const shifts = [];
      if (theShifts) {
        Object.keys(theShifts).forEach((shiftId) => {
          theShifts[shiftId].id = shiftId;
          shifts.push(theShifts[shiftId]);
        });
      }
      resolve(shifts);
    })
    .catch((err) => console.error('getStaff broke', reject(err)));
});

const getShiftsByAssignmentId = (assignmentId) => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/shifts.json?orderBy="assignmentId"&equalTo="${assignmentId}"`)
    .then((response) => {
      const theseShifts = response.data;
      const shifts = [];
      Object.keys(theseShifts).forEach((shiftId) => {
        theseShifts[shiftId].id = shiftId;
        shifts.push(theseShifts[shiftId]);
      });
      resolve(shifts);
    })
    .catch((err) => reject(err));
});

const getShiftsByDayId = (dayId) => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/shifts.json?orderBy="dayId"&equalTo="${dayId}"`)
    .then((response) => {
      const theseShifts = response.data;
      const shifts = [];
      Object.keys(theseShifts).forEach((shiftId) => {
        theseShifts[shiftId].id = shiftId;
        shifts.push(theseShifts[shiftId]);
      });
      resolve(shifts);
    })
    .catch((err) => reject(err));
});

const deleteShiftById = (shiftId) => axios.delete(`${baseUrl}/shifts/${shiftId}.json`);

export default {
  getShiftsByAssignmentId,
  deleteShiftById,
  getAllShifts,
  getShiftsByDayId,
};
