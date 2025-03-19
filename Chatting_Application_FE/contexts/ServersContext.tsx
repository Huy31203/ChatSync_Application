/* eslint-disable no-unused-vars */
'use client';

import React, { createContext, useEffect, useState } from 'react';

import { serverService } from '@/services/serverService';
import { IServer } from '@/types';
import logError from '@/utils';

interface ServersContextType {
  servers: IServer[];
  loading: boolean;
  setServers: React.Dispatch<React.SetStateAction<IServer[]>>;
}

const ServersContext = createContext<ServersContextType>({
  servers: [],
  loading: true,
  setServers: () => {},
});

const ServersProvider = ({ children, servers: initialServers }: { children: React.ReactNode; servers: IServer[] }) => {
  const [data, setData] = useState<IServer[]>(initialServers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServer() {
      try {
        const res = await serverService.getAllServersByProfile();
        setData(res.result.data);
      } catch (error) {
        logError(error);
      }
    }

    if (initialServers && initialServers.length > 0) {
      setData(initialServers);
    } else {
      fetchServer();
    }

    setLoading(false);
  }, [initialServers]);

  return (
    <ServersContext.Provider
      value={{
        servers: data,
        loading,
        setServers: setData,
      }}
    >
      {children}
    </ServersContext.Provider>
  );
};

export { ServersContext, ServersProvider };
