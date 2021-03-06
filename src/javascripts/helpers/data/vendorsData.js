import axios from 'axios';
import apiKeys from '../apiKeys.json';

const baseUrl = apiKeys.firebaseKeys.databaseURL;

const getVendors = () => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/vendors.json`)
    .then((response) => {
      const vendorResponse = response.data;
      const vendors = [];

      if (vendorResponse) {
        Object.keys(vendorResponse).forEach((vendorId) => {
          vendorResponse[vendorId].id = vendorId;
          vendors.push(vendorResponse[vendorId]);
        });
      }

      resolve(vendors);
    })
    .catch((err) => reject(err));
});

const getSingleVendorByVendorId = (vendorId) => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/vendors/${vendorId}.json`)
    .then((response) => {
      const vendor = response.data;

      resolve(vendor);
    })
    .catch((err) => reject(err));
});

const getVendorIdByName = (vendorName) => new Promise((resolve, reject) => {
  getVendors()
    .then((response) => {
      const vendorByName = response.find((x) => x.name === vendorName);
      resolve(vendorByName.id);
    })
    .catch((err) => reject(err));
});

const openStaffedVendors = (vendorId) => axios.patch(`${baseUrl}/vendors/${vendorId}.json`, { isOpen: true });

const closeUnstaffedVendors = (vendorId) => axios.patch(`${baseUrl}/vendors/${vendorId}.json`, { isOpen: false });

const addVendor = (newVendor) => axios.post(`${baseUrl}/vendors.json`, newVendor);

const deleteVendor = (vendorId) => axios.delete(`${baseUrl}/vendors/${vendorId}.json`);

const updateVendor = (vendorId, modifiedVendor) => axios.put(`${baseUrl}/vendors/${vendorId}.json`, modifiedVendor);

export default {
  getVendors,
  getSingleVendorByVendorId,
  getVendorIdByName,
  addVendor,
  deleteVendor,
  updateVendor,
  closeUnstaffedVendors,
  openStaffedVendors,
};
