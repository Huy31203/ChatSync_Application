/* eslint-disable no-undef */

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
  put<Response>(url: string, body?: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('PUT', url, {
      ...options,
      body,
    });
  },
  patch<Response>(url: string, body?: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('PATCH', url, {
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

export default http;
