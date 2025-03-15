'use client';

import { useRouter } from 'next/navigation';
import { useContext } from 'react';

import { ServerContext } from '@/contexts/ServerContext';

interface ServerPageProps {
  params: { serverId: string };
}

const ServerPage = ({ params }: ServerPageProps) => {
  const router = useRouter();

  const { server } = useContext(ServerContext);

  const initialChannel = server?.channels[0];
  if (initialChannel?.name !== 'general') return null;
  return router.push(`/servers/${params.serverId}/channels/${initialChannel?.id}`);
};

export default ServerPage;
