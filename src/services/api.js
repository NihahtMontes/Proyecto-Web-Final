import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Apuntando a tu backend
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const roomAPI = {
  getAll: (params) => api.get('/rooms', { params }),
  getAvailable: (params) => api.get('/rooms/available', { params }),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
  updateStatus: (id, status) => api.patch(`/rooms/${id}/status`, { status }),
};

export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/me'),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
  getAll: (params) => api.get('/bookings/all', { params }),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  createReview: (id, data) => api.post(`/bookings/${id}/review`, data),
};

export const cleaningAPI = {
  getMyTasks: () => api.get('/cleaning/me'),
  getAll: (params) => api.get('/cleaning/all', { params }),
  assign: (data) => api.post('/cleaning/assign', data),
  start: (id) => api.patch(`/cleaning/${id}/start`),
  complete: (id) => api.patch(`/cleaning/${id}/complete`),
};

export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  create: (data) => api.post('/users', data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const serviceAPI = {
  getAll: () => api.get('/services'),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary'),
  getOccupancy: () => api.get('/dashboard/occupancy'),
  getRevenue: () => api.get('/dashboard/revenue'),
  getTopRooms: () => api.get('/dashboard/top-rooms'),
};

export const paymentAPI = {
  generateQR: (data) => api.post('/payments/generate-qr', data),
  registerTigoMoney: (data) => api.post('/payments/tigo-money', data),
  uploadComprobante: (id, data) => api.post(`/payments/${id}/comprobante`, data),
  getMyPayments: () => api.get('/payments/me'),
  getAll: (params) => api.get('/payments', { params }),
  verify: (id) => api.post(`/payments/${id}/verify`),
};

export default api;