import type { Metadata } from 'next';
import type React from 'react';

export const metadata: Metadata = {
  title: 'Get your password back',
  description: 'Enter your new password to reset',
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-full flex items-center justify-center">{children}</div>;
}
