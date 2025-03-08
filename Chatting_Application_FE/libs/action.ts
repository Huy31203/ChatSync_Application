/* eslint-disable no-undef */
'use server';

import { cookies } from 'next/headers';

import { ApiResponse } from '@/types';

import { CustomOptions, handleRefreshToken } from './http';

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
  status: 422;
  payload: EntityErrorPayload;
  constructor({ status, payload }: { status: 422; payload: EntityErrorPayload }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options?: CustomOptions | undefined
): Promise<{ status: number; payload: ApiResponse<Response> }> => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }

  const cookieStore = cookies();

  const baseHeaders: { [key: string]: string } =
    body instanceof FormData
      ? {}
      : {
          'Content-Type': 'application/json',
        };

  const accessToken = cookieStore.get('accessToken')?.value;
  if (accessToken) {
    baseHeaders.Authorization = `Bearer ${accessToken}`;
  }

  const baseUrl = options?.baseUrl === undefined ? process.env.NEXT_PUBLIC_API_URL : process.env.NEXT_PUBLIC_API_URL;

  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;

  let res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  });

  let payload: any = null;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      payload = await res.json();
    } catch (error) {
      console.error('Error parsing JSON:', error);
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
      const refreshData = await handleRefreshToken(
        cookieStore.get(KEY_LOCALSTORAGE.ACCESS_TOKEN)?.value,
        cookieStore.get(KEY_LOCALSTORAGE.REFRESH_TOKEN)?.value
      );

      if (refreshData) {
        baseHeaders.Authorization = `Bearer ${refreshData.token}`;

        (await cookies()).set(KEY_LOCALSTORAGE.ACCESS_TOKEN, refreshData.token, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/',
        });

        res = await fetch(fullUrl, {
          ...options,
          headers: {
            ...baseHeaders,
            ...options?.headers,
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
  }

  return data;
};
