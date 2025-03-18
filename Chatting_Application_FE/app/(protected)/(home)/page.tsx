'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from '@/hooks/use-router';
import { serverService } from '@/services/server-service';
import { IServer } from '@/types';

const SetupPage = () => {
  const router = useRouter();
  const { profile, loading } = useAuth();
  const [servers, setServers] = useState<IServer[]>([]);
  const [serversCount, setServersCount] = useState<number>(0);

  const fetchServerCount = async () => {
    const res = await serverService.countAllServers();

    setServersCount(res.result);
  };

  const fetchServer = async () => {
    const res = await serverService.getAllServersByProfile();

    setServers(res.result.data);
  };

  useEffect(() => {
    if (profile) {
      fetchServerCount();
      fetchServer();
    }
  }, [profile]);

  if (!profile && !loading) {
    router.push('/login');
    return null;
  }

  if (serversCount > 0 && servers.length === 0) {
    router.push('/');
    return null;
  }
};

export default SetupPage;
