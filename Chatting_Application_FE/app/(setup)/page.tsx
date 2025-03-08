'use client';

import { useRouter } from 'next/navigation';

import InitialModal from '@/components/modals/initial-modal';
import { useAuth } from '@/hooks/use-auth';

const SetupPage = () => {
  const router = useRouter();
  const { profile, loading } = useAuth();

  console.log('profile', profile);

  if (!profile && !loading) {
    router.push('/login');
    return null;
  }

  return <InitialModal />;
};

export default SetupPage;
