/* eslint-disable no-console */
import axios from 'axios';
import apiKeys from '../apiKeys.json';

import staffData from './staffData';
import dinoData from './dinoData';
import vendorsData from './vendorsData';
import ridesData from './ridesData';
import assignmentsData from './assignmentsData';
import shiftsData from './shiftsData';
import jobTypeData from './jobTypeData';

const baseUrl = apiKeys.firebaseKeys.databaseURL;

const getAllJobsWithRelatedAssets = () => new Promise((resolve, reject) => {
  jobTypeData.getJobTypes().then((jobTypes) => {
    dinoData.getDinos().then((dinos) => {
      ridesData.getRides().then((rides) => {
        vendorsData.getVendors().then((vendors) => {
          const finalJobs = [];
          jobTypes.forEach((singleJob) => {
            const job = { jobDuty: {}, ...singleJob };
            const dinoMatch = dinos.find((dino) => dino.id === job.assetId);
            const rideMatch = rides.find((ride) => ride.id === job.assetId);
            const vendorMatch = vendors.find((vendor) => vendor.id === job.assetId);
            const jobMatch = [dinoMatch, rideMatch, vendorMatch].find((x) => x !== undefined);
            job.jobDuty = jobMatch;
            finalJobs.push(job);
          });
          resolve(finalJobs);
        });
      });
    });
  })
    .catch((err) => reject(err));
});

const findOutWhichJobsOnShiftAreNotAssigned = (shiftId) => new Promise((resolve, reject) => {
  jobTypeData.getJobTypesByShiftId(shiftId).then((jobTypes) => {
    assignmentsData.getAllAssignments().then((assignments) => {
      getAllJobsWithRelatedAssets().then((finalJobs) => {
        const shiftJobs = [];
        jobTypes.forEach((oneJob) => {
          let newJob = { ...oneJob };
          const jobsWithAssets = finalJobs.filter((x) => x.id === newJob.id);
          jobsWithAssets.forEach((job) => {
            newJob = job;
            const jobIsAssigned = assignments.some((x) => x.jobId === job.id);
            newJob.jobIsAssigned = jobIsAssigned;
          });
          shiftJobs.push(newJob);
        });
        console.log(shiftJobs);
        resolve(shiftJobs);
      });
    });
  })
    .catch((err) => reject(err));
});

const getSingleStaffMemberWithAssignedJobs = (staffId) => new Promise((resolve, reject) => {
  staffData.getSingleStaffMemeber(staffId).then((staffResponse) => {
    const staffMember = staffResponse.data;
    staffMember.id = staffId;
    staffMember.assignedJobs = [];
    assignmentsData.getAssignmentsByStaffId(staffId).then((assignments) => {
      jobTypeData.getJobTypes().then((jobTypes) => {
        assignments.forEach((singleAssignment) => {
          const assignedJobs = jobTypes.filter((job) => job.id === singleAssignment.jobId);
          staffMember.assignedJobs.push(assignedJobs);
        });
        resolve(staffMember);
      });
    });
  })
    .catch((err) => reject(err));
});

const getAllWeeklyShiftsWithSingleStaffMemberJobAssignments = (staffId) => new Promise((resolve, reject) => {
  staffData.getSingleStaffMemeber(staffId).then((staffResponse) => {
    const staffMember = staffResponse.data;
    staffMember.id = staffId;
    shiftsData.getAllShifts().then((shifts) => {
      assignmentsData.getAllAssignments().then((assignments) => {
        getAllJobsWithRelatedAssets().then((finalJobs) => {
          const finalShiftsBeingWorkedByStaffMember = [];
          shifts.forEach((oneShift) => {
            const shift = { thisStaffMemberJobs: [], ...oneShift };
            const jobAssignmentsOnThisShift = finalJobs.filter((job) => job.shiftId === oneShift.id);
            assignments.forEach((singleAssignment) => {
              jobAssignmentsOnThisShift.forEach((job) => {
                if (singleAssignment.jobId === job.id && singleAssignment.staffId === staffMember.id) {
                  shift.thisStaffMemberJobs.push(job);
                }
              });
            });
            finalShiftsBeingWorkedByStaffMember.push(shift);
          });
          staffMember.schedule = finalShiftsBeingWorkedByStaffMember;
          resolve(staffMember);
        });
      });
    });
  })
    .catch((err) => reject(err));
});

const removeAllJobAssignmentsByAssetId = (assetId) => new Promise((resolve, reject) => {
  jobTypeData.getJobTypesByAssetId(assetId)
    .then((jobTypes) => {
      jobTypes.forEach((singleJobType) => {
        const jobTypeId = singleJobType.id;
        assignmentsData.getAssignmentsByJobTypeId(jobTypeId)
          .then((assignments) => {
            assignments.forEach((singleAssignment) => {
              const assignmentId = singleAssignment.id;
              assignmentsData.deleteAssignmentById(assignmentId);
            });
          });
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

const getAllStaffWithJobs = () => new Promise((resolve, reject) => {
  staffData.getStaffs().then((staff) => {
    assignmentsData.getAllAssignments().then((assignments) => {
      jobTypeData.getJobTypes().then((jobTypes) => {
        const finalStaffMembersWithJobs = [];
        staff.forEach((staffMember) => {
          const thisStaffMember = { jobs: [], ...staffMember };
          const thisStaffMemberAssignments = assignments.filter((x) => x.staffId === thisStaffMember.id);
          jobTypes.forEach((oneJob) => {
            const thisJob = { ...oneJob };
            const thisJobAssignment = thisStaffMemberAssignments.find((x) => x.jobId === thisJob.id);
            thisJob.isAssigned = thisJobAssignment !== undefined;
            if (thisJob.isAssigned) {
              thisStaffMember.jobs.push(thisJob);
            }
          });
          finalStaffMembersWithJobs.push(thisStaffMember);
        });
        resolve(finalStaffMembersWithJobs);
      });
    });
  })
    .catch((err) => reject(err));
});

export default {
  deleteStaffAssignmentsAndShifts,
  removeAllJobAssignmentsByAssetId,
  getSingleStaffMemberWithAssignedJobs,
  getAllWeeklyShiftsWithSingleStaffMemberJobAssignments,
  getAllJobsWithRelatedAssets,
  findOutWhichJobsOnShiftAreNotAssigned,
  getAllStaffWithJobs,
};
