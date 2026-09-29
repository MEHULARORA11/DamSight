import React from 'react';
import AppLayout from '@/components/AppLayout';
import ToastProvider from '@/components/ui/Toast';
import PortfolioMapClient from './components/PortfolioMapClient';

export default function HomePortfolioPage() {
  return (
    <>
      <AppLayout activePath="/">
        <PortfolioMapClient />
      </AppLayout>
      <ToastProvider />
    </>
  );
}
