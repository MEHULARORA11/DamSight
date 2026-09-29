import React from 'react';
import AppLayout from '@/components/AppLayout';
import ToastProvider from '@/components/ui/Toast';
import ScenarioWizardClient from './components/ScenarioWizardClient';

export default function ScenarioWizardPage() {
  return (
    <>
      <AppLayout activePath="/scenario-wizard">
        <ScenarioWizardClient />
      </AppLayout>
      <ToastProvider />
    </>
  );
}
