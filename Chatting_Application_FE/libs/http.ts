/* eslint-disable no-undef */
import { redirect } from 'next/navigation';

import request from './action';

export type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string;
};

const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('GET', url, {
      ...options,
    });
  },
  post<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('POST', url, {
      ...options,
      body,
    });
  },
  put<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('PUT', url, {
      ...options,
      body,
    });
  },
  delete<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('DELETE', url, {
      ...options,
    });
  },
};

export const handleRefreshToken = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error(`Token refresh failed with status: ${res.status}`);
      console.error(`Response text: ${await res.text()}`);
      throw new Error('Failed to refresh token');
    }
    return;
  } catch (error) {
    console.error('Error refreshing token:', error);
    redirect('/login');
  }
};

export default http;
