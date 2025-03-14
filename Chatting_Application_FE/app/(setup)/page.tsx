'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import InitialModal from '@/components/modals/initial-modal';
import { useAuth } from '@/hooks/use-auth';
import { serverService } from '@/services/server-service';
import { IServer } from '@/types';

const SetupPage = () => {
  const router = useRouter();
  const { profile, loading } = useAuth();
  const [servers, setServers] = useState<IServer[]>([]);

  const fetchServer = async () => {
    const res = await serverService.getAllServersByProfile();
    setServers(res.result.data);
  };

  useEffect(() => {
    if (profile) {
      fetchServer();
    }
  }, [profile]);

  if (!profile && !loading) {
    router.push('/login');
    return null;
  } else if (servers.length > 0) {
    // router.push(`/servers/${servers[0].id}`);
    return null;
  }

  return <InitialModal />;
};

export default SetupPage;
