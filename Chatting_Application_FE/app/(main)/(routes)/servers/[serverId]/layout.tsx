import React from 'react';

import { ServerSidebar } from '@/components/server/server-sidebar';
import { API_URL } from '@/constants/endpoint';
import { ServerProvider } from '@/contexts/ServerContext';
import http from '@/libs/http';
import { ApiResponse, IServer } from '@/types';

const ServerIdLayout = async ({ children, params }: { children: React.ReactNode; params: { serverId: string } }) => {
  const res = await http.get<IServer>(`${API_URL.SERVERS}/${params.serverId}`);
  const payload = res.payload as ApiResponse<IServer>;

  return (
    <ServerProvider server={payload.result}>
      <div className="h-full">
        <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
          <ServerSidebar server={payload.result} />
        </div>
        <main className="h-full md:pl-60">{children}</main>
      </div>
    </ServerProvider>
  );
};

export default ServerIdLayout;
