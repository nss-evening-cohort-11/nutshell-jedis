/* eslint-disable no-console */
import axios from 'axios';
import apiKeys from '../apiKeys.json';

import staffData from './staffData';
import dinoData from './dinoData';
import vendorsData from './vendorsData';
import ridesData from './ridesData';
import assignmentsData from './assignmentsData';
import jobTypeData from './jobTypeData';
import shiftsData from './shiftsData';
import equipJobsData from './equipJobsData';

const baseUrl = apiKeys.firebaseKeys.databaseURL;

const completelyRemoveTask = (randEquipId) => new Promise((resolve, reject) => {
  assignmentsData.getAllAssignments()
    .then((assignResponse) => {
      equipJobsData.getAllEquipJobs()
        .then((equipJobsResponse) => {
          const assignments = assignResponse;
          const equipJobs = equipJobsResponse;
          assignments.forEach((assignment) => {
            equipJobs.forEach((equipJob) => {
              if (randEquipId === equipJob.equipId) {
                if (equipJob.jobId === assignment.jobId) {
                  equipJobsData.deleteEquipJobById(equipJob.id);
                  assignmentsData.deleteAssignmentById(assignment.id);
                  console.log('equipJob', equipJob);
                  console.log('assignment', assignment);
                }
              }
            });
          });
          console.log('assignments', assignments);
          console.log('equipJobs', equipJobs);
        });
      resolve();
    })
    .catch((err) => reject(err));
});

const getSingleVendorSchedule = (vendorId) => new Promise((resolve, reject) => {
  vendorsData.getSingleVendorByVendorId(vendorId).then((vendor) => {
    const thisVendor = vendor;
    thisVendor.id = vendorId;
    shiftsData.getAllShifts().then((shifts) => {
      jobTypeData.getJobTypesByAssetId(vendorId).then((jobTypes) => {
        assignmentsData.getAllAssignments().then((assignments) => {
          staffData.getStaffs().then((staffMembers) => {
            const finalVendorShiftsWithAssignments = [];
            shifts.forEach((oneShift) => {
              const shift = { thisAssetJobs: [], ...oneShift };
              const jobsOnThisShift = jobTypes.filter((x) => x.shiftId === oneShift.id);
              jobsOnThisShift.forEach((job) => {
                const thisJob = { assignment: {}, ...job };
                thisJob.assignment = assignments.find((x) => x.jobId === job.id);
                staffMembers.forEach((oneStaffMember) => {
                  if (thisJob.assignment && thisJob.assignment.staffId === oneStaffMember.id) {
                    thisJob.assignment.staffMember = oneStaffMember;
                  }
                });
                shift.thisAssetJobs.push(thisJob);
              });
              finalVendorShiftsWithAssignments.push(shift);
            });
            thisVendor.schedule = finalVendorShiftsWithAssignments;
            resolve(thisVendor);
          });
        });
      });
    });
  })
    .catch((err) => reject(err));
});

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
    staffMember.jobs = [];
    assignmentsData.getAssignmentsByStaffId(staffId).then((assignments) => {
      jobTypeData.getJobTypes().then((jobTypes) => {
        assignments.forEach((singleAssignment) => {
          const assignedJobs = jobTypes.filter((job) => job.id === singleAssignment.jobId);
          assignedJobs.forEach((job) => {
            staffMember.jobs.push(job);
          });
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

const deleteStaffAssignments = (staffMemberId) => new Promise((resolve, reject) => {
  assignmentsData.getAllAssignments()
    .then((assignmentsArray) => {
      const assignmentsToRemove = assignmentsArray.filter((a) => a.staffId === staffMemberId);
      assignmentsToRemove.forEach((item) => {
        axios.delete(`${baseUrl}/assignments/${item.id}.json`);
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

const getAllWeeklyShiftsForRidesByRideId = (rideId) => new Promise((resolve, reject) => {
  ridesData.getSingleRide(rideId).then((rideResponse) => {
    const ride = rideResponse.data;
    ride.id = rideId;
    shiftsData.getAllShifts().then((shifts) => {
      staffData.getStaffs().then((staffResponse) => {
        const staffMembers = staffResponse;
        assignmentsData.getAllAssignments().then((assignments) => {
          getAllJobsWithRelatedAssets().then((finalJobs) => {
            const finalShiftsBeingWorkedByStaffMember = [];
            shifts.forEach((oneShift) => {
              const shift = { thisAssetJobs: [], ...oneShift };
              const jobAssignmentsOnThisShift = finalJobs.filter((job) => job.shiftId === oneShift.id);
              assignments.forEach((singleAssignment) => {
                jobAssignmentsOnThisShift.forEach((job) => {
                  staffMembers.forEach((staffMember) => {
                    if (singleAssignment.jobId === job.id && job.assetId === ride.id && singleAssignment.staffId === staffMember.id) {
                      const thisJob = job;
                      thisJob.name = staffMember.name;
                      shift.thisAssetJobs.push(job);
                    }
                  });
                });
              });
              finalShiftsBeingWorkedByStaffMember.push(shift);
            });
            ride.schedule = finalShiftsBeingWorkedByStaffMember;
            resolve(ride);
          });
        });
      });
    });
  })
    .catch((err) => reject(err));
});

const getVendorsWithAssignments = () => new Promise((resolve, reject) => {
  jobTypeData.getJobTypes().then((jobTypesResponse) => {
    assignmentsData.getAllAssignments().then((assignmentsResponse) => {
      vendorsData.getVendors().then((vendorsResponse) => {
        const finalVendors = [];
        vendorsResponse.forEach((vendor) => {
          const newVendor = { jobs: [], ...vendor };
          const vendorJobs = jobTypesResponse.filter((x) => x.assetId === vendor.id);
          vendorJobs.forEach((job) => {
            const newVendorJob = { assignments: [], ...job };
            const jobAssignments = assignmentsResponse.filter((x) => x.jobId === job.id);
            if (jobAssignments.length !== 0) {
              newVendorJob.assignments.push(jobAssignments);
            }
            newVendor.jobs.push(newVendorJob);
          });
          finalVendors.push(newVendor);
        });
        resolve(finalVendors);
      });
    });
  })
    .catch((err) => reject(err));
});

const getSingleDinosWithJobAssignments = (dinoId) => new Promise((resolve, reject) => {
  dinoData.getSingleDino(dinoId).then((singleDinoResponse) => {
    const singleDino = singleDinoResponse.data;
    singleDino.id = dinoId;
    const finalDinosWithAssignments = [];
    staffData.getStaffs().then((staffMembers) => {
      jobTypeData.getJobTypesByAssetId(dinoId).then((jobTypes) => {
        shiftsData.getAllShifts().then((shifts) => {
          assignmentsData.getAllAssignments().then((assignments) => {
            shifts.forEach((oneShift) => {
              const shift = { assignedStaff: [], ...oneShift };
              const jobsOnThisShift = jobTypes.filter((x) => x.shiftId === oneShift.id);
              jobsOnThisShift.forEach((job) => {
                const thisJob = { assignment: [], ...job };
                thisJob.assignment = assignments.filter((x) => x.jobId === job.id);
                thisJob.assignment.forEach((jobASS) => {
                  const foundStaff = staffMembers.find((x) => x.id === jobASS.staffId);
                  shift.assignedStaff.push(foundStaff);
                });
              });
              finalDinosWithAssignments.push(shift);
            });
            singleDino.schedule = finalDinosWithAssignments;
            console.log(singleDino);
            resolve(singleDino);
          });
        });
      });
    });
  })
    .catch((err) => reject(err));
});

export default {
  deleteStaffAssignments,
  removeAllJobAssignmentsByAssetId,
  getSingleStaffMemberWithAssignedJobs,
  getAllWeeklyShiftsWithSingleStaffMemberJobAssignments,
  getAllJobsWithRelatedAssets,
  findOutWhichJobsOnShiftAreNotAssigned,
  getAllStaffWithJobs,
  completelyRemoveTask,
  getAllWeeklyShiftsForRidesByRideId,
  getVendorsWithAssignments,
  getSingleDinosWithJobAssignments,
  getSingleVendorSchedule,
};
