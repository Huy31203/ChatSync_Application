import React from 'react';

import { ServerSidebar } from '@/components/server/ServerSidebar';
import { GlobalMobileToggle } from '@/components/toggles/GlobalMobileToggle';
import { API_URL } from '@/constants/endpoint';
import { ServerProvider } from '@/contexts/ServerContext';
import http from '@/lib/http';
import { ApiResponse, IServer } from '@/types';

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>;
}) => {
  const { serverId } = await params;

  const res = await http.get<IServer>(`${API_URL.SERVERS}/${serverId}`);
  const payload = res.payload as ApiResponse<IServer>;

  console.log('Server:', payload.result);

  return (
    <ServerProvider server={payload.result}>
      <div className="h-full">
        <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
          <ServerSidebar />
        </div>
        <GlobalMobileToggle />
        <main className="h-full md:pl-60">{children}</main>
      </div>
    </ServerProvider>
  );
};

export default ServerIdLayout;
