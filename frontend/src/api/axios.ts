import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8084/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const tenantId = localStorage.getItem('tenantId');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const existingTenantHeader = config.headers['X-Tenant-ID'];
    
    const isAuthEndpoint = config.url?.includes('/auth/login');

    if (!existingTenantHeader && !isAuthEndpoint) {
      if (tenantId && tenantId !== 'undefined' && tenantId !== 'null') {
        config.headers['X-Tenant-ID'] = tenantId;
      } else {
        config.headers['X-Tenant-ID'] = 'public';
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('tenantId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
