'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  GitCompare,
  ChevronDown,
  BarChart2,
  Map,
  Download,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';

const runs = [
  {
    id: 'RUN-2847',
    label: 'Tehri Dam — Overtopping PMF',
    engine: 'Native 2D-SWE (FV)',
    dem: 'Copernicus GLO-30',
    peakQ: 185400,
    maxDepth: 18.7,
    inundation: 1240,
    popAtRisk: 892000,
    massErr: 0.004,
    runtime: 22,
  },
  {
    id: 'RUN-2848',
    label: 'Hirakud Dam — Controlled Release',
    engine: 'Native SWE-SPH',
    dem: 'Copernicus GLO-30',
    peakQ: 62400,
    maxDepth: 8.3,
    inundation: 342,
    popAtRisk: 187400,
    massErr: 0.018,
    runtime: 19,
  },
  {
    id: 'RUN-2865',
    label: 'Teesta-III — GLOF Oct 2023',
    engine: 'Native 2D-SWE (FV)',
    dem: 'Copernicus GLO-30',
    peakQ: 7820,
    maxDepth: 14.2,
    inundation: 87,
    popAtRisk: 24600,
    massErr: 0.009,
    runtime: 31,
  },
];

const metrics = [
  {
    key: 'CSI',
    label: 'Critical Success Index',
    valueA: 0.74,
    valueB: 0.68,
    unit: '',
    good: 'high',
  },
  { key: 'F1', label: 'F1 Score', valueA: 0.81, valueB: 0.76, unit: '', good: 'high' },
  { key: 'hitRate', label: 'Hit Rate', valueA: 0.89, valueB: 0.83, unit: '', good: 'high' },
  { key: 'FAR', label: 'False-Alarm Ratio', valueA: 0.12, valueB: 0.18, unit: '', good: 'low' },
  { key: 'depthDiff', label: 'Mean Depth Diff', valueA: 0, valueB: 1.4, unit: 'm', good: 'low' },
  {
    key: 'arrivalDiff',
    label: 'Arrival Time Diff',
    valueA: 0,
    valueB: 8.2,
    unit: 'min',
    good: 'low',
  },
  {
    key: 'massErr',
    label: 'Mass Balance Error',
    valueA: 0.004,
    valueB: 0.018,
    unit: '%',
    good: 'low',
  },
  { key: 'runtime', label: 'Runtime', valueA: 22, valueB: 19, unit: 'min', good: 'low' },
];

export default function CompareLabPage() {
  const [runA, setRunA] = useState(runs[0]);
  const [runB, setRunB] = useState(runs[1]);
  const [activeTab, setActiveTab] = useState<'metrics' | 'map' | 'hydrograph'>('metrics');

  return (
    <AppLayout activePath="/compare-lab">
      <div className="flex flex-col h-full overflow-hidden bg-background">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitCompare size={20} className="text-primary" />
              <div>
                <h1 className="text-base font-700 text-foreground">Compare Lab</h1>
                <p className="text-xs text-muted-foreground">
                  Side-by-side scenario comparison · CSI / F1 / hit rate / false-alarm metrics
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-muted-foreground hover:text-foreground text-xs font-600 transition-all">
              <Download size={13} />
              Export PDF / CSV
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Run selectors */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              {
                label: 'Run A (Reference)',
                run: runA,
                setRun: setRunA,
                color: 'text-primary border-primary/30 bg-primary/5',
              },
              {
                label: 'Run B (Comparison)',
                run: runB,
                setRun: setRunB,
                color: 'text-accent border-accent/30 bg-accent/5',
              },
            ].map(({ label, run, setRun, color }) => (
              <div key={label} className={`rounded-lg border p-4 ${color}`}>
                <p className="text-[10px] font-700 uppercase tracking-wider mb-2 opacity-70">
                  {label}
                </p>
                <div className="relative">
                  <select
                    className="w-full bg-transparent text-sm font-600 text-foreground appearance-none pr-6 cursor-pointer outline-none"
                    value={run.id}
                    onChange={(e) => setRun(runs.find((r) => r.id === e.target.value) ?? runs[0])}
                  >
                    {runs.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.id} — {r.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-60"
                  />
                </div>
                <div className="mt-2 space-y-0.5 text-[10px] font-mono opacity-70">
                  <p>Engine: {run.engine}</p>
                  <p>DEM: {run.dem}</p>
                  <p>
                    Peak Q: {(run.peakQ / 1000).toFixed(1)}k m³/s · Max depth: {run.maxDepth} m
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 border-b border-border">
            {[
              { id: 'metrics', label: 'Metrics & Scores', icon: BarChart2 },
              { id: 'map', label: 'Difference Map', icon: Map },
              { id: 'hydrograph', label: 'Hydrograph Comparison', icon: TrendingUp },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as 'metrics' | 'map' | 'hydrograph')}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-600 border-b-2 transition-all -mb-px ${
                  activeTab === id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* Metrics tab */}
          {activeTab === 'metrics' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-[10px] font-700 uppercase tracking-wider text-muted-foreground px-3 pb-1">
                <span>Metric</span>
                <span className="text-primary text-center">Run A</span>
                <span className="text-accent text-center">Run B</span>
              </div>
              {metrics.map((m) => {
                const aWins = m.good === 'high' ? m.valueA >= m.valueB : m.valueA <= m.valueB;
                return (
                  <div
                    key={m.key}
                    className="grid grid-cols-3 gap-2 items-center bg-card rounded-lg px-3 py-2.5 border border-border"
                  >
                    <div>
                      <p className="text-xs font-600 text-foreground">{m.label}</p>
                    </div>
                    <div
                      className={`text-center font-mono font-700 text-sm ${aWins ? 'text-success' : 'text-muted-foreground'}`}
                    >
                      {m.valueA}
                      {m.unit}
                      {aWins && <span className="ml-1 text-[9px] text-success">▲</span>}
                    </div>
                    <div
                      className={`text-center font-mono font-700 text-sm ${!aWins ? 'text-success' : 'text-muted-foreground'}`}
                    >
                      {m.valueB}
                      {m.unit}
                      {!aWins && <span className="ml-1 text-[9px] text-success">▲</span>}
                    </div>
                  </div>
                );
              })}

              {/* Summary */}
              <div className="mt-4 p-3 rounded-lg bg-warning-bg/20 border border-warning/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={13} className="text-warning mt-0.5 shrink-0" />
                  <p className="text-[10px] text-warning leading-relaxed">
                    Advisory: Metric differences reflect model uncertainty and input data variation.
                    CSI/F1 computed against simulated reference extent — not validated against
                    observed flood data unless noted. Not a substitute for a Tier-3 study.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Map tab */}
          {activeTab === 'map' && (
            <div
              className="rounded-lg border border-border overflow-hidden"
              style={{ height: '420px' }}
            >
              <div
                className="w-full h-full relative"
                style={{
                  background: 'radial-gradient(ellipse at 50% 40%, #0a1628 0%, #0a0e1a 100%)',
                }}
              >
                <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
                  <defs>
                    <pattern id="cmp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="var(--border)"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#cmp-grid)" />
                </svg>
                {/* Run A extent */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <ellipse
                    cx="40%"
                    cy="50%"
                    rx="30%"
                    ry="22%"
                    fill="var(--primary)"
                    fillOpacity="0.25"
                    stroke="var(--primary)"
                    strokeWidth="1"
                    strokeDasharray="4 2"
                  />
                  {/* Run B extent */}
                  <ellipse
                    cx="45%"
                    cy="52%"
                    rx="22%"
                    ry="16%"
                    fill="var(--accent)"
                    fillOpacity="0.25"
                    stroke="var(--accent)"
                    strokeWidth="1"
                    strokeDasharray="4 2"
                  />
                  {/* Difference (A only) */}
                  <ellipse
                    cx="32%"
                    cy="46%"
                    rx="10%"
                    ry="8%"
                    fill="var(--danger)"
                    fillOpacity="0.3"
                  />
                  {/* Agreement */}
                  <ellipse
                    cx="44%"
                    cy="51%"
                    rx="14%"
                    ry="10%"
                    fill="var(--success)"
                    fillOpacity="0.2"
                  />
                </svg>
                {/* Legend */}
                <div className="absolute bottom-3 left-3 glass-panel rounded-md p-2.5 space-y-1">
                  {[
                    { color: 'var(--primary)', label: 'Run A only', opacity: 0.5 },
                    { color: 'var(--accent)', label: 'Run B only', opacity: 0.5 },
                    { color: 'var(--success)', label: 'Agreement', opacity: 0.5 },
                    { color: 'var(--danger)', label: 'Disagreement', opacity: 0.5 },
                  ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ background: color, opacity: 0.6 }}
                      />
                      <span className="text-[9px] text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute top-3 left-3 glass-panel rounded-md px-3 py-2">
                  <p className="text-[10px] font-600 text-foreground">Inundation Difference Map</p>
                  <p className="text-[9px] text-muted-foreground font-mono">
                    BACKEND: MapLibre GL JS with deck.gl difference layer
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Hydrograph tab */}
          {activeTab === 'hydrograph' && (
            <div
              className="rounded-lg border border-border bg-card p-4"
              style={{ height: '420px' }}
            >
              <p className="text-xs font-600 text-muted-foreground mb-3">
                Peak Discharge Comparison — Breach Hydrograph
              </p>
              <svg viewBox="0 0 600 300" className="w-full h-full">
                <defs>
                  <linearGradient id="hA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="hB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Grid */}
                {[0, 60, 120, 180, 240, 300].map((y) => (
                  <line
                    key={y}
                    x1="40"
                    y1={y}
                    x2="580"
                    y2={y}
                    stroke="var(--border)"
                    strokeWidth="0.5"
                  />
                ))}
                {[40, 150, 260, 370, 480, 580].map((x) => (
                  <line
                    key={x}
                    x1={x}
                    y1="0"
                    x2={x}
                    y2="300"
                    stroke="var(--border)"
                    strokeWidth="0.5"
                  />
                ))}
                {/* Run A curve */}
                <path
                  d="M 40,290 C 100,280 140,100 200,30 C 260,-40 300,80 360,180 C 420,260 500,280 580,285"
                  fill="url(#hA)"
                  stroke="var(--primary)"
                  strokeWidth="2"
                />
                {/* Run B curve */}
                <path
                  d="M 40,290 C 110,285 160,160 220,100 C 280,40 320,120 380,200 C 440,265 510,282 580,287"
                  fill="url(#hB)"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeDasharray="6 3"
                />
                {/* Labels */}
                <text
                  x="210"
                  y="25"
                  fill="var(--primary)"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                >
                  Run A peak
                </text>
                <text
                  x="230"
                  y="95"
                  fill="var(--accent)"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                >
                  Run B peak
                </text>
                <text x="40" y="315" fill="var(--muted-foreground)" fontSize="9">
                  0
                </text>
                <text x="270" y="315" fill="var(--muted-foreground)" fontSize="9">
                  3 hr
                </text>
                <text x="560" y="315" fill="var(--muted-foreground)" fontSize="9">
                  6 hr
                </text>
                <text
                  x="5"
                  y="30"
                  fill="var(--muted-foreground)"
                  fontSize="9"
                  transform="rotate(-90 5 150)"
                >
                  Q (m³/s)
                </text>
              </svg>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
