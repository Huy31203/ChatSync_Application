'use client';

import { useSearchParams } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

import { ServerContext } from '@/contexts/ServerContext';
import { useRouter } from '@/hooks/use-router';

interface ServerPageProps {
  params: { serverId: string };
}

const ServerPage = ({ params }: ServerPageProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const newMenber = searchParams.get('new') === 'true';

  const { server } = useContext(ServerContext);

  const generalChannel = server?.channels.find((channel) => channel.name === 'general');

  useEffect(() => {
    if (newMenber) {
      toast.success('You have joined the server');
    }
  }, [newMenber]);

  useEffect(() => {
    if (generalChannel) {
      router.push(`/servers/${params.serverId}/channels/${generalChannel?.id}`);
    }
  }, [generalChannel]);

  return null;
};

export default ServerPage;
