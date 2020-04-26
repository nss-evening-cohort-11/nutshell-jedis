import firebase from 'firebase/app';
import 'firebase/auth';

import utils from '../../helpers/utils';
import vendorsData from '../../helpers/data/vendorsData';
import smashData from '../../helpers/data/smashData';

const checkIfVendorsAreStaffed = () => {
  smashData.getVendorsWithAssignments().then((assignedVendors) => {
    assignedVendors.forEach((vendorAssignment) => {
      const vendorId = vendorAssignment.id;
      if (vendorAssignment.assignments.length < 1) {
        console.log('assigned vendors', vendorAssignment);
        vendorsData.updateStaffedVendors(vendorId);
      }
    });
    // }
  })
    .catch((err) => console.error('could not get vendors with assignments', err));
  // eslint-disable-next-line no-use-before-define
  printVendorsDashboard();
};

// ---  EVENT FUNCTIONS  --- //

const deleteVendorEvent = (e) => {
  const vendorId = e.target.closest('.card').id;

  vendorsData.deleteVendor(vendorId)
    .then(() => {
      // eslint-disable-next-line no-use-before-define
      printVendorsDashboard();
    })
    .catch((err) => console.error('problem with delete vendor event', err));
};

const newVendorEvent = (e) => {
  e.preventDefault();
  const newVendorName = $('#new-vendor-name').val();
  const newVendorDescription = $('#new-vendor-description').val();
  const myUid = firebase.auth().currentUser.uid;


  const newVendor = {
    name: newVendorName,
    description: newVendorDescription,
    isOpen: true,
    uid: myUid,
  };

  vendorsData.addVendor(newVendor)
    .then(() => {
      // eslint-disable-next-line no-use-before-define
      printVendorsDashboard();
    })
    .catch((err) => console.error('problem with add vendor in new vendor event', err));
};

const updateVendorEvent = (e) => {
  e.preventDefault();
  const updatedVendorId = e.target.closest('.update-vendor-form-tag').id;
  const updatedVendorName = $('#edit-vendor-name').val();
  const updatedVendorDescription = $('#edit-vendor-description').val();
  const isOpenCheckBox = $('#vendor-open-checkbox').is(':checked');
  const myUid = firebase.auth().currentUser.uid;

  const updatedVendor = {
    name: updatedVendorName,
    description: updatedVendorDescription,
    isOpen: isOpenCheckBox,
    uid: myUid,
  };

  vendorsData.updateVendor(updatedVendorId, updatedVendor)
    .then(() => {
      // eslint-disable-next-line no-use-before-define
      printVendorsDashboard();
    })
    .catch((err) => console.error('problem with update vendor in update vendor event', err));
};

const newVendorFormEvent = () => {
  $('#new-vendor-form-containter').removeClass('hide');
  $('#update-vendor-form-containter').addClass('hide');

  // eslint-disable-next-line no-use-before-define
  newVendorForm();
};

const updateVendorFormEvent = (e) => {
  $('#new-vendor-form-containter').addClass('hide');
  $('#update-vendor-form-containter').removeClass('hide');

  const vendorId = e.target.closest('.card').id;

  // eslint-disable-next-line no-use-before-define
  updateVendorForm(vendorId);
};

// ---  DOMSTRING FUNCTIONS  --- //

const newVendorForm = () => {
  let domString = '';

  domString += '<div class="card form-card col-6 offset-3 new-vendor-form-tag">';
  domString += '  <div class="card-header text-center">';
  domString += '  <h3>Add a Vendor</h3>';
  domString += '  </div>';
  domString += '  <div class="card-body">';
  domString += '  <form>';
  domString += '  <div class="form-group">';
  domString += '    <label for="new-vendor-name">Vendor Name</label>';
  domString += '    <input type="text" class="form-control mb-3" id="new-vendor-name" placeholder="Enter your vendor name">';
  domString += '    <label for="new-vendor-description">Vendor Description</label>';
  domString += '    <textarea type="text" class="form-control mb-3" id="new-vendor-description" placeholder="Enter your vendor description"></textarea>';
  domString += '  </div>';
  domString += '  </div>';
  domString += '  <div class="card-footer text-center">';
  domString += '    <button type="submit" class="btn btn-outline-success" id="vendor-creator-btn">Add</button>';
  domString += '  </div>';
  domString += '  </form>';
  domString += '</div>';

  utils.printToDom('new-vendor-form-containter', domString);
};

const updateVendorForm = (vendorId) => {
  vendorsData.getSingleVendorByVendorId(vendorId)
    .then((vendor) => {
      let domString = '';

      domString += `<fo class="card form-card col-6 offset-3 update-vendor-form-tag" id=${vendorId}>`;
      domString += '  <div class="card-header text-center">';
      domString += '  <h3>Edit a Vendor</h3>';
      domString += '  </div>';
      domString += '  <div class="card-body">';
      domString += '  <form>';
      domString += '  <div class="form-group">';
      domString += '    <label for="edit-vendor-name">Edit Vendor Name</label>';
      domString += `    <input type="text" class="form-control mb-3" id="edit-vendor-name" placeholder="Edit  your vendor name" value="${vendor.name}">`;
      domString += '    <label for="edit-vendor-description">Edit Vendor Description</label>';
      domString += `    <textarea type="text" class="form-control mb-3" id="edit-vendor-description" placeholder="Edit your vendor description">${vendor.description}</textarea>`;
      domString += '    <div class="custom-control custom-checkbox">';
      domString += `      <input type="checkbox" class="custom-control-input" id="vendor-open-checkbox" ${vendor.isOpen ? 'checked' : ''}>`;
      domString += '      <label class="custom-control-label" for="vendor-open-checkbox">Vendor is open</label>';
      domString += '    </div>';
      domString += '  </div>';
      domString += '  </div>';
      domString += '  <div class="card-footer text-center">';
      domString += '    <button type="submit" class="btn btn-outline-success" id="vendor-modifier-btn">Update</button>';
      domString += '  </div>';
      domString += '  </form>';
      domString += '</div>';

      utils.printToDom('update-vendor-form-containter', domString);
    })
    .catch((err) => console.error('problem with get single vendor by vendor id in update vendor form', err));
};

const printVendorsDashboard = () => {
  vendorsData.getVendors()
    .then((vendors) => {
      let domString = '';

      domString += '<h1 class="text-center my-3">[ Vendors ]</h1>';
      domString += '<div class="d-flex justify-content-center mb-3" id="add-pin-container">';
      domString += '<button class="btn dashboard-btn" id="new-vendor-btn" type="button"><i class="fas fa-plus dashboard-icon"></i></button>';
      domString += '</div>';
      domString += '<div id="new-vendor-form-containter" class="my-3"></div>';
      domString += '<div id="update-vendor-form-containter" class="my-3"></div>';
      domString += '<div id="edit-form-container"></div>';
      domString += '<div class="d-flex flex-wrap">';

      vendors.forEach((vendor) => {
        domString += '<div class="col-lg-4 col-md-6">';
        domString += `<div class="card text-center my-2 ${vendor.isOpen ? 'bg-info' : 'bg-danger'}" id="${vendor.id}">`;
        domString += '  <div class="card-header">';
        domString += `    <h2 class="card-title">${vendor.name}</h2>`;
        domString += '  </div>';
        domString += '  <div class="card-body text-center">';
        if (vendor.isOpen === false) {
          domString += '<p class="card-text text-light"><strong>Closed</strong></p>';
        }
        domString += `    <p class="card-text">${vendor.description}</p>`;
        domString += '  </div>';
        domString += '  <div class="card-footer">';
        domString += '    <button class="btn card-btn mx-1 btn-outline-danger delete-vendor-btn"><i class="fas fa-trash card-icon"></i></button>';
        // eslint-disable-next-line max-len
        domString += '    <button class="btn card-btn mx-1 btn-outline-success update-vendor-btn" type="button" data-toggle="collapse" data-target="#update-vendor-form" aria-expanded="false" aria-controls="updateVendorForm"><i class="fas fa-pencil-alt card-icon"></i></button>';
        domString += '  </div>';
        domString += '</div>';
        domString += '</div>';
      });

      domString += '</div>';

      utils.printToDom('vendors-dashboard', domString);
    })
    .catch((err) => console.error('problem with get vendors in print vendors', err));
};

const vendorsEvents = () => {
  $('body').on('click', '.delete-vendor-btn', deleteVendorEvent);
  $('body').on('click', '#vendor-creator-btn', newVendorEvent);
  $('body').on('click', '#vendor-modifier-btn', updateVendorEvent);
  $('body').on('click', '.update-vendor-btn', updateVendorFormEvent);
  $('body').on('click', '#new-vendor-btn', newVendorFormEvent);
};

export default { printVendorsDashboard, vendorsEvents, checkIfVendorsAreStaffed };
