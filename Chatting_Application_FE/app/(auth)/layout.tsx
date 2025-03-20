import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants';

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value;

  if (accessToken || refreshToken) {
    redirect('/');
  }

  return <section>{children}</section>;
};

export default AuthLayout;
