'use client';
import React, { useState } from 'react';
import { Search, MapPin, ChevronRight, AlertTriangle, Check } from 'lucide-react';
import { damCatalog } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { type WizardState } from './ScenarioWizardClient';

interface Props {
  state: WizardState;
  update: (p: Partial<WizardState>) => void;
  onNext: () => void;
}

export default function Step1DamSelection({ state, update, onNext }: Props) {
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const filtered = damCatalog.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.river.toLowerCase().includes(search.toLowerCase()) ||
      d.state.toLowerCase().includes(search.toLowerCase())
  );

  const handleNext = () => {
    if (!state.damId) {
      setError('Select a dam from the catalog to continue.');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Left: catalog */}
      <div className="wizard-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-600 text-foreground mb-2">Dam Catalog</h3>
          <div className="relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search dam name, river, state…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-input border border-border rounded-md pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            {filtered.length} dams · Source: GeoDAR v1.1 + CWC NRLD 2023
          </p>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: '380px' }}>
          {filtered.map((dam) => {
            const isSelected = state.damId === dam.id;
            return (
              <button
                key={dam.id}
                onClick={() => {
                  update({ damId: dam.id, damName: dam.name });
                  setError('');
                }}
                className={`w-full text-left px-4 py-3 border-b border-border/50 hover:bg-muted/20 transition-colors ${
                  isSelected ? 'bg-info-bg border-l-2 border-l-primary' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-md flex items-center justify-center text-[9px] font-700 shrink-0 mt-0.5 ${
                      dam.type === 'Earthen Embankment'
                        ? 'bg-warning-bg text-warning'
                        : dam.type === 'Concrete Gravity'
                          ? 'bg-info-bg text-primary'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {dam.type === 'Earthen Embankment'
                      ? 'EMB'
                      : dam.type === 'Concrete Gravity'
                        ? 'CG'
                        : 'AR'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-600 text-foreground truncate">{dam.name}</p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <StatusBadge variant={dam.hazardClass as 'high' | 'significant' | 'low'} />
                        {isSelected && <Check size={12} className="text-primary" />}
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {dam.river} · {dam.state}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        H:{dam.heightM}m
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {dam.storageGm3}Mm³
                      </span>
                      <span className="text-[10px] text-muted-foreground">{dam.type}</span>
                      {!dam.storageVerified && (
                        <span className="text-[9px] text-warning flex items-center gap-0.5">
                          <AlertTriangle size={8} /> unverified attrs
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: selected dam info + map preview */}
      <div className="space-y-4">
        {state.damId ? (
          (() => {
            const dam = damCatalog.find((d) => d.id === state.damId)!;
            return (
              <>
                <div className="wizard-card p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-600 text-foreground">{dam.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {dam.river} · {dam.state} · {dam.type}
                      </p>
                    </div>
                    <StatusBadge
                      variant={dam.hazardClass as 'high' | 'significant' | 'low'}
                      size="md"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Height', value: `${dam.heightM} m`, mono: true },
                      { label: 'Crest Length', value: `${dam.crestLengthM} m`, mono: true },
                      { label: 'Gross Storage', value: `${dam.storageGm3} Mm³`, mono: true },
                      { label: 'FRL', value: `${dam.frlM} m`, mono: true },
                      {
                        label: 'Catchment',
                        value: `${dam.catchmentKm2.toLocaleString('en-IN')} km²`,
                        mono: true,
                      },
                      { label: 'Year', value: String(dam.yearCompleted), mono: false },
                      { label: 'Basin', value: dam.basin, mono: false },
                      { label: 'CWC Region', value: dam.cwcRegion, mono: false },
                    ].map((attr) => (
                      <div key={`sel-${attr.label}`} className="p-2 bg-muted/30 rounded-md">
                        <p className="text-[10px] text-muted-foreground">{attr.label}</p>
                        <p
                          className={`text-xs font-600 text-foreground mt-0.5 ${attr.mono ? 'font-mono' : ''}`}
                        >
                          {attr.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  {!dam.storageVerified && (
                    <div className="mt-3 p-2 rounded-md bg-warning-bg border border-warning/30 flex items-start gap-2">
                      <AlertTriangle size={12} className="text-warning mt-0.5 shrink-0" />
                      <p className="text-[10px] text-warning leading-relaxed">
                        Some attributes sourced from GeoDAR (unverified). Review and confirm before
                        running to ensure CWC-compliant breach parameters.
                      </p>
                    </div>
                  )}
                </div>

                {/* Mini map */}
                <div className="wizard-card overflow-hidden">
                  <div className="px-3 py-2 border-b border-border flex items-center justify-between">
                    <span className="text-xs font-600 text-foreground">Location Preview</span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {dam.lat}°N, {dam.lon}°E
                    </span>
                  </div>
                  <div
                    className="relative flex items-center justify-center"
                    style={{
                      height: '140px',
                      background: 'radial-gradient(ellipse at 50% 50%, #0d1929 0%, #0a0e1a 100%)',
                    }}
                  >
                    <svg className="absolute inset-0 w-full h-full opacity-10">
                      <defs>
                        <pattern
                          id="mini-grid"
                          width="30"
                          height="30"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 30 0 L 0 0 0 30"
                            fill="none"
                            stroke="var(--border)"
                            strokeWidth="0.5"
                          />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#mini-grid)" />
                    </svg>
                    <div className="relative z-10 flex flex-col items-center gap-1">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-background animate-pulse"
                        style={{
                          background:
                            dam.hazardClass === 'high'
                              ? 'var(--danger)'
                              : dam.hazardClass === 'significant'
                                ? 'var(--warning)'
                                : 'var(--success)',
                        }}
                      />
                      <p className="text-[10px] text-foreground font-600">{dam.name}</p>
                      <p className="text-[9px] text-muted-foreground">
                        {dam.district}, {dam.state}
                      </p>
                    </div>
                    <div className="absolute bottom-2 left-2 text-[9px] text-muted-foreground/60">
                      WGS84 EPSG:4326
                    </div>
                  </div>
                  <div className="px-3 py-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground">
                      Available DEMs: {dam.demSources.join(' · ')}
                    </p>
                  </div>
                </div>
              </>
            );
          })()
        ) : (
          <div className="wizard-card flex flex-col items-center justify-center py-16 text-center">
            <MapPin size={32} className="text-muted-foreground/40 mb-3" />
            <p className="text-sm font-600 text-foreground mb-1">No dam selected</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Select a dam from the catalog, or click a marker on the map to load its attributes.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {error && (
            <p className="text-xs text-danger flex items-center gap-1.5">
              <AlertTriangle size={12} /> {error}
            </p>
          )}
          <div className="ml-auto">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-600 rounded-md hover:opacity-90 active:scale-95 transition-all duration-150"
            >
              Next: Failure Mode
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
