'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

interface ServerPageProps {
  params: { serverId: string };
}

const ServerPage = ({ params }: ServerPageProps) => {
  const searchParams = useSearchParams();

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

  return null;
};

export default ServerPage;
