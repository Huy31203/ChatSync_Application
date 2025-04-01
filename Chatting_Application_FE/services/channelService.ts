import { API_URL } from '@/constants/endpoint';
import { ApiResponse, ApiResponseWithPagination, IChannel, IMessage } from '@/types';

import apiClient from './apiClient';

export const channelService = {
  async getAllChannels(serverId: string): Promise<ApiResponseWithPagination<IChannel[]>> {
    return await apiClient.get(`${API_URL.SERVERS}/${serverId}/channels`);
  },

  async getChannelByChannelId(channelId: string): Promise<ApiResponse<IChannel>> {
    return await apiClient.get(`${API_URL.CHANNELS}/${channelId}`);
  },

  async getAllMessagesByChannelId(
    serverId: string,
    channelId: string,
    page = 1,
    size = 20,
    sort = 'createdAt,desc'
  ): Promise<ApiResponseWithPagination<IMessage[]>> {
    return await apiClient.get(
      `${API_URL.SERVERS}/${serverId}/channels/${channelId}/messages?page=${page}&size=${size}&sort=${sort}`
    );
  },

  async createChannel(serverId: string, data: Partial<IChannel>): Promise<ApiResponse<IChannel>> {
    return await apiClient.post(`${API_URL.SERVERS}/${serverId}/channels`, data);
  },

  async updateChannel(serverId: string, channelId: string, data: Partial<IChannel>): Promise<ApiResponse<IChannel>> {
    return await apiClient.patch(`${API_URL.SERVERS}/${serverId}/channels/${channelId}`, data);
  },

  async updateMessageInChannel(
    serverId: string,
    channelId: string,
    messageId: string,
    data: Partial<IMessage>
  ): Promise<ApiResponse<IMessage>> {
    return await apiClient.patch(`${API_URL.SERVERS}/${serverId}/channels/${channelId}/messages/${messageId}`, data);
  },

  async deleteChannel(serverId: string, channelId: string): Promise<void> {
    return await apiClient.delete(`${API_URL.SERVERS}/${serverId}/channels/${channelId}`);
  },

  async deleteMessageInChannel(serverId: string, channelId: string, messageId: string): Promise<ApiResponse<void>> {
    return await apiClient.delete(`${API_URL.SERVERS}/${serverId}/channels/${channelId}/messages/${messageId}`);
  },
};
