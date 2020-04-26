import axios from 'axios';
import apiKeys from '../apiKeys.json';

const baseUrl = apiKeys.firebaseKeys.databaseURL;

const getAssignments = () => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/assignments.json`)
    .then((response) => {
      const allAssignments = response.data;
      const assignments = [];
      if (allAssignments) {
        Object.keys(allAssignments).forEach((assignmentId) => {
          allAssignments[assignmentId].id = assignmentId;
          assignments.push(allAssignments[assignmentId]);
        });
      }
      resolve(assignments);
    })
    .catch((err) => console.error('getDinos broke', reject(err)));
});

export default { getAssignments };
