import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API calls
export const authAPI = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  getMyUrls: () => api.get('/auth/my-urls'),
};

// URL Mapping API calls
export const urlAPI = {
  shortenUrl: (originalUrl) =>
    api.post('/urls/shorten', { originalUrl }),
  getAnalytics: (shortUrl, startDate, endDate) =>
    api.get(`/urls/analytics/${shortUrl}`, {
      params: { startDate, endDate },
    }),
  getTotalClicks: (startDate, endDate) =>
    api.get('/urls/totalClicks', {
      params: { startDate, endDate },
    }),
};

// Redirect API
export const redirectAPI = {
  redirect: (shortUrl) =>
    api.get(`/redirect/${shortUrl}`),
};

export default api;
