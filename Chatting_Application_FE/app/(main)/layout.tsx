import React from 'react';

import { NavigationSidebar } from '@/components/navigation/navigation-sidebar';
import { API_URL } from '@/constants/endpoint';
import http from '@/libs/http';
import { ApiResponseWithPagination, IServer } from '@/types';

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const res = await http.get<IServer[]>(`${API_URL.SERVERS}`);
  const payload = res.payload as ApiResponseWithPagination<IServer[]>;

  return (
    <div className="h-full">
      <div
        className="hidden md:flex h-full w-[72px]
			z-30 flex-col fixed inset-y-0"
      >
        <NavigationSidebar servers={payload.result.data} />
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </div>
  );
};

export default MainLayout;
