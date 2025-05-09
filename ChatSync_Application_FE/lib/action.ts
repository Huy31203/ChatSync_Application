/* eslint-disable no-undef */
'use server';

import { cookies, headers } from 'next/headers';

import http, { CustomOptions } from './http';

import { ACCESS_TOKEN, PROFILE } from '@/constants';
import { BE_URL } from '@/constants/endpoint';
import { ApiResponse, ApiResponseWithPagination, IProfile } from '@/types';

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({ status, payload }: { status: number; payload: any }) {
    super('Http Error');
    this.status = status;
    this.payload = payload;
  }
}

class EntityError extends HttpError {
  status = 422;
  payload: EntityErrorPayload = { message: '', errors: [] };
  constructor({ status, payload }: { status: 422; payload: EntityErrorPayload }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  options?: CustomOptions | undefined
): Promise<{ status: number; payload: ApiResponse<Response> | ApiResponseWithPagination<Response> }> => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }

  const baseHeaders: { [key: string]: string } = body instanceof FormData ? {} : { 'Content-Type': 'application/json' };

  const baseUrl = options?.baseUrl === undefined ? `${DOCKER_BE_URL}/api` : options?.baseUrl;

  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value ?? '';

  let res;
  try {
    res = await fetch(fullUrl, {
      ...options,
      headers: {
        ...baseHeaders,
        ...options?.headers,
        Authorization: `Bearer ${accessToken}`,
      } as any,
      body,
      method,
    });
  } catch (error: unknown) {
    console.error('Network error during fetch:', error);
    // Return a meaningful error that can be handled by the UI
    throw new HttpError({
      status: 503,
      payload: {
        message: 'Unable to connect to the server. Please check your connection or try again later.',
        originalError: (error as Error).message,
      },
    });
  }

  let payload: any = null;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      payload = await res.json();
    } catch (error) {
      console.error('Error parsing JSON:', error);
      console.error('Response text:', await res.text());
      throw new Error('Failed to parse JSON response');
    }
  }

  let data = {
    status: res.status,
    payload,
  };

  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      const headersStore = await headers();

      const cookie = headersStore.get('Set-Cookie');
      const accessTokenMatch = cookie?.match(/accessToken=([^;]+)/);
      const accessToken = accessTokenMatch ? accessTokenMatch[1] : null;

      res = await fetch(fullUrl, {
        ...options,
        headers: {
          ...baseHeaders,
          ...options?.headers,
          Authorization: `Bearer ${accessToken}`,
        } as any,
        body,
        method,
      });
      payload = await res.json();
      data = {
        status: res.status,
        payload,
      };
    }
  }

  return data;
};

export const getProfileFromCookie = async (): Promise<IProfile> => {
  const cookieStore = await cookies();
  const profileCookie = cookieStore.get(PROFILE)?.value;

  if (profileCookie === undefined || profileCookie.length === 0) {
    const res = await http.get('/auth/current-profile');
    const payload = res.payload as ApiResponse<IProfile>;
    const profile = payload.result;

    return profile;
  }

  const decodedProfile = profileCookie ? atob(profileCookie) : '';
  const profile = JSON.parse(decodedProfile);

  return profile;
};

export const getNewToken = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  return accessToken;
};

export default request;
