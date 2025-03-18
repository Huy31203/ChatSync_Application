'use client';

import { usePathname } from 'next/navigation';
import Loader from 'nextjs-toploader';
import NProgress from 'nprogress';
import { useEffect } from 'react';

export const NextTopLoader = () => {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.done();
  }, [pathname]);

  return <Loader />;
};
