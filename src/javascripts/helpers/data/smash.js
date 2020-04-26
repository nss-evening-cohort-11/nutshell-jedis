import axios from 'axios';
import apiKeys from '../apiKeys.json';

import assignmentsData from './assignmentsData';
import shiftsData from './shiftsData';
import calendarData from './calendarData';

const baseUrl = apiKeys.firebaseKeys.databaseURL;

const removeAllAssignmentsAndShiftsByEntityId = (entityId) => new Promise((resolve, reject) => {
  assignmentsData.getRideAssignmentsByEntityId(entityId)
    .then((assignments) => {
      assignments.forEach((singleAssignment) => {
        const assignmentId = singleAssignment.id;
        shiftsData.getShiftsByAssignmentId(assignmentId)
          .then((shifts) => {
            shifts.forEach((singleShift) => {
              const shiftId = singleShift.id;
              shiftsData.deleteShiftById(shiftId);
            });
          });
        assignmentsData.deleteAssignmentById(assignmentId);
      });
      resolve();
    })
    .catch((err) => reject(err));
});

const deleteStaffAssignmentsAndShifts = (staffMemberId) => new Promise((resolve, reject) => {
  assignmentsData.getAllAssignments()
    .then((assignmentsArray) => {
      const assignmentsToRemove = assignmentsArray.filter((a) => a.staffId === staffMemberId);
      assignmentsToRemove.forEach((item) => {
        axios.delete(`${baseUrl}/assignments/${item.id}.json`);
        shiftsData.getAllShifts()
          .then((shiftsArray) => {
            const deleteThisShift = shiftsArray.find((shift) => shift.assignmentId === item.id);
            axios.delete(`${baseUrl}/shifts/${deleteThisShift.id}.json`);
          });
      });
      resolve();
    })
    .catch((err) => console.error('problem with deleting assignments for staff', reject(err)));
});

// const getAllShiftsByDayId = (dayId) => new Promise((resolve, reject) => {
//   calendarData.getDayById(dayId)
//     .then((response) => {
//       const day = response.data;
//     })
//     .catch((err) => reject(err));
// });

const getDayWithShifts = (dayId) => new Promise((resolve, reject) => {
  calendarData.getDayById(dayId)
    .then((response) => {
      const singleDay = response.data;
      singleDay.id = dayId;
      shiftsData.getShiftsByDayId(singleDay.id)
        .then((shifts) => {
          singleDay.amShifts = shifts.filter((shift) => shift.workTimeId === 'workTime1');
          singleDay.pmShifts = shifts.filter((shift) => shift.workTimeId === 'workTime2');
          resolve(singleDay);
        });
    })
    .catch((err) => reject(err));
});

export default { removeAllAssignmentsAndShiftsByEntityId, deleteStaffAssignmentsAndShifts, getDayWithShifts };
