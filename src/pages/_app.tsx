import React from 'react';
import { AppProps } from 'next/app';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import { NotificationProvider } from '@/contexts/NotificationContext';
import '@/styles/globals.css';

// Define pages that manage their own layout
const pagesWithLayout = ['/account', '/support', '/premium'];

export default function App({ Component, pageProps }: AppProps) {
  // Check if current page manages its own layout
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const usesOwnLayout = pagesWithLayout.includes(pathname);

  return (
    <NotificationProvider>
      {usesOwnLayout ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
      <Toaster />
    </NotificationProvider>
  );
} 