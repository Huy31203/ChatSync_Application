'use client';

import { useSearchParams } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

import { ServerContext } from '@/contexts/ServerContext';

interface ServerPageProps {
  params: { serverId: string };
}

const ServerPage = ({ params }: ServerPageProps) => {
  const searchParams = useSearchParams();

  const newMenber = searchParams.get('new') === 'true';

  useEffect(() => {
    if (newMenber) {
      toast.success('You have joined the server');
    }
  }, [newMenber]);

  return null;
};

export default ServerPage;
