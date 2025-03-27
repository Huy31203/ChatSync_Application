'use client';

import { useEffect } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from '@/hooks/useRouter';

const HomePage = () => {
  const router = useRouter();
  const { profile, loading } = useAuth();

  useEffect(() => {
    if (!profile && !loading) {
      router.push('/login');
    }
  }, [profile, loading, router]);

  return null;
};

export default HomePage;
