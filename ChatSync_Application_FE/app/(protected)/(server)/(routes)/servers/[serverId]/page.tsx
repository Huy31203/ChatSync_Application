'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

import { ServerContext } from '@/contexts/ServerContext';

const ServerPage = () => {
  const searchParams = useSearchParams();
  const { server, loading } = useContext(ServerContext);
  const router = useRouter();

  const newMenber = searchParams.get('new') === 'true';

  useEffect(() => {
    if (newMenber) {
      toast.success('You have joined the server');

      // remove the query param from the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('new');
      window.history.replaceState({}, '', url.toString());
    }
  }, [newMenber]);

  useEffect(() => {
    if (!loading && server) {
      router.push(`/servers/${server.id}/channels/${server.channels[0]?.id}`);
    }
  }, [loading, server]);

  return null;
};

export default ServerPage;
