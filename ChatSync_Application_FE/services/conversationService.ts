import { API_URL } from '@/constants/endpoint';
import { ApiResponse, ApiResponseWithPagination, IConversation, IDirectMessage } from '@/types';

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

  async getAllMessagesByConversationId(
    serverId: string,
    conversationId: string,
    page = 1,
    size = 20,
    sort = 'createdAt,desc'
  ): Promise<ApiResponseWithPagination<IDirectMessage[]>> {
    return await apiClient.get(
      `${API_URL.SERVERS}/${serverId}/conversations/${conversationId}/messages?page=${page}&size=${size}&sort=${sort}`
    );
  },

  async updateMessageInConversation(
    serverId: string,
    conversationId: string,
    messageId: string,
    data: Partial<IDirectMessage>
  ): Promise<ApiResponse<IDirectMessage>> {
    return await apiClient.patch(
      `${API_URL.SERVERS}/${serverId}/conversations/${conversationId}/messages/${messageId}`,
      data
    );
  },

  async deleteMessageInConversation(
    serverId: string,
    conversationId: string,
    messageId: string
  ): Promise<ApiResponse<void>> {
    return await apiClient.delete(
      `${API_URL.SERVERS}/${serverId}/conversations/${conversationId}/messages/${messageId}`
    );
  },
};
