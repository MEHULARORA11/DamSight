'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  Satellite,
  RefreshCw,
  Clock,
  AlertTriangle,
  CheckCircle,
  Layers,
  CloudRain,
} from 'lucide-react';

const nrtJobs = [
  {
    id: 'NRT-001',
    dam: 'Hirakud Dam',
    river: 'Mahanadi',
    lastAcq: '2026-09-27T10:22:00Z',
    ageHr: 43,
    s1Path: 'Sentinel-1 GRD IW VH',
    floodKm2: 284,
    cropKm2: 142,
    urbanKm2: 38,
    popExposed: 94000,
    status: 'fresh',
    dataPath: 'Sentinel-1 (ESA Copernicus)',
  },
  {
    id: 'NRT-002',
    dam: 'Tehri Dam',
    river: 'Bhagirathi',
    lastAcq: '2026-09-26T08:14:00Z',
    ageHr: 69,
    s1Path: 'Sentinel-1 GRD IW VH',
    floodKm2: 0,
    cropKm2: 0,
    urbanKm2: 0,
    popExposed: 0,
    status: 'stale',
    dataPath: 'Sentinel-1 (ESA Copernicus)',
  },
  {
    id: 'NRT-003',
    dam: 'Teesta-III',
    river: 'Teesta',
    lastAcq: '2026-09-29T02:10:00Z',
    ageHr: 3.1,
    s1Path: 'Sentinel-1 GRD IW VH',
    floodKm2: 87,
    cropKm2: 52,
    urbanKm2: 8,
    popExposed: 24600,
    status: 'live',
    dataPath: 'Sentinel-1 (ESA Copernicus)',
  },
];

const blockageCandidates = [
  {
    id: 'BLK-001',
    location: 'Lhonak Valley, Sikkim',
    lat: 27.91,
    lon: 88.42,
    volumeM3: 14200000,
    detectedAt: '2026-09-28T18:00:00Z',
    confidence: 'high',
  },
  {
    id: 'BLK-002',
    location: 'Chamoli, Uttarakhand',
    lat: 30.42,
    lon: 79.33,
    volumeM3: 3800000,
    detectedAt: '2026-09-29T01:30:00Z',
    confidence: 'medium',
  },
];

const statusColors: Record<string, string> = {
  live: 'text-success',
  fresh: 'text-primary',
  stale: 'text-warning',
};

const statusIcons: Record<string, React.ReactNode> = {
  live: <CheckCircle size={13} className="text-success" />,
  fresh: <CheckCircle size={13} className="text-primary" />,
  stale: <Clock size={13} className="text-warning" />,
};

export default function NRTMonitorPage() {
  const [activeJob, setActiveJob] = useState(nrtJobs[2]);
  const [activeTab, setActiveTab] = useState<'flood' | 'blockage' | 'validation'>('flood');

  return (
    <AppLayout activePath="/nrt-monitor">
      <div className="flex flex-col h-full overflow-hidden bg-background">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Satellite size={20} className="text-success" />
              <div>
                <h1 className="text-base font-700 text-foreground">Near-Real-Time Monitor</h1>
                <p className="text-xs text-muted-foreground">
                  Sentinel-1 change detection · JRC permanent water mask · HAND filter · UN-SPIDER
                  practice
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[10px] text-success font-600">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                GEE: Not authenticated — using Planetary Computer fallback
              </span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted text-muted-foreground hover:text-foreground text-xs font-600 transition-all">
                <RefreshCw size={12} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left: job list */}
          <div className="w-72 shrink-0 border-r border-border overflow-y-auto p-3 space-y-2">
            <p className="text-[10px] font-700 uppercase tracking-wider text-muted-foreground px-1 pb-1">
              Monitored Sites
            </p>
            {nrtJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setActiveJob(job)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  activeJob.id === job.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:border-muted-foreground'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-700 text-foreground">{job.dam}</span>
                  <div className="flex items-center gap-1">
                    {statusIcons[job.status]}
                    <span className={`text-[10px] font-600 ${statusColors[job.status]}`}>
                      {job.status}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">{job.river}</p>
                <p className="text-[10px] font-mono text-muted-foreground mt-1">
                  Data age:{' '}
                  <span className={job.ageHr > 48 ? 'text-warning' : 'text-foreground'}>
                    {job.ageHr}h
                  </span>
                </p>
              </button>
            ))}
          </div>

          {/* Right: detail */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Data provenance */}
            <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Satellite size={13} className="text-primary" />
                <span className="text-xs font-600 text-foreground">
                  {activeJob.dam} — {activeJob.river}
                </span>
                <span className={`text-[10px] font-600 ml-auto ${statusColors[activeJob.status]}`}>
                  Data is {activeJob.ageHr} hours old
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-[10px] font-mono text-muted-foreground mt-2">
                <span>Source: {activeJob.dataPath}</span>
                <span>Mode: {activeJob.s1Path}</span>
                <span>
                  Last acq:{' '}
                  {new Date(activeJob.lastAcq).toISOString().slice(0, 16).replace('T', ' ')} UTC
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 border-b border-border">
              {[
                { id: 'flood', label: 'Flood Extent' },
                { id: 'blockage', label: 'Blockage Detection' },
                { id: 'validation', label: 'Obs vs Simulated' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as 'flood' | 'blockage' | 'validation')}
                  className={`px-4 py-2 text-xs font-600 border-b-2 transition-all -mb-px ${
                    activeTab === id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeTab === 'flood' && (
              <div className="space-y-4">
                {/* Map */}
                <div
                  className="rounded-lg border border-border overflow-hidden"
                  style={{ height: '280px' }}
                >
                  <div
                    className="w-full h-full relative"
                    style={{
                      background: 'radial-gradient(ellipse at 50% 40%, #0a1628 0%, #0a0e1a 100%)',
                    }}
                  >
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <ellipse
                        cx="45%"
                        cy="50%"
                        rx="25%"
                        ry="18%"
                        fill="var(--primary)"
                        fillOpacity="0.3"
                        stroke="var(--primary)"
                        strokeWidth="1"
                      />
                      <text
                        x="10"
                        y="20"
                        fill="var(--muted-foreground)"
                        fontSize="10"
                        fontFamily="var(--font-mono)"
                      >
                        S1 GRD IW VH · Ratio threshold 1.25 · JRC permanent water masked
                      </text>
                    </svg>
                    <div className="absolute bottom-3 left-3 glass-panel rounded-md p-2">
                      <p className="text-[9px] text-muted-foreground">
                        BACKEND: GEE / Planetary Computer S1 change detection
                      </p>
                    </div>
                  </div>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      label: 'Flood Extent',
                      value: `${activeJob.floodKm2} km²`,
                      icon: Layers,
                      color: 'text-primary',
                    },
                    {
                      label: 'Flooded Cropland',
                      value: `${activeJob.cropKm2} km²`,
                      icon: CloudRain,
                      color: 'text-warning',
                    },
                    {
                      label: 'Flooded Urban',
                      value: `${activeJob.urbanKm2} km²`,
                      icon: Layers,
                      color: 'text-danger',
                    },
                    {
                      label: 'Pop Exposed',
                      value: `${(activeJob.popExposed / 1000).toFixed(0)}k`,
                      icon: Satellite,
                      color: 'text-accent',
                    },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-card border border-border rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                      <p className={`text-xl font-700 font-mono mt-1 ${color}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'blockage' && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground mb-3">
                  New water bodies detected in valleys via S1/S2 water-index change. Volume
                  estimated from DEM.
                </p>
                {blockageCandidates.map((b) => (
                  <div key={b.id} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={13} className="text-warning" />
                          <span className="text-xs font-700 text-foreground">{b.location}</span>
                          <span
                            className={`text-[10px] font-600 px-2 py-0.5 rounded-full ${
                              b.confidence === 'high'
                                ? 'bg-danger/10 text-danger'
                                : 'bg-warning/10 text-warning'
                            }`}
                          >
                            {b.confidence} confidence
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-3 text-[10px] font-mono text-muted-foreground">
                          <span>Lat: {b.lat}°N</span>
                          <span>Lon: {b.lon}°E</span>
                          <span>Vol: {(b.volumeM3 / 1e6).toFixed(1)} M m³</span>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-[10px] font-600 hover:opacity-90 transition-all">
                        Simulate Breach →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'validation' && (
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-xs font-600 text-foreground mb-3">
                    Observed (S1) vs Simulated Inundation Extent
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                      { label: 'CSI', value: '0.74', color: 'text-success' },
                      { label: 'F1 Score', value: '0.81', color: 'text-primary' },
                      { label: 'Hit Rate', value: '0.89', color: 'text-accent' },
                      { label: 'False-Alarm Ratio', value: '0.12', color: 'text-warning' },
                      { label: 'Observed Area', value: '87 km²', color: 'text-foreground' },
                      { label: 'Simulated Area', value: '94 km²', color: 'text-foreground' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-[10px] text-muted-foreground">{label}</p>
                        <p className={`text-lg font-700 font-mono mt-1 ${color}`}>{value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-3">
                    Observed extent from Sentinel-1 GRD IW VH change detection (UN-SPIDER practice).
                    Simulated from Native 2D-SWE run RUN-2865. CSI/F1 computed on 30m grid.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
