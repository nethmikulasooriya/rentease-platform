import axios from 'axios';

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
  uploadDocument: (userId, data) => authAxios.post(`${USER_API}/users/${userId}/documents`, data),
  getDocuments: (userId) => authAxios.get(`${USER_API}/users/${userId}/documents`),
  getAllUsers: () => authAxios.get(`${USER_API}/users/all`),
  updateUserStatus: (id, status) => authAxios.put(`${USER_API}/users/${id}/status`, { status }),
  getPendingDocuments: () => authAxios.get(`${USER_API}/admin/documents`),
  approveDocument: (id, data) => authAxios.put(`${USER_API}/admin/documents/${id}/approve`, data),
  rejectDocument: (id, data) => authAxios.put(`${USER_API}/admin/documents/${id}/reject`, data)
};

// CATALOG API
export const catalogApi = {
  search: (params) => publicAxios.get(`${CATALOG_API}/vehicles/search`, { params }),
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
  getOwnerVehicles: (ownerId) => authAxios.get(`${CATALOG_API}/vehicles/owner/${ownerId}`)
};

// BOOKING API
export const bookingApi = {
  create: (data) => authAxios.post(`${BOOKING_API}/bookings`, data),
  getById: (id) => authAxios.get(`${BOOKING_API}/bookings/${id}`),
  getByCustomer: (customerId) => authAxios.get(`${BOOKING_API}/bookings/customer/${customerId}`),
  getByOwner: (ownerId) => authAxios.get(`${BOOKING_API}/bookings/owner/${ownerId}`),
  getAll: () => authAxios.get(`${BOOKING_API}/bookings`),
  approve: (id) => authAxios.put(`${BOOKING_API}/bookings/${id}/approve`),
  reject: (id, reason) => authAxios.put(`${BOOKING_API}/bookings/${id}/reject`, { reason }),
  cancel: (id) => authAxios.put(`${BOOKING_API}/bookings/${id}/cancel`),
  complete: (id, data) => authAxios.put(`${BOOKING_API}/bookings/${id}/complete`, data),
  raiseDispute: (id, data) => authAxios.post(`${BOOKING_API}/bookings/${id}/dispute`, data),
  resolveDispute: (disputeId, data) => authAxios.put(`${BOOKING_API}/bookings/disputes/${disputeId}/resolve`, data),
  getOpenDisputes: () => authAxios.get(`${BOOKING_API}/bookings/disputes/open`)
};

// PAYMENT API
export const paymentApi = {
  holdDeposit: (data) => authAxios.post(`${PAYMENT_API}/payments/deposit/hold`, data),
  releaseDeposit: (depositId, data) => authAxios.put(`${PAYMENT_API}/payments/deposit/${depositId}/release`, data),
  createPayout: (data) => authAxios.post(`${PAYMENT_API}/payments/payout`, data),
  processPayout: (payoutId) => authAxios.put(`${PAYMENT_API}/payments/payout/${payoutId}/process`, {}),
  getDashboardStats: () => authAxios.get(`${PAYMENT_API}/payments/dashboard`)
};
