import React from 'react';
import AppLayout from '@/components/AppLayout';
import ToastProvider from '@/components/ui/Toast';
import LiveSimulationClient from './components/LiveSimulationClient';

export default function LiveSimulationPage() {
  return (
    <>
      <AppLayout activePath="/live-simulation-view">
        <LiveSimulationClient />
      </AppLayout>
      <ToastProvider />
    </>
  );
}
