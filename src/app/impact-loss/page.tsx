'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  ShieldAlert,
  Users,
  Building2,
  AlertTriangle,
  TrendingDown,
  MapPin,
  Truck,
  Zap,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';

const settlements = [
  {
    id: 's1',
    name: 'Sambalpur',
    pop: 185000,
    atRisk: 142000,
    depth: 3.2,
    vel: 1.8,
    hr: 3.1,
    hazardClass: 'extreme',
    arrivalMin: 42,
    damageINR: 2840,
  },
  {
    id: 's2',
    name: 'Bargarh',
    pop: 98000,
    atRisk: 61000,
    depth: 1.8,
    vel: 1.1,
    hr: 1.9,
    hazardClass: 'significant',
    arrivalMin: 87,
    damageINR: 980,
  },
  {
    id: 's3',
    name: 'Jharsuguda',
    pop: 120000,
    atRisk: 28000,
    depth: 0.9,
    vel: 0.6,
    hr: 0.9,
    hazardClass: 'moderate',
    arrivalMin: 118,
    damageINR: 340,
  },
  {
    id: 's4',
    name: 'Sonepur',
    pop: 45000,
    atRisk: 4200,
    depth: 0.4,
    vel: 0.3,
    hr: 0.4,
    hazardClass: 'low',
    arrivalMin: 156,
    damageINR: 62,
  },
  {
    id: 's5',
    name: 'Boudh',
    pop: 32000,
    atRisk: 1800,
    depth: 0.2,
    vel: 0.2,
    hr: 0.2,
    hazardClass: 'low',
    arrivalMin: 210,
    damageINR: 18,
  },
];

const criticalAssets = [
  {
    id: 'ca1',
    type: 'Hospital',
    name: 'VSS Medical College',
    depth: 2.1,
    arrivalMin: 48,
    status: 'critical',
  },
  {
    id: 'ca2',
    type: 'Bridge',
    name: 'Hirakud Bridge NH-53',
    depth: 4.8,
    arrivalMin: 35,
    status: 'critical',
  },
  {
    id: 'ca3',
    type: 'Power',
    name: 'Hirakud Power Station',
    depth: 1.4,
    arrivalMin: 52,
    status: 'warning',
  },
  {
    id: 'ca4',
    type: 'School',
    name: 'Sambalpur Dist. School',
    depth: 0.8,
    arrivalMin: 65,
    status: 'warning',
  },
  {
    id: 'ca5',
    type: 'Shelter',
    name: 'Cyclone Shelter #4',
    depth: 0.0,
    arrivalMin: null,
    status: 'safe',
  },
];

const hazardColors: Record<string, string> = {
  extreme: 'text-danger bg-danger/10 border-danger/30',
  significant: 'text-warning bg-warning/10 border-warning/30',
  moderate: 'text-accent bg-accent/10 border-accent/30',
  low: 'text-success bg-success/10 border-success/30',
};

const assetStatusColors: Record<string, string> = {
  critical: 'text-danger',
  warning: 'text-warning',
  safe: 'text-success',
};

export default function ImpactLossPage() {
  const [activeTab, setActiveTab] = useState<'exposure' | 'assets' | 'evacuation'>('exposure');

  const totalAtRisk = settlements.reduce((s, x) => s + x.atRisk, 0);
  const totalDamage = settlements.reduce((s, x) => s + x.damageINR, 0);

  return (
    <AppLayout activePath="/impact-loss">
      <div className="flex flex-col h-full overflow-hidden bg-background">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <ShieldAlert size={20} className="text-danger" />
            <div>
              <h1 className="text-base font-700 text-foreground">Impact &amp; Loss</h1>
              <p className="text-xs text-muted-foreground">
                Hazard rating · Exposure · Loss of life · Economic damage · Evacuation intelligence
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              {
                label: 'Population at Risk',
                value: (totalAtRisk / 1000).toFixed(0) + 'k',
                sub: 'Day scenario',
                icon: Users,
                color: 'text-danger',
              },
              {
                label: 'Est. Economic Damage',
                value: '₹' + (totalDamage / 100).toFixed(1) + 'B',
                sub: 'JRC depth–damage curves',
                icon: TrendingDown,
                color: 'text-warning',
              },
              {
                label: 'Critical Assets Hit',
                value: '4',
                sub: '1 hospital · 1 bridge · 1 power',
                icon: Building2,
                color: 'text-accent',
              },
              {
                label: 'Settlements Affected',
                value: settlements.length.toString(),
                sub: '2 extreme · 1 significant',
                icon: MapPin,
                color: 'text-primary',
              },
            ].map(({ label, value, sub, icon: Icon, color }) => (
              <div key={label} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {label}
                    </p>
                    <p className={`text-2xl font-700 font-mono mt-1 ${color}`}>{value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
                  </div>
                  <Icon size={18} className={`${color} opacity-60`} />
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 border-b border-border">
            {[
              { id: 'exposure', label: 'Exposure & Hazard' },
              { id: 'assets', label: 'Critical Assets' },
              { id: 'evacuation', label: 'Evacuation Routes' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as 'exposure' | 'assets' | 'evacuation')}
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

          {/* Exposure tab */}
          {activeTab === 'exposure' && (
            <div className="space-y-2">
              <div className="grid grid-cols-7 gap-2 text-[10px] font-700 uppercase tracking-wider text-muted-foreground px-3 pb-1">
                <span className="col-span-2">Settlement</span>
                <span className="text-center">Pop at Risk</span>
                <span className="text-center">Depth (m)</span>
                <span className="text-center">HR</span>
                <span className="text-center">Hazard</span>
                <span className="text-center">Damage (Cr)</span>
              </div>
              {settlements.map((s) => (
                <div
                  key={s.id}
                  className="grid grid-cols-7 gap-2 items-center bg-card rounded-lg px-3 py-2.5 border border-border"
                >
                  <div className="col-span-2">
                    <p className="text-xs font-600 text-foreground">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">Arrival: {s.arrivalMin} min</p>
                  </div>
                  <p className="text-center text-xs font-mono font-600 text-foreground">
                    {(s.atRisk / 1000).toFixed(0)}k
                  </p>
                  <p className="text-center text-xs font-mono text-primary">{s.depth}</p>
                  <p className="text-center text-xs font-mono text-warning">{s.hr}</p>
                  <div className="flex justify-center">
                    <span
                      className={`text-[10px] font-700 px-2 py-0.5 rounded-full border capitalize ${hazardColors[s.hazardClass]}`}
                    >
                      {s.hazardClass}
                    </span>
                  </div>
                  <p className="text-center text-xs font-mono text-muted-foreground">
                    ₹{s.damageINR}Cr
                  </p>
                </div>
              ))}
              <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border text-[10px] text-muted-foreground">
                <p className="font-600 text-foreground mb-1">Hazard Rating Method</p>
                <p>
                  HR = d · (v + 0.5) + DF — Defra FD2320/2321. Debris factor (DF): 0 for d ≤ 0.25m;
                  0.25–0.75m: 0 pasture / 0.5 woodland / 1 urban; d &gt; 0.75m or v &gt; 2m/s: 0.5 /
                  1 / 1. Classes: Low &lt;1 · Moderate 1–2 · Significant 2–3 · Extreme &gt;3.
                </p>
              </div>
            </div>
          )}

          {/* Assets tab */}
          {activeTab === 'assets' && (
            <div className="space-y-2">
              {criticalAssets.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-4 bg-card rounded-lg px-4 py-3 border border-border"
                >
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                    {a.type === 'Hospital' && <Building2 size={16} className="text-danger" />}
                    {a.type === 'Bridge' && <Truck size={16} className="text-warning" />}
                    {a.type === 'Power' && <Zap size={16} className="text-accent" />}
                    {a.type === 'School' && <Building2 size={16} className="text-primary" />}
                    {a.type === 'Shelter' && <ShieldAlert size={16} className="text-success" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-600 text-foreground">{a.name}</p>
                    <p className="text-[10px] text-muted-foreground">{a.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-primary">
                      {a.depth > 0 ? `${a.depth}m depth` : 'Not inundated'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {a.arrivalMin ? `Arrival: ${a.arrivalMin} min` : '—'}
                    </p>
                  </div>
                  <span className={`text-xs font-700 capitalize ${assetStatusColors[a.status]}`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Evacuation tab */}
          {activeTab === 'evacuation' && (
            <div className="space-y-4">
              <div
                className="rounded-lg border border-border overflow-hidden"
                style={{ height: '320px' }}
              >
                <div
                  className="w-full h-full relative"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 40%, #0a1628 0%, #0a0e1a 100%)',
                  }}
                >
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* Flood zone */}
                    <ellipse
                      cx="40%"
                      cy="50%"
                      rx="28%"
                      ry="20%"
                      fill="var(--danger)"
                      fillOpacity="0.15"
                      stroke="var(--danger)"
                      strokeWidth="1"
                      strokeDasharray="4 2"
                    />
                    {/* Safe routes */}
                    <path
                      d="M 200,250 Q 150,200 100,150 Q 80,120 60,80"
                      stroke="var(--success)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="6 3"
                    />
                    <path
                      d="M 320,260 Q 380,220 420,180 Q 460,140 500,100"
                      stroke="var(--success)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="6 3"
                    />
                    {/* Blocked route */}
                    <path
                      d="M 250,260 Q 260,220 270,180"
                      stroke="var(--danger)"
                      strokeWidth="2"
                      fill="none"
                    />
                    <text x="255" y="175" fill="var(--danger)" fontSize="10">
                      ✕ Blocked
                    </text>
                    {/* Safe high ground */}
                    <circle
                      cx="60"
                      cy="75"
                      r="12"
                      fill="var(--success)"
                      fillOpacity="0.3"
                      stroke="var(--success)"
                      strokeWidth="1"
                    />
                    <text x="40" y="60" fill="var(--success)" fontSize="9">
                      Safe zone
                    </text>
                    <circle
                      cx="500"
                      cy="95"
                      r="12"
                      fill="var(--success)"
                      fillOpacity="0.3"
                      stroke="var(--success)"
                      strokeWidth="1"
                    />
                    <text x="480" y="80" fill="var(--success)" fontSize="9">
                      Safe zone
                    </text>
                  </svg>
                  <div className="absolute top-3 left-3 glass-panel rounded-md px-3 py-2">
                    <p className="text-[10px] font-600 text-foreground">
                      Flood-Aware Evacuation Routing
                    </p>
                    <p className="text-[9px] text-muted-foreground">
                      OSM road graph · Avoids inundated edges
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border text-[10px] text-muted-foreground">
                <p className="font-600 text-foreground mb-1">Methodology</p>
                <p>
                  OSM road network with flood-aware routing that avoids inundated edges.
                  Time-to-safety computed versus wave arrival time. Safe high ground identified from
                  DEM. BACKEND: OSMnx-style graph in Web Worker.
                </p>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-4 p-3 rounded-lg bg-warning-bg/20 border border-warning/20">
            <div className="flex items-start gap-2">
              <AlertTriangle size={13} className="text-warning mt-0.5 shrink-0" />
              <p className="text-[10px] text-warning leading-relaxed">
                Advisory: Decision-support estimate. Not a substitute for a Tier-3 study by a
                qualified dam-safety engineer. Damage figures use JRC global depth–damage curves
                with default assumptions — see assumptions table in exports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
