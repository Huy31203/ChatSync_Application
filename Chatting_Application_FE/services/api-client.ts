import axios from 'axios';

import { BE_URL, logError } from '@/utils';

import { authService } from './auth-service';

const apiClient = axios.create({
  baseURL: BE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a response interceptor
apiClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error.response) {
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await authService.refresh();
          return apiClient(originalRequest);
        } catch (error) {
          logError(error);
          await authService.logout();
          window.location.href = '/login';
        }
      } else if (error.response.status === 401) {
        await authService.logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
