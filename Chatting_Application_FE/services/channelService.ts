import { API_URL } from '@/constants/endpoint';
import { ApiResponse, ApiResponseWithPagination, IChannel } from '@/types';

import apiClient from './apiClient';

export const channelService = {
  async getAllChannels(serverId: string): Promise<ApiResponseWithPagination<IChannel[]>> {
    return await apiClient.get(`${API_URL.SERVERS}/${serverId}/channels`);
  },

  async getChannelByChannelId(channelId: string): Promise<ApiResponse<IChannel>> {
    return await apiClient.get(`${API_URL.CHANNELS}/${channelId}`);
  },

  async createChannel(serverId: string, data: Partial<IChannel>): Promise<ApiResponse<IChannel>> {
    return await apiClient.post(`${API_URL.SERVERS}/${serverId}/channels`, data);
  },

  async updateChannel(serverId: string, channelId: string, data: Partial<IChannel>): Promise<ApiResponse<IChannel>> {
    return await apiClient.patch(`${API_URL.SERVERS}/${serverId}/channels/${channelId}`, data);
  },

  async deleteChannel(serverId: string, channelId: string): Promise<void> {
    return await apiClient.delete(`${API_URL.SERVERS}/${serverId}/channels/${channelId}`);
  },
};
