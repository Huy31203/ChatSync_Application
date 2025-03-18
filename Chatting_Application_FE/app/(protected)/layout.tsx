import React from 'react';

import { NavigationSidebar } from '@/components/navigation/navigation-sidebar';
import { API_URL } from '@/constants/endpoint';
import { ServersProvider } from '@/contexts/ServersContext';
import http from '@/libs/http';
import { ApiResponseWithPagination, IServer } from '@/types';

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const res = await http.get<IServer[]>(`${API_URL.SERVERS}/current-profile`);
  const payload = res.payload as ApiResponseWithPagination<IServer[]>;

  const servers = payload.result?.data ?? [];

  return (
    <ServersProvider servers={servers}>
      <div className="h-full">
        <div
          className="hidden md:flex h-full w-[72px]
			z-30 flex-col fixed inset-y-0"
        >
          <NavigationSidebar servers={servers} />
        </div>
        <main className="md:pl-[72px] h-full">{children}</main>
      </div>
    </ServersProvider>
  );
};

export default ProtectedLayout;
