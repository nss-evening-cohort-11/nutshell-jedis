import firebase from 'firebase/app';
import 'firebase/auth';

import staffData from '../../helpers/data/staffData';
import calendarData from '../../helpers/data/calendarData';
// import shiftsData from '../../helpers/data/shiftsData';
import utils from '../../helpers/utils';
import smash from '../../helpers/data/smash';

const showEditForm = () => {
  $('#edit-staff-form-container').removeClass('hide');
  $('#new-staff-form-container').addClass('hide');
  $('#schedule-staff-form-container').addClass('hide');
};

const showScheduleForm = () => {
  $('#edit-staff-form-container').addClass('hide');
  $('#new-staff-form-container').addClass('hide');
  $('#schedule-staff-form-container').removeClass('hide');
};

const closeFormButton = () => {
  const domString = '<button id="close-form-button" class="btn btn-outline-light"><i class="text-white fas fa-times"></i></button>';
  return domString;
};

const newStaffForm = () => {
  let domString = '';
  domString += '<div class="card form-card col-6 offset-3">';
  domString += '<div class="d-flex justify-content-between align-items-center card-header text-center">';
  domString += '<h2>New Staff Member</h2>';
  domString += closeFormButton();
  domString += '</div>';
  domString += '<div class="card-body">';
  domString += '<form class="new-staff-form">';
  domString += '<div class="form-group">';
  domString += '<label for="new-staff-name">Name</label>';
  domString += '<input type="text" class="form-control" id="new-staff-name">';
  domString += '</div>';
  domString += '<div class="form-group">';
  domString += '<label for="new-staff-image">Image Url</label>';
  domString += '<input type="text" class="form-control" id="new-staff-image">';
  domString += '</div>';
  domString += '<div class="form-group">';
  domString += '<label for="new-staff-type">Job</label>';
  domString += '<input type="text" class="form-control" id="new-staff-job">';
  domString += '</div>';
  domString += '<div class="form-check">';
  domString += '<input class="form-check-input" type="radio" name="newStaffRadiosKidnapped" id="newStaffRadiosKidnapped" value="true">';
  domString += '<label class="form-check-label" for="newStaffRadiosKidnapped">Kidnapped!</div>';
  domString += '<div class="form-check">';
  domString += '<input class="form-check-input" type="radio" name="newStaffRadiosKidnapped" id="newStaffRadiosKidnapped" value="false">';
  domString += '<label class="form-check-label" for="newStaffRadiosKidnapped">NOT Kidnapped</div>';
  domString += '<div class="form-check">';
  domString += '<input class="form-check-input" type="radio" name="newStaffRadiosEmployee" id="newStaffRadiosEmployee" value="true">';
  domString += '<label class="form-check-label" for="newStaffRadiosEmployee">Employee of the Month!</div>';
  domString += '<div class="form-check">';
  domString += '<input class="form-check-input" type="radio" name="newStaffRadiosEmployee" id="newStaffRadiosEmployee" value="false">';
  domString += '<label class="form-check-label" for="newStaffRadiosEmployee">NOT Employee of the Month</div>';
  domString += '</div>';
  domString += '<div class="card-footer text-center">';
  domString += '<button type="submit" class="btn btn-outline-success" id="submit-new-staff">Add staff</button>';
  domString += '</div>';
  domString += '</form>';
  domString += '</div>';

  utils.printToDom('new-staff-form-container', domString);
};

const showStaffForm = () => {
  $('#new-staff-form-container').removeClass('hide');
  $('#edit-staff-form-container').addClass('hide');
  $('#schedule-staff-form-container').addClass('hide');

  newStaffForm();
};

const editStaffForm = (staffId) => {
  showEditForm();
  staffData.getSingleStaffMemeber(staffId)
    .then((response) => {
      const staff = response.data;
      let domString = '';
      domString += '<div class="card form-card col-6 offset-3">';
      domString += '<div class="d-flex flex-row justify-content-between align-items-center card-header text-center">';
      domString += '<h2>Edit staff</h2>';
      domString += closeFormButton();
      domString += '</div>';
      domString += '<div class="card-body">';
      domString += `<form class="edit-staff-form" id=${staffId}>`;
      domString += '<div class="form-group">';
      domString += '<label for="staff-name">Name</label>';
      domString += `<input type="text" class="form-control" id="edit-staff-name" value=${staff.name}>`;
      domString += '</div>';
      domString += '<div class="form-group">';
      domString += '<label for="edit-staff-image">Image Url</label>';
      domString += `<input type="text" class="form-control" id="edit-staff-image" value=${staff.photoUrl}>`;
      domString += '</div>';
      domString += '<div class="form-group">';
      domString += '<label for="edit-staff-type">Job</label>';
      domString += `<input type="text" class="form-control" id="edit-staff-job" value=${staff.job}>`;
      domString += '</div>';
      domString += '<div class="form-check">';
      domString += '<input class="form-check-input" type="radio" name="editStaffRadiosKidnapped" id="editStaffRadiosKidnapped" value="true">';
      domString += '<label class="form-check-label" for="editStaffRadiosKidnapped">Kidnapped!</div>';
      domString += '<div class="form-check">';
      domString += '<input class="form-check-input" type="radio" name="editStaffRadiosKidnapped" id="editStaffRadiosKidnapped" value="false">';
      domString += '<label class="form-check-label" for="editStaffRadiosKidnapped">NOT Kidnapped</div>';
      domString += '<div class="form-check">';
      domString += '<input class="form-check-input" type="radio" name="editStaffRadiosEmployee" id="editStaffRadiosEmployee" value="true">';
      domString += '<label class="form-check-label" for="editStaffRadiosEmployee">Employee of the Month!</div>';
      domString += '<div class="form-check">';
      domString += '<input class="form-check-input" type="radio" name="editStaffRadiosEmployee" id="editStaffRadiosEmployee" value="false">';
      domString += '<label class="form-check-label" for="editStaffRadiosEmployee">NOT Employee of the Month</div>';
      domString += '</div>';
      domString += '<div class="card-footer text-center">';
      domString += '<button type="submit" class="btn btn-outline-success" id="submit-staff-changes">Update</button>';
      domString += '</div>';
      domString += '</form>';
      domString += '</div>';

      utils.printToDom('edit-staff-form-container', domString);
    });
};

const editStaffEvent = (e) => {
  e.preventDefault();
  const staffId = e.target.closest('.card').id;
  editStaffForm(staffId);
};

const scheduleStaffForm = (staffId) => {
  showScheduleForm();
  calendarData.getAllDaysOfTheWeek()
    .then((days) => {
      let domString = '';
      domString += '<div class="card form-card col-6 offset-3">';
      domString += '<div class="d-flex flex-row justify-content-between align-items-center card-header text-center">';
      domString += '<h2>Schedule Staff Member</h2>';
      domString += closeFormButton();
      domString += '</div>';
      domString += '<div class="card-body">';
      domString += `<form class="schedule-staff-form" id=${staffId}>`;
      days.forEach((day) => {
        domString += '<div class="custom-control custom-radio">';
        domString += `<input type="radio" id="${day.id}" name="dayRadio" class="custom-control-input" value="${day.id}">`;
        domString += `<label class="custom-control-label" for="${day.id}">${day.dayName}</label>`;
        domString += '</div>';
      });
      domString += '<div class="card-footer text-center">';
      domString += '<button type="button" class="btn btn-outline-success" id="submit-staff-schedule-day">Proceed With Day</button>';
      domString += '</div>';
      domString += '</form>';
      domString += '</div>';
      utils.printToDom('schedule-staff-form-container', domString);
    })
    .catch((err) => console.error('There is a problem with getting the days of the week:', err));
};

const showAvailableShiftsForSelectedDay = (e) => {
  e.preventDefault();
  // const staffId = e.target.closest('.schedule-staff-form').id;
  const selectedDayId = $("input[name='dayRadio']:checked").val();
  smash.getDayWithShifts(selectedDayId)
    .then((singleDay) => {
      console.error(singleDay);
    })
    .catch((err) => console.error('There is a problem with single day smash function', err));
  // shiftsData.getShiftsByDayId(selectedDayId)
  //   .then((shifts) => {
  //     console.error(shifts);
  //   })
  //   .catch((err) => console.error('There is a problem with getting the shifts based on day:', err));
};

const printStaff = (staff) => {
  let domString = '';
  domString += '<div class="col-lg-4 col-md-6">';
  domString += `<div id="${staff.id}" class="card text-center my-2 ${staff.isKidnapped ? 'bg-danger' : 'bg-info'}">`;
  domString += '<div class="card-header">';
  domString += `<h3 class="card-title">${staff.name}</h3>`;
  domString += '</div>';
  domString += '<div class="card-body">';
  domString += '<div>';
  domString += `<img class="card-img-top img-fluid cards-image" src="${staff.photoUrl}" alt="Card image cap">`;
  domString += '</div>';
  domString += '<p class="card-text mt-3">';
  domString += staff.isKidnapped ? `${staff.name} is missing!` : `${staff.name} is accounted for.`;
  domString += '</p>';
  domString += '<p class="card-text mt-3">';
  domString += staff.isEOTM ? `Congrats ${staff.name} for being our Employee of the Month!` : '';
  domString += '</p>';
  domString += '</div>';
  domString += '<div class="card-footer">';
  domString += '<button class="btn card-btn mx-1 btn-outline-danger delete-staff"><i class="fas fa-trash card-icon"></i></button>';
  domString += '<button class="btn card-btn mx-1 btn-outline-success edit-staff">';
  domString += '<i class="fas fa-pencil-alt card-icon"></i>';
  domString += '</button>';
  domString += '<button class="btn card-btn mx-1 btn-outline-info schedule-staff"><i class="mt-1 far fa-calendar-alt"></i></button>';
  domString += '</div>';
  domString += '</div>';
  domString += '</div>';

  return domString;
};

const printStaffDashboard = () => {
  staffData.getStaffs()
    .then((staffs) => {
      let domString = '';
      domString += '<div class="d-flex flex-wrap">';
      domString += '<div class="col-12 text-center"><h1 class="my-3">[ Staff ]</h1></div>';
      domString += '<div class="col-12 text-center"><button id="new-staff-btn" class="btn dashboard-btn mb-2">';
      domString += '<i class="fas fa-plus dashboard-icon"></i></button></div>';
      domString += '<div id="edit-staff-form-container" class="form-container col-12 my-3 hide">';
      domString += '</div>';
      domString += '<div id="new-staff-form-container" class="form-container col-12 my-3 hide">';
      domString += '</div>';
      domString += '<div id="schedule-staff-form-container" class="form-container col-12 my-3 hide">';
      domString += '</div>';
      staffs.forEach((staff) => {
        if (staff) domString += printStaff(staff);
      });
      domString += '</div>';
      utils.printToDom('staff-dashboard', domString);
    })
    .catch((err) => console.error('printStaffDashboard broke', err));
};


const makeNewStaff = (e) => {
  e.preventDefault();
  const myUid = firebase.auth().currentUser.uid;
  const isKidnappedBool = $("input[name='newStaffRadiosKidnapped']:checked").val();
  const isEotmBool = $("input[name='newStaffRadiosEmployee']:checked").val();
  const newStaff = {
    name: $('#new-staff-name').val(),
    photoUrl: $('#new-staff-image').val(),
    job: $('#new-staff-job').val(),
    isKidnapped: JSON.parse(isKidnappedBool),
    isEOTM: JSON.parse(isEotmBool),
    uid: myUid,
  };
  staffData.addStaff(newStaff).then(() => printStaffDashboard())
    .catch((err) => console.error('makeNewstaff broke', err));
};

const modifyStaff = (e) => {
  e.preventDefault();
  const myUid = firebase.auth().currentUser.uid;
  const isKidnappedBool = $("input[name='editStaffRadiosKidnapped']:checked").val();
  const isEotmBool = $("input[name='editStaffRadiosEmployee']:checked").val();
  const staffId = $('.edit-staff-form').attr('id');
  const modifiedStaff = {
    name: $('#edit-staff-name').val(),
    photoUrl: $('#edit-staff-image').val(),
    job: $('#edit-staff-job').val(),
    isKidnapped: JSON.parse(isKidnappedBool),
    isEOTM: JSON.parse(isEotmBool),
    uid: myUid,
  };
  utils.printToDom('edit-form-container', '');
  staffData.updateStaff(staffId, modifiedStaff)
    .then(() => printStaffDashboard())
    .catch((err) => console.error('Modify Pin Broke', err));
};

const removeStaff = (e) => {
  const staffId = e.target.closest('.card').id;
  staffData.deleteStaff(staffId).then(() => printStaffDashboard())
    .catch((err) => console.error('could not delete staff', err));
};

const closeStaffForm = (e) => {
  const containerId = e.target.closest('.form-container').id;
  $(`#${containerId}`).addClass('hide');
  utils.printToDom(`${containerId}`, '');
};

const scheduleStaffMemberEvent = (e) => {
  const staffId = e.target.closest('.card').id;
  scheduleStaffForm(staffId);
};

const staffEvents = () => {
  $('body').on('click', '.edit-staff', editStaffEvent);
  $('body').on('click', '#submit-staff-changes', modifyStaff);
  $('body').on('click', '.delete-staff', removeStaff);
  $('body').on('click', '#new-staff-btn', showStaffForm);
  $('body').on('click', '#submit-new-staff', makeNewStaff);
  $('body').on('click', '#close-form-button', closeStaffForm);
  $('body').on('click', '.schedule-staff', scheduleStaffMemberEvent);
  $('body').on('click', '#submit-staff-schedule-day', showAvailableShiftsForSelectedDay);
};

export default {
  printStaffDashboard,
  makeNewStaff,
  newStaffForm,
  editStaffForm,
  editStaffEvent,
  modifyStaff,
  removeStaff,
  staffEvents,
};
