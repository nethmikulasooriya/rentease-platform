import axios from 'axios';

const GATEWAY = 'http://localhost:8080';
const USER_API = 'http://localhost:8081/api/v1';
const CATALOG_API = 'http://localhost:8082/api/v1';
const BOOKING_API = 'http://localhost:8083/api/v1';
const PAYMENT_API = 'http://localhost:8084/api/v1';

export const publicAxios = axios.create();

export const authAxios = axios.create();
authAxios.interceptors.request.use(config => {
  const token = localStorage.getItem('rentease_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH API
export const authApi = {
  register: (data) => publicAxios.post(`${USER_API}/auth/register`, data),
  login: (data) => publicAxios.post(`${USER_API}/auth/login`, data),
  refresh: () => authAxios.post(`${USER_API}/auth/refresh`),
};

// USER API
export const userApi = {
  getProfile: () => authAxios.get(`${USER_API}/users/profile`),
  updateProfile: (data) => authAxios.put(`${USER_API}/users/profile`, data),
  uploadDocument: (data) => authAxios.post(`${USER_API}/users/documents`, data),
  getDocuments: () => authAxios.get(`${USER_API}/users/documents`),
  getAllUsers: () => authAxios.get(`${USER_API}/users`),
  updateUserStatus: (id, status) => authAxios.put(`${USER_API}/users/${id}/status`, { status }),
  getPendingDocuments: () => authAxios.get(`${USER_API}/users/documents/pending`),
  approveDocument: (id) => authAxios.post(`${USER_API}/users/documents/${id}/approve`),
  rejectDocument: (id, note) => authAxios.post(`${USER_API}/users/documents/${id}/reject`, { note })
};

// CATALOG API
export const catalogApi = {
  searchVehicles: (params) => publicAxios.get(`${CATALOG_API}/vehicles/search`, { params }),
  getVehicle: (id) => publicAxios.get(`${CATALOG_API}/vehicles/${id}`),
  getSimilar: (id) => publicAxios.get(`${CATALOG_API}/vehicles/${id}/similar`),
  getReviews: (id) => publicAxios.get(`${CATALOG_API}/vehicles/${id}/reviews`),
  addReview: (id, data) => authAxios.post(`${CATALOG_API}/vehicles/${id}/reviews`, data),
  createVehicle: (data) => authAxios.post(`${CATALOG_API}/vehicles`, data),
  updateVehicle: (id, data) => authAxios.put(`${CATALOG_API}/vehicles/${id}`, data),
  deleteVehicle: (id) => authAxios.delete(`${CATALOG_API}/vehicles/${id}`),
  addImage: (id, data) => authAxios.post(`${CATALOG_API}/vehicles/${id}/images`, data),
  blockDates: (id, data) => authAxios.post(`${CATALOG_API}/vehicles/${id}/block-dates`, data),
  getOwnerVehicles: () => authAxios.get(`${CATALOG_API}/vehicles/owner`)
};

// BOOKING API
export const bookingApi = {
  create: (data) => authAxios.post(`${BOOKING_API}/bookings`, data),
  getById: (id) => authAxios.get(`${BOOKING_API}/bookings/${id}`),
  getByCustomer: () => authAxios.get(`${BOOKING_API}/bookings/customer`),
  getByOwner: () => authAxios.get(`${BOOKING_API}/bookings/owner`),
  getAll: () => authAxios.get(`${BOOKING_API}/bookings`),
  approve: (id) => authAxios.post(`${BOOKING_API}/bookings/${id}/approve`),
  reject: (id) => authAxios.post(`${BOOKING_API}/bookings/${id}/reject`),
  cancel: (id) => authAxios.post(`${BOOKING_API}/bookings/${id}/cancel`),
  paymentReceived: (id) => authAxios.post(`${BOOKING_API}/bookings/${id}/payment`),
  logOdometer: (id, data) => authAxios.post(`${BOOKING_API}/bookings/${id}/odometer`, data),
  getOdometer: (id) => authAxios.get(`${BOOKING_API}/bookings/${id}/odometer`),
  complete: (id) => authAxios.post(`${BOOKING_API}/bookings/${id}/complete`),
  dispute: (id, data) => authAxios.post(`${BOOKING_API}/bookings/${id}/dispute`, data),
  getDisputes: () => authAxios.get(`${BOOKING_API}/disputes`),
  resolveDispute: (id, data) => authAxios.post(`${BOOKING_API}/disputes/${id}/resolve`, data)
};

// PAYMENT API
export const paymentApi = {
  initiate: (data) => authAxios.post(`${PAYMENT_API}/payments/initiate`, data),
  holdDeposit: (id) => authAxios.post(`${PAYMENT_API}/payments/${id}/hold`),
  releaseDeposit: (id) => authAxios.post(`${PAYMENT_API}/payments/${id}/release`),
  createPayout: (data) => authAxios.post(`${PAYMENT_API}/payouts`, data),
  processPayout: (id) => authAxios.post(`${PAYMENT_API}/payouts/${id}/process`),
  getPendingPayouts: () => authAxios.get(`${PAYMENT_API}/payouts/pending`),
  getOwnerPayouts: () => authAxios.get(`${PAYMENT_API}/payouts/owner`),
  getBookingTransactions: (id) => authAxios.get(`${PAYMENT_API}/transactions/booking/${id}`),
  getDashboard: () => authAxios.get(`${PAYMENT_API}/dashboard`)
};
