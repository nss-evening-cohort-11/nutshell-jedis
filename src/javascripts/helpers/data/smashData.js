import assignmentData from './assignmentData';
import vendorsData from './vendorsData';
import jobTypeData from './jobTypeData';
// import staffData from './staffData';

// const getVendorsWithAssignments = () => new Promise((resolve, reject) => {
//   assignmentData.getAssignments().then((assignmentsResponse) => {
//     vendorsData.getVendors().then((vendorsResponse) => {
//       staffData.getStaffs().then((staffResponse) => {
//         const finalVendors = [];
//         vendorsResponse.forEach((vendor) => {
//           const newVendor = { assignments: [], ...vendor };
//           const vendorAssignments = assignmentsResponse.filter((x) => x.assetId === vendor.id);
//           vendorAssignments.forEach((oneAssignment) => {
//             const newStaffMember = staffResponse.find((x) => x.id === oneAssignment.staffId && !x.isKidnapped);
//             if (newStaffMember !== undefined) {
//               newVendor.assignments.push(newStaffMember);
//             }
//           });
//           finalVendors.push(newVendor);
//         });
//         resolve(finalVendors);
//       });
//     });
//   })
//     .catch((err) => reject(err));
// });

const getVendorsWithAssignments = () => new Promise((resolve, reject) => {
  assignmentData.getAssignments().then((assignmentResponse) => {
    jobTypeData.getJobTypes().then((jobTypeResponse) => {
      vendorsData.getVendors().then((vendorsResponse) => {
        const finalVendors = [];
        vendorsResponse.forEach((vendor) => {
          const newVendor = { ...vendor };
          const vendorJobTypes = jobTypeResponse.filter((x) => x.assetId === vendor.id);
          vendorJobTypes.forEach((oneJobType) => {
            const assignedJobType = assignmentResponse.filter((x) => x.jobTypeId === oneJobType.id);
            if (assignedJobType !== undefined) {
              newVendor.assignments = assignedJobType;
            }
          });
          finalVendors.push(newVendor);
        });
        resolve(finalVendors);
      });
    });
  })
    .catch((err) => reject(err));
});

export default { getVendorsWithAssignments };
