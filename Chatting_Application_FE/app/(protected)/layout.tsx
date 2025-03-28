import { cookies } from 'next/headers';
import React from 'react';

import { NavigationSidebar } from '@/components/navigation/NavigationSidebar';
import { API_URL } from '@/constants/endpoint';
import { CookieProvider } from '@/contexts/CookieContext';
import { ServersProvider } from '@/contexts/ServersContext';
import http from '@/lib/http';
import { ApiResponseWithPagination, IServer } from '@/types';

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const res = await http.get<IServer[]>(`${API_URL.SERVERS}/current-profile`);
  const payload = res.payload as ApiResponseWithPagination<IServer[]>;

  const servers = payload.result?.data ?? [];

  console.log('Servers:', servers);

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  return (
    <ServersProvider servers={servers}>
      <div className="h-full">
        <div
          className="hidden md:flex h-full w-[72px]
			z-30 flex-col fixed inset-y-0"
        >
          <NavigationSidebar />
        </div>
        <main className="md:pl-[72px] h-full">
          <CookieProvider cookie={accessToken}>{children}</CookieProvider>
        </main>
      </div>
    </ServersProvider>
  );
};

export default ProtectedLayout;
