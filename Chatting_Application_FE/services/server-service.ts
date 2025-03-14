import { API_URL } from '@/constants/endpoint';
import { ApiResponse, ApiResponseWithPagination, IServer } from '@/types';

import apiClient from './api-client';

export const serverService = {
  async getAllServers(): Promise<ApiResponseWithPagination<IServer[]>> {
    return await apiClient.get(`${API_URL.SERVERS}`);
  },

  async getAllServersByProfile(): Promise<ApiResponseWithPagination<IServer[]>> {
    return await apiClient.get(`${API_URL.SERVERS}/current-profile`);
  },

  async createServer(data: Partial<IServer>): Promise<ApiResponse<IServer>> {
    return await apiClient.post(`${API_URL.SERVERS}`, data);
  },

  async updateServer(id: string, data: Partial<IServer>): Promise<ApiResponse<IServer>> {
    return await apiClient.put(`${API_URL.SERVERS}/${id}`, data);
  },

  async deleteServer(id: string): Promise<void> {
    return await apiClient.delete(`${API_URL.SERVERS}/${id}`);
  },
};
