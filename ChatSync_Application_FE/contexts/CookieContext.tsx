'use client';

import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useMemo, useState } from 'react';

interface CookieContextType {
  cookie: string;
  setCookie?: Dispatch<SetStateAction<string>>;
}

export const CookieContext = createContext<CookieContextType | null>(null);

export const useCookies = (): CookieContextType => {
  const context = useContext(CookieContext);
  if (!context) {
    console.warn('useCookies was used outside of the CookieProvider');
    return { cookie: undefined, setCookie: () => {} } as unknown as CookieContextType;
  }
  return context;
};

export const CookieProvider = ({
  children,
  cookie: initialCookie,
}: PropsWithChildren<{
  cookie: string | undefined;
}>) => {
  const [cookie, setCookie] = useState<string | undefined>(initialCookie);

  const providerValue = useMemo(
    () => ({
      cookie: cookie as string,
      setCookie: setCookie as Dispatch<SetStateAction<string>>,
    }),
    [cookie]
  );

  return <CookieContext.Provider value={providerValue}>{children}</CookieContext.Provider>;
};
