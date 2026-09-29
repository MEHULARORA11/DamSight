'use client';
import React from 'react';
import { X, Play, MapPin, Database, AlertTriangle, ChevronRight } from 'lucide-react';
import { type Dam } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import Link from 'next/link';

interface DamDetailDrawerProps {
  dam: Dam;
  onClose: () => void;
}

export default function DamDetailDrawer({ dam, onClose }: DamDetailDrawerProps) {
  return (
    <div
      className="absolute bottom-0 left-80 xl:left-96 right-0 z-30 animate-fade-in-up"
      style={{ height: '280px' }}
    >
      <div className="glass-panel h-full border-t border-border overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-600 text-foreground">{dam.name}</h3>
                <StatusBadge variant={dam.hazardClass as 'high' | 'significant' | 'low'} />
                <span className="text-[10px] text-muted-foreground font-mono">ID: {dam.id}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {dam.river} · {dam.state} · {dam.type}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/scenario-wizard"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-600 rounded-md hover:opacity-90 active:scale-95 transition-all duration-150"
            >
              <Play size={12} />
              New Scenario
            </Link>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              aria-label="Close drawer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex h-full gap-0 min-w-max">
            {/* Attributes */}
            <div className="w-72 shrink-0 p-4 border-r border-border overflow-y-auto">
              <p className="text-[10px] font-600 text-muted-foreground uppercase tracking-wider mb-2">
                Dam Attributes
              </p>
              <div className="space-y-2">
                {[
                  { label: 'Height', value: `${dam.heightM} m`, verified: true },
                  { label: 'Crest Length', value: `${dam.crestLengthM} m`, verified: true },
                  {
                    label: 'Gross Storage',
                    value: `${dam.storageGm3} Mm³`,
                    verified: dam.storageVerified,
                  },
                  { label: 'FRL', value: `${dam.frlM} m`, verified: false },
                  { label: 'Year Completed', value: String(dam.yearCompleted), verified: true },
                  { label: 'Purpose', value: dam.purpose, verified: true },
                  {
                    label: 'Catchment Area',
                    value: `${dam.catchmentKm2} km²`,
                    verified: dam.storageVerified,
                  },
                ].map((attr) => (
                  <div key={`attr-${attr.label}`} className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">{attr.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono text-foreground">{attr.value}</span>
                      {attr.verified ? (
                        <span className="text-[9px] text-success" title="User-verified">
                          ✓
                        </span>
                      ) : (
                        <span className="text-[9px] text-warning" title="Unverified — from GeoDAR">
                          ?
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-[9px] text-muted-foreground flex items-center gap-1">
                  <Database size={9} />
                  Source: GeoDAR v1.1 · CWC NRLD 2023
                </p>
                <p className="text-[9px] text-warning mt-1 flex items-center gap-1">
                  <AlertTriangle size={9} />
                  Unverified attributes: prompt user to confirm before running
                </p>
              </div>
            </div>

            {/* Breach quick-calc */}
            <div className="w-64 shrink-0 p-4 border-r border-border overflow-y-auto">
              <p className="text-[10px] font-600 text-muted-foreground uppercase tracking-wider mb-2">
                Breach Quick-Calc
              </p>
              <p className="text-[9px] text-muted-foreground mb-2">
                Froehlich 2016/17 · CWC Guidelines 2018
              </p>
              <div className="space-y-1.5">
                {[
                  {
                    label: 'B_avg (overtopping)',
                    value: `${dam.breachBavgM} m`,
                    formula: '0.23·1.5·V_W^(1/3)',
                  },
                  {
                    label: 'Formation time',
                    value: `${dam.breachTfMin} min`,
                    formula: '60·√(V_W/(g·H_b²))',
                  },
                  {
                    label: 'Peak Q_p (Froehlich)',
                    value: `${dam.peakQpM3s.toLocaleString('en-IN')} m³/s`,
                    formula: 'empirical',
                  },
                  {
                    label: 'Q_p (1995 cross-check)',
                    value: `${dam.qp1995M3s.toLocaleString('en-IN')} m³/s`,
                    formula: '0.607·V^0.295·H^1.24',
                  },
                ].map((item) => (
                  <div key={`breach-${item.label}`} className="p-2 bg-muted/30 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">{item.label}</span>
                      <span className="text-[11px] font-mono font-600 text-foreground">
                        {item.value}
                      </span>
                    </div>
                    <p className="text-[9px] text-muted-foreground/60 mt-0.5 font-mono">
                      {item.formula}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-muted-foreground mt-2">
                V_W = {dam.vwMm3} Mm³ · H_b = {dam.heightM} m
              </p>
            </div>

            {/* Recent runs */}
            <div className="w-64 shrink-0 p-4 border-r border-border overflow-y-auto">
              <p className="text-[10px] font-600 text-muted-foreground uppercase tracking-wider mb-2">
                Recent Runs
              </p>
              <div className="space-y-1.5">
                {dam.recentRuns.map((run) => (
                  <div
                    key={run.id}
                    className="p-2 bg-muted/20 rounded-md hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-primary">{run.id}</span>
                      <StatusBadge variant={run.status as 'completed' | 'running' | 'failed'} />
                    </div>
                    <p className="text-[10px] text-foreground">{run.scenario}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">
                      {run.engine} · {run.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="w-56 shrink-0 p-4 overflow-y-auto">
              <p className="text-[10px] font-600 text-muted-foreground uppercase tracking-wider mb-2">
                Location
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <MapPin size={11} className="text-muted-foreground" />
                  <span className="text-[11px] font-mono text-foreground">
                    {dam.lat}°N, {dam.lon}°E
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">Basin: {dam.basin}</p>
                <p className="text-[10px] text-muted-foreground">District: {dam.district}</p>
                <p className="text-[10px] text-muted-foreground">CWC Region: {dam.cwcRegion}</p>
              </div>
              <div className="mt-3 p-2 bg-muted/20 rounded-md">
                <p className="text-[9px] text-muted-foreground font-600 mb-1">DEM Available</p>
                {dam.demSources.map((dem) => (
                  <p key={`dem-${dem}`} className="text-[9px] text-success">
                    ✓ {dem}
                  </p>
                ))}
              </div>
              <Link
                href="/scenario-wizard"
                className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-primary/40 text-primary text-xs font-600 rounded-md hover:bg-primary/10 transition-all duration-150"
              >
                Configure Scenario
                <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
