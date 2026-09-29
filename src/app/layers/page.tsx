'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Layers, Eye, EyeOff, ChevronUp, ChevronDown, Sliders } from 'lucide-react';

interface Layer {
  id: string;
  name: string;
  group: string;
  visible: boolean;
  opacity: number;
  color: string;
  description: string;
}

const initialLayers: Layer[] = [
  {
    id: 'lyr-depth',
    name: 'Max Water Depth',
    group: 'Simulation',
    visible: true,
    opacity: 85,
    color: 'var(--primary)',
    description: 'Peak depth raster — colour-blind safe ramp (Defra FD2320)',
  },
  {
    id: 'lyr-velocity',
    name: 'Max Velocity',
    group: 'Simulation',
    visible: false,
    opacity: 75,
    color: 'var(--accent)',
    description: 'Peak velocity magnitude (m/s)',
  },
  {
    id: 'lyr-hazard',
    name: 'Hazard Rating (HR)',
    group: 'Simulation',
    visible: false,
    opacity: 80,
    color: 'var(--warning)',
    description: 'HR = d·(v+0.5)+DF — Defra FD2320/2321',
  },
  {
    id: 'lyr-arrival',
    name: 'Arrival Time',
    group: 'Simulation',
    visible: true,
    opacity: 70,
    color: 'var(--success)',
    description: 'First depth > 0.1m isochrones (minutes)',
  },
  {
    id: 'lyr-wavefront',
    name: 'Wave Front',
    group: 'Simulation',
    visible: true,
    opacity: 90,
    color: 'var(--danger)',
    description: 'Animated flood wavefront tracker',
  },
  {
    id: 'lyr-population',
    name: 'Population (WorldPop)',
    group: 'Exposure',
    visible: true,
    opacity: 60,
    color: 'var(--accent)',
    description: 'WorldPop 100m population density',
  },
  {
    id: 'lyr-buildings',
    name: 'Buildings (Open Buildings)',
    group: 'Exposure',
    visible: false,
    opacity: 70,
    color: 'var(--warning)',
    description: 'Google Open Buildings v3 footprints',
  },
  {
    id: 'lyr-roads',
    name: 'Roads & Bridges (OSM)',
    group: 'Exposure',
    visible: true,
    opacity: 65,
    color: 'var(--muted-foreground)',
    description: 'OpenStreetMap road network',
  },
  {
    id: 'lyr-s1-flood',
    name: 'S1 Observed Flood Extent',
    group: 'NRT',
    visible: false,
    opacity: 75,
    color: 'var(--info)',
    description: 'Sentinel-1 change detection flood extent',
  },
  {
    id: 'lyr-jrc-water',
    name: 'JRC Permanent Water',
    group: 'NRT',
    visible: false,
    opacity: 50,
    color: 'var(--primary)',
    description: 'JRC Global Surface Water permanent water mask',
  },
  {
    id: 'lyr-dem-hillshade',
    name: 'DEM Hillshade',
    group: 'Basemap',
    visible: true,
    opacity: 40,
    color: 'var(--muted-foreground)',
    description: 'Copernicus GLO-30 hillshade for terrain context',
  },
  {
    id: 'lyr-osm-base',
    name: 'OSM Basemap',
    group: 'Basemap',
    visible: true,
    opacity: 100,
    color: 'var(--muted-foreground)',
    description: 'OpenStreetMap tiles — no key required',
  },
];

const groups = ['Simulation', 'Exposure', 'NRT', 'Basemap'];

export default function LayersPage() {
  const [layers, setLayers] = useState<Layer[]>(initialLayers);

  const toggleVisible = (id: string) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)));
  };

  const setOpacity = (id: string, val: number) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, opacity: val } : l)));
  };

  const moveLayer = (id: string, dir: 'up' | 'down') => {
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx < 0) return prev;
      const newIdx = dir === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  };

  return (
    <AppLayout activePath="/layers">
      <div className="flex flex-col h-full overflow-hidden bg-background">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <Layers size={20} className="text-primary" />
            <div>
              <h1 className="text-base font-700 text-foreground">Layer Manager</h1>
              <p className="text-xs text-muted-foreground">
                Toggle visibility · Adjust opacity · Reorder layers · Colour-blind safe depth ramp
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {groups.map((group) => {
            const groupLayers = layers.filter((l) => l.group === group);
            return (
              <div key={group}>
                <p className="text-[10px] font-700 uppercase tracking-wider text-muted-foreground mb-2">
                  {group}
                </p>
                <div className="space-y-2">
                  {groupLayers.map((layer) => (
                    <div
                      key={layer.id}
                      className={`bg-card border rounded-lg p-3 transition-all ${layer.visible ? 'border-border' : 'border-border opacity-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Colour swatch */}
                        <div
                          className="w-3 h-3 rounded-sm shrink-0"
                          style={{ background: layer.color, opacity: layer.opacity / 100 }}
                        />

                        {/* Name + desc */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-600 text-foreground">{layer.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {layer.description}
                          </p>
                        </div>

                        {/* Opacity */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Sliders size={11} className="text-muted-foreground" />
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={layer.opacity}
                            onChange={(e) => setOpacity(layer.id, Number(e.target.value))}
                            className="w-16 accent-primary cursor-pointer"
                            disabled={!layer.visible}
                          />
                          <span className="text-[10px] font-mono text-muted-foreground w-7 text-right">
                            {layer.opacity}%
                          </span>
                        </div>

                        {/* Reorder */}
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <button
                            onClick={() => moveLayer(layer.id, 'up')}
                            className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-all"
                          >
                            <ChevronUp size={12} />
                          </button>
                          <button
                            onClick={() => moveLayer(layer.id, 'down')}
                            className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-all"
                          >
                            <ChevronDown size={12} />
                          </button>
                        </div>

                        {/* Visibility toggle */}
                        <button
                          onClick={() => toggleVisible(layer.id)}
                          className={`p-1.5 rounded-md transition-all ${layer.visible ? 'text-primary hover:text-primary/80' : 'text-muted-foreground hover:text-foreground'}`}
                          title={layer.visible ? 'Hide layer' : 'Show layer'}
                        >
                          {layer.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
