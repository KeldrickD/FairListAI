import React from 'react';
import { AppProps } from 'next/app';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster />
    </>
  );
} 