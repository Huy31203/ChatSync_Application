/* eslint-disable no-unused-vars */
'use client';

import { useParams } from 'next/navigation';
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';

import { serverService } from '@/services/serverService';
import { IServer } from '@/types';
import logError from '@/utils';

interface ServersContextType {
  server: IServer | null;
  loading: boolean;
  setServer: Dispatch<SetStateAction<IServer | null>>;
}

const ServerContext = createContext<ServersContextType>({
  server: {} as IServer | null,
  loading: true,
  setServer: () => {},
});

const ServerProvider = ({ children, server }: { children: ReactNode; server: IServer | null }) => {
  const [data, setData] = useState<IServer | null>(null);
  const params = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServer() {
      try {
        const res = await serverService.getServerByServerId(params?.serverId as string);

        setData(res.result);
      } catch (error) {
        logError(error);
      }
    }

    if (server) {
      setData(server);
    } else {
      fetchServer();
    }

    setLoading(false);
  }, [server, params?.serverId]);

  return (
    <ServerContext.Provider
      value={{
        server: data,
        setServer: setData,
        loading,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export { ServerContext, ServerProvider };
