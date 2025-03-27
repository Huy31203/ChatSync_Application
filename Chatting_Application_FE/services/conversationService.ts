import { API_URL } from '@/constants/endpoint';
import { ApiResponse, IConversation } from '@/types';

import apiClient from './apiClient';

export const conversationService = {
  async getConversationByServerIdAndReiceiverId(
    serverId: string,
    receiverId: string
  ): Promise<ApiResponse<IConversation>> {
    return await apiClient.get(`${API_URL.SERVERS}/${serverId}/conversations/${receiverId}`);
  },

  async createConversation(serverId: string, data: Partial<IConversation>): Promise<ApiResponse<IConversation>> {
    return await apiClient.post(`${API_URL.SERVERS}/${serverId}/conversations`, data);
  },
};
