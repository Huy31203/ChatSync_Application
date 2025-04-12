import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import React from 'react';

import { NextTopLoader } from '@/components/loader/top-loader';
import { ModalProvider } from '@/components/providers/ModalProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { cn } from '@/lib/utils';
import './globals.css';

const font = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Team Chat Application',
  description: 'Based on Discord Application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          font.className,
          'bg-white min-h-screen dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800'
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="discord-theme">
          <ModalProvider />
          <NextTopLoader />
          {children}
        </ThemeProvider>
        <ToastProvider />
      </body>
    </html>
  );
}
