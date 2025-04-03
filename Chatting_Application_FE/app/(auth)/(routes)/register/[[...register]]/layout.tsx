import type { Metadata } from 'next';
import type React from 'react';

export const metadata: Metadata = {
  title: 'Register - Create Your Account',
  description: 'Create a new account to get started',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-center">{children}</div>;
}
