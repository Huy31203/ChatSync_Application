import { API_URL } from '@/constants/endpoint';
import { ApiResponse, ApiResponseWithPagination, IMember, IServer } from '@/types';

import apiClient from './apiClient';

export const memberService = {
  async getAllMembers(serverId: string): Promise<ApiResponseWithPagination<IMember[]>> {
    return await apiClient.get(`${API_URL.SERVERS}/${serverId}/members`);
  },

  async getMemberByMemberId(memberId: string): Promise<ApiResponse<IMember>> {
    return await apiClient.get(`${API_URL.CHANNELS}/${memberId}`);
  },

  async getCurrentMember(serverId: string): Promise<ApiResponse<IMember>> {
    return await apiClient.get(`${API_URL.SERVERS}/${serverId}/members/current-profile`);
  },

  async createMember(serverId: string, data: Partial<IMember>): Promise<ApiResponse<IMember>> {
    return await apiClient.post(`${API_URL.SERVERS}/${serverId}/members`, data);
  },

  async updateMember(serverId: string, memberId: string, data: Partial<IMember>): Promise<ApiResponse<IServer>> {
    return await apiClient.patch(`${API_URL.SERVERS}/${serverId}/members/${memberId}`, data);
  },

  async deleteMember(serverId: string, memberId: string): Promise<ApiResponse<IServer>> {
    return await apiClient.delete(`${API_URL.SERVERS}/${serverId}/members/${memberId}`);
  },
};
