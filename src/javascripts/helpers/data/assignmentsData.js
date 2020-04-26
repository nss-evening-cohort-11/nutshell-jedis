import axios from 'axios';
import apiKeys from '../apiKeys.json';

const baseUrl = apiKeys.firebaseKeys.databaseURL;

const getAllAssignments = () => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/assignments.json`)
    .then((response) => {
      const theAssignments = response.data;
      const assignments = [];
      if (theAssignments) {
        Object.keys(theAssignments).forEach((assignmentId) => {
          theAssignments[assignmentId].id = assignmentId;
          assignments.push(theAssignments[assignmentId]);
        });
      }
      resolve(assignments);
    })
    .catch((err) => console.error('getStaff broke', reject(err)));
});

const getRideAssignmentsByEntityId = (entityId) => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/assignments.json?orderBy="entityId"&equalTo="${entityId}"`)
    .then((response) => {
      const theseAssignments = response.data;
      const assignments = [];
      Object.keys(theseAssignments).forEach((assignmentId) => {
        theseAssignments[assignmentId].id = assignmentId;
        assignments.push(theseAssignments[assignmentId]);
      });
      resolve(assignments);
    })
    .catch((err) => reject(err));
});

const getAssignmentById = (assignmentId) => axios.get(`${baseUrl}/assignments/${assignmentId}`);

const deleteAssignmentById = (assignmentId) => axios.delete(`${baseUrl}/assignments/${assignmentId}.json`);

export default {
  getRideAssignmentsByEntityId,
  deleteAssignmentById,
  getAllAssignments,
  getAssignmentById,
};
