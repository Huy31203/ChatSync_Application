import type { Metadata } from 'next';
import type React from 'react';

export const metadata: Metadata = {
  title: 'Sign In - Log in Your Account',
  description: 'Log in to your account to continue',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-full flex items-center justify-center">{children}</div>;
}
