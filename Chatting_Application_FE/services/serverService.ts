import { API_URL } from '@/constants/endpoint';
import { ApiResponse, ApiResponseWithPagination, IServer } from '@/types';

import apiClient from './apiClient';

export const serverService = {
  // async getAllServers(): Promise<ApiResponseWithPagination<IServer[]>> {
  //   return await apiClient.get(`${API_URL.SERVERS}`);
  // },

  async countAllServers(): Promise<ApiResponse<number>> {
    return await apiClient.get(`${API_URL.SERVERS}/count`);
  },

  async getAllServersByProfile(): Promise<ApiResponseWithPagination<IServer[]>> {
    return await apiClient.get(`${API_URL.SERVERS}/current-profile`);
  },

  async getServerByServerId(serverId: string): Promise<ApiResponse<IServer>> {
    return await apiClient.get(`${API_URL.SERVERS}/${serverId}`);
  },

  async createServer(data: Partial<IServer>): Promise<ApiResponse<IServer>> {
    return await apiClient.post(`${API_URL.SERVERS}`, data);
  },

  async updateServer(id: string, data: Partial<IServer>): Promise<ApiResponse<IServer>> {
    return await apiClient.patch(`${API_URL.SERVERS}/${id}`, data);
  },

  async updateInviteCode(id: string): Promise<ApiResponse<IServer>> {
    return await apiClient.patch(`${API_URL.SERVERS}/${id}/invite-code`);
  },

  async joinServerByInviteCode(inviteCode: string): Promise<ApiResponse<IServer>> {
    return await apiClient.patch(`${API_URL.SERVERS}/join/${inviteCode}`);
  },

  async deleteServer(id: string): Promise<void> {
    return await apiClient.delete(`${API_URL.SERVERS}/${id}`);
  },
};
