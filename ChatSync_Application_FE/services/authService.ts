import apiClient from './apiClient';

import { API_URL, BE_URL } from '@/constants/endpoint';
import { ApiResponse, IProfile } from '@/types';
import {
  ForgotPasswordCredentials,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
} from '@/types/auth';

export const authService = {
  login: async (data: LoginCredentials) => {
    await apiClient.post(`${API_URL.AUTH}/login`, data);
  },

  register: async (data: RegisterCredentials) => {
    await apiClient.post(`${API_URL.AUTH}/register`, data);
  },

  getCurrentProfile: async (): Promise<ApiResponse<IProfile>> => {
    return apiClient.get(`${API_URL.AUTH}/current-profile`);
  },

  changePassword: async (data: { oldPassword: string; newPassword: string }) => {
    await apiClient.post(`${API_URL.AUTH}/change-password`, data);
  },

  forgotPassword: async (data: ForgotPasswordCredentials) => {
    await apiClient.post(`${API_URL.AUTH}/forgot-password`, data);
  },

  resetPassword: async (data: ResetPasswordCredentials) => {
    await apiClient.post(`${API_URL.AUTH}/reset-password`, data);
  },

  refresh: async (): Promise<any> => {
    await apiClient.get(`${BE_URL}/${API_URL.AUTH}/refresh`);
  },

  logout: async () => {
    await apiClient.get(`${BE_URL}/${API_URL.AUTH}/logout`);
    window.location.href = '/login';
  },
};
