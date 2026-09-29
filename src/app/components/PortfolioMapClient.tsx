'use client';
import React, { useState } from 'react';
import DamListPanel from './DamListPanel';
import MapCanvas from './MapCanvas';
import EngineHealthWidget from './EngineHealthWidget';
import PortfolioKPIBar from './PortfolioKPIBar';
import RecentActivityFeed from './RecentActivityFeed';
import DamDetailDrawer from './DamDetailDrawer';
import { damCatalog, type Dam } from '@/lib/mockData';

export default function PortfolioMapClient() {
  const [selectedDam, setSelectedDam] = useState<Dam | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hazardFilter, setHazardFilter] = useState<string>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDamSelect = (dam: Dam) => {
    setSelectedDam(dam);
    setDrawerOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* KPI Bar */}
      <PortfolioKPIBar />

      {/* Main content area */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Left panel */}
        <div className="w-80 xl:w-96 flex flex-col border-r border-border bg-card/50 shrink-0 overflow-hidden z-10">
          <DamListPanel
            dams={damCatalog}
            selectedDam={selectedDam}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            hazardFilter={hazardFilter}
            setHazardFilter={setHazardFilter}
            onSelect={handleDamSelect}
          />
        </div>

        {/* Map canvas */}
        <div className="flex-1 relative">
          <MapCanvas selectedDam={selectedDam} dams={damCatalog} onDamClick={handleDamSelect} />

          {/* Engine health widget - floating */}
          <div className="absolute top-4 right-4 z-20">
            <EngineHealthWidget />
          </div>

          {/* Recent activity - floating bottom right */}
          <div className="absolute bottom-4 right-4 z-20 w-72">
            <RecentActivityFeed />
          </div>

          {/* Disclaimer */}
          <div className="absolute bottom-4 left-4 z-20">
            <div className="glass-panel rounded-md px-3 py-1.5 text-[10px] text-warning font-500 flex items-center gap-1.5">
              <span>⚠</span>
              <span>
                Decision-support estimate. Not a substitute for a Tier-3 study by a qualified
                dam-safety engineer.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail drawer */}
      {drawerOpen && selectedDam && (
        <DamDetailDrawer dam={selectedDam} onClose={() => setDrawerOpen(false)} />
      )}
    </div>
  );
}
