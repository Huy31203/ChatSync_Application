// import { ModalProvider } from "@/components/providers/modal-provider";
import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import React from 'react';
import { ToastContainer } from 'react-toastify';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { cn } from '@/libs/utils';

import './globals.css';

const font = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Team Chat Application',
  description: 'Based on Discord Application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(font.className, 'bg-white dark:bg-[#313338]')}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="discord-theme">
          {/* <ModalProvider /> */}
          {children}
        </ThemeProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
