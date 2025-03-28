'use client';

import { createContext, PropsWithChildren, useContext, useMemo } from 'react';

interface CookieContextType {
  cookie: string;
}

export const CookieContext = createContext<CookieContextType | null>(null);

export const useCookies = (): CookieContextType => {
  const context = useContext(CookieContext);
  if (!context) {
    console.warn('useCookies was used outside of the CookieProvider');
    return { cookie: undefined };
  }
  return context;
};

export const CookieProvider = ({
  children,
  cookie,
}: PropsWithChildren<{
  cookie: string | undefined;
}>) => {
  const providerValue = useMemo(
    () => ({
      cookie: cookie,
    }),
    [cookie]
  );

  return <CookieContext.Provider value={providerValue as CookieContextType}>{children}</CookieContext.Provider>;
};
