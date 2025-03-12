import { API_URL } from '@/constants/endpoint';
import { ApiResponse } from '@/types';

import apiClient from './api-client';

interface UploadResponse {
  fileUrl: string;
  uploadedAt: Date;
}

const uploadService = {
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('folder', 'images');

    const res: ApiResponse<UploadResponse> = await apiClient.post(`${API_URL.UPLOADS}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.result;
  },
};

export default uploadService;
