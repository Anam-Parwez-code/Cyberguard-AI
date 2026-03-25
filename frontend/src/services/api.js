import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

// Request mein token add karne ke liye (Security)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const loginAPI = async (email, password) => {
  const response = await API.post('/auth/login', { email, password });
  return response.data;
};

// Ye function missing tha:
export const fetchDashboardData = async () => {
  const response = await API.get('/dashboard/stats');
  return response.data;
};

export default API;
