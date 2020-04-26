import axios from 'axios';
import apiKeys from '../apiKeys.json';

import assignmentsData from './assignmentsData';
import shiftsData from './shiftsData';
import calendarData from './calendarData';
import jobTypeData from './jobTypeData';

const baseUrl = apiKeys.firebaseKeys.databaseURL;

// const removeAllJobTypesAndAssignmentByAssetId = (assetId) => new Promise((resolve, reject) => {
//   assignmentsData.getRideAssignmentsByEntityId(assetId)
//     .then((assignments) => {
//       assignments.forEach((singleAssignment) => {
//         const assignmentId = singleAssignment.id;
//         shiftsData.getShiftsByAssignmentId(assignmentId)
//           .then((shifts) => {
//             shifts.forEach((singleShift) => {
//               const shiftId = singleShift.id;
//               shiftsData.deleteShiftById(shiftId);
//             });
//           });
//         assignmentsData.deleteAssignmentById(assignmentId);
//       });
//       resolve();
//     })
//     .catch((err) => reject(err));
// });

const removeAllJobTypesAndAssignmentByAssetId = (assetId) => new Promise((resolve, reject) => {
  jobTypeData.getJobTypesByAssetId(assetId)
    .then((jobTypes) => {
      jobTypes.forEach((singleJobType) => {
        const jobTypeId = singleJobType.id;
        assignmentsData.getRideAssignmentsByJobTypeId(jobTypeId)
          .then((assignments) => {
            assignments.forEach((singleAssignment) => {
              const assignmentId = singleAssignment.id;
              assignmentsData.deleteAssignmentById(assignmentId);
            });
          });
        jobTypeData.deleteJobTypeById(jobTypeId);
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

// const getDayWithShifts = (dayId) => new Promise((resolve, reject) => {
//   calendarData.getDayById(dayId)
//     .then((response) => {
//       const singleDay = response.data;
//       singleDay.id = dayId;
//       shiftsData.getShiftsByDayId(singleDay.id)
//         .then((shifts) => {
//           singleDay.amShifts = shifts.filter((shift) => shift.workTimeId === 'workTime1');
//           singleDay.pmShifts = shifts.filter((shift) => shift.workTimeId === 'workTime2');
//           resolve(singleDay);
//         });
//     })
//     .catch((err) => reject(err));
// });

const getDayWithShifts = (dayId) => new Promise((resolve, reject) => {
  calendarData.getDayById(dayId).then((dayResponse) => {
    shiftsData.getShiftsByDayId(dayId).then((shifts) => {
      assignmentsData.getAllAssignments().then((assignments) => {
        const finalDay = { amShifts: [], pmShifts: [], ...dayResponse.data };
        shifts.forEach((singleShift) => {
          const thisShift = { assignments: [], ...singleShift };
          const shiftAssingments = assignments.filter((singleAssignment) => singleAssignment.id === singleShift.assignmentId);
          shiftAssingments.forEach((oneAssignment) => {
            thisShift.assignments.push(oneAssignment);
          });
          if (thisShift.workHours === 'AM') {
            finalDay.amShifts.push(thisShift);
          } else if (thisShift.workHours === 'PM') {
            finalDay.pmShifts.push(thisShift);
          }
        });
        resolve(finalDay);
      });
    });
  })
    .catch((err) => reject(err));
});

export default { removeAllJobTypesAndAssignmentByAssetId, deleteStaffAssignmentsAndShifts, getDayWithShifts };
