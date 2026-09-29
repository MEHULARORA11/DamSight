import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface AppLayoutProps {
  children: React.ReactNode;
  activePath?: string;
}

export default function AppLayout({ children, activePath }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar activePath={activePath} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-hidden relative">{children}</main>
      </div>
    </div>
  );
}
