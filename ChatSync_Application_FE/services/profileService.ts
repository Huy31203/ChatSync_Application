import { API_URL } from '@/constants/endpoint';
import { ApiResponse, IProfile } from '@/types';

import apiClient from './apiClient';

export const profileService = {
  async updateProfile(profileId: string, data: Partial<IProfile>): Promise<ApiResponse<IProfile>> {
    return await apiClient.patch(`${API_URL.PROFILE}/${profileId}`, data);
  },
};
