import { API_URL } from '@/constants/endpoint';
import { ApiResponse, IProfile } from '@/types';
import { LoginCredentials } from '@/types/auth';
import { BE_URL } from '@/utils';

import apiClient from './api-client';

export const authService = {
  login: async (data: LoginCredentials) => {
    await apiClient.post(`${API_URL.AUTH}/login`, data);
  },

  getCurrentProfile: async (): Promise<ApiResponse<IProfile>> => {
    return apiClient.get(`${API_URL.AUTH}/current-profile`);
  },

  refresh: async () => {
    await apiClient.get(`${BE_URL}/${API_URL.AUTH}/refresh`);
  },

  logout: async () => {
    await apiClient.get(`${BE_URL}/${API_URL.AUTH}/logout`);
  },
};
