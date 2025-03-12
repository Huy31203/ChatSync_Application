import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

import { ACCESS_TOKEN } from '@/constants';

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

  if (accessToken) {
    redirect('/');
  }

  return <section>{children}</section>;
};

export default AuthLayout;
