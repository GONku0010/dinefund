import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Restaurant API
export const restaurantAPI = {
  create: (data) => api.post('/restaurants', data),
  getAll: (params) => api.get('/restaurants', { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  getMyRestaurants: () => api.get('/restaurants/my/restaurants'),
};

// Campaign API
export const campaignAPI = {
  create: (data) => api.post('/campaigns', data),
  getAll: (params) => api.get('/campaigns', { params }),
  getById: (id) => api.get(`/campaigns/${id}`),
  update: (id, data) => api.put(`/campaigns/${id}`, data),
  getInvestments: (id) => api.get(`/campaigns/${id}/investments`),
};

// Investment API
export const investmentAPI = {
  create: (data) => api.post('/investments', data),
  getMyInvestments: () => api.get('/investments/my-investments'),
  getStats: () => api.get('/investments/stats'),
};

export default api;
