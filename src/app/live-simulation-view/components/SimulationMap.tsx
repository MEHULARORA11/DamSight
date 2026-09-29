'use client';
import React, { useState, useRef } from 'react';
import { type SimRun } from './LiveSimulationClient';
import { MapPin, Crosshair, Layers, Ruler, Bookmark } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';

interface Props {
  run: SimRun;
  currentTime: number;
  activeLayer: string;
  particleView: boolean;
  probeData: {
    x: number;
    y: number;
    depth: number;
    vel: number;
    arrival: number;
    hr: number;
  } | null;
  onProbe: (x: number, y: number) => void;
}

// Isochrone labels for demo
const isochrones = [
  { id: 'iso-30', label: '30 min', x: '20%', y: '35%', color: 'var(--warning)' },
  { id: 'iso-60', label: '1 hr', x: '35%', y: '48%', color: 'var(--accent)' },
  { id: 'iso-120', label: '2 hr', x: '52%', y: '58%', color: 'var(--danger)' },
  { id: 'iso-180', label: '3 hr', x: '68%', y: '65%', color: 'var(--danger)' },
];

const villages = [
  {
    id: 'vil-sambalpur',
    name: 'Sambalpur',
    x: '38%',
    y: '44%',
    pop: 185000,
    arrivalMin: 42,
    depth: 3.2,
    status: 'at-risk',
  },
  {
    id: 'vil-bargarh',
    name: 'Bargarh',
    x: '28%',
    y: '55%',
    pop: 98000,
    arrivalMin: 87,
    depth: 1.8,
    status: 'at-risk',
  },
  {
    id: 'vil-jharsuguda',
    name: 'Jharsuguda',
    x: '55%',
    y: '38%',
    pop: 120000,
    arrivalMin: 118,
    depth: 0.9,
    status: 'warning',
  },
  {
    id: 'vil-sonepur',
    name: 'Sonepur',
    x: '48%',
    y: '62%',
    pop: 45000,
    arrivalMin: 156,
    depth: 0.4,
    status: 'safe',
  },
];

export default function SimulationMap({
  run,
  currentTime,
  activeLayer,
  particleView,
  probeData,
  onProbe,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [hoveredVillage, setHoveredVillage] = useState<string | null>(null);

  const handleMapClick = (e: React.MouseEvent) => {
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 360 - 180;
    const y = ((e.clientY - rect.top) / rect.height) * -180 + 90;
    onProbe(x, y);
  };

  const floodExtentOpacity = Math.min(currentTime * 1.2, 0.85);

  return (
    <div
      ref={mapRef}
      className="w-full h-full relative overflow-hidden cursor-crosshair"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #0a1628 0%, #0a0e1a 100%)' }}
      onClick={handleMapClick}
    >
      {/* BACKEND: Replace with MapLibre GL JS map with deck.gl FloodLayer for animated inundation */}

      {/* Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <defs>
          <pattern id="sim-grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="var(--border)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sim-grid)" />
      </svg>

      {/* River network */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
        <path
          d="M 50,20 Q 150,80 200,180 Q 250,280 300,380 Q 350,480 400,560 Q 450,640 500,700"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeDasharray="6 3"
        />
        <path
          d="M 200,180 Q 280,200 360,190 Q 440,180 520,210"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
      </svg>

      {/* Flood inundation layer */}
      {!particleView && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <radialGradient id="flood-gradient" cx="35%" cy="42%" r="40%">
              <stop offset="0%" stopColor="var(--depth-5)" stopOpacity={floodExtentOpacity * 0.9} />
              <stop
                offset="25%"
                stopColor="var(--depth-4)"
                stopOpacity={floodExtentOpacity * 0.75}
              />
              <stop
                offset="50%"
                stopColor="var(--depth-3)"
                stopOpacity={floodExtentOpacity * 0.6}
              />
              <stop
                offset="75%"
                stopColor="var(--depth-2)"
                stopOpacity={floodExtentOpacity * 0.4}
              />
              <stop offset="100%" stopColor="var(--depth-1)" stopOpacity={0} />
            </radialGradient>
          </defs>
          <ellipse
            cx="35%"
            cy="45%"
            rx={`${Math.min(currentTime * 35, 30)}%`}
            ry={`${Math.min(currentTime * 28, 24)}%`}
            fill="url(#flood-gradient)"
          />
        </svg>
      )}

      {/* Particle view mode */}
      {particleView && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {Array.from({ length: 120 }).map((_, i) => {
            const px = 15 + (i % 20) * 3.5 + ((i * 0.7) % 8);
            const py = 20 + Math.floor(i / 20) * 5 + ((i * 0.4) % 6);
            const speed = 0.3 + (i % 10) * 0.2;
            const color =
              speed > 2 ? 'var(--danger)' : speed > 1 ? 'var(--accent)' : 'var(--primary)';
            return (
              <circle
                key={`particle-${i}`}
                cx={`${px}%`}
                cy={`${py + currentTime * 20}%`}
                r="2"
                fill={color}
                opacity={0.7 + (i % 3) * 0.1}
              />
            );
          })}
          <text
            x="10"
            y="20"
            fill="var(--muted-foreground)"
            fontSize="10"
            fontFamily="var(--font-mono)"
          >
            SPH particles: 120k · Near-field breach jet · {run.engine}
          </text>
        </svg>
      )}

      {/* Isochrone lines */}
      {isochrones.map((iso) => (
        <div
          key={iso.id}
          className="absolute pointer-events-none"
          style={{ left: iso.x, top: iso.y }}
        >
          <div
            className="px-1.5 py-0.5 rounded text-[9px] font-700 font-mono"
            style={{
              background: 'rgba(10,14,26,0.85)',
              border: `1px solid ${iso.color}`,
              color: iso.color,
            }}
          >
            {iso.label}
          </div>
        </div>
      ))}

      {/* Village markers */}
      {villages.map((vil) => {
        const isHovered = hoveredVillage === vil.id;
        const markerColor =
          vil.status === 'at-risk'
            ? 'var(--danger)'
            : vil.status === 'warning'
              ? 'var(--warning)'
              : 'var(--success)';
        const showVillage = vil.arrivalMin / 180 <= currentTime * 1.2 + 0.1;

        if (!showVillage) return null;

        return (
          <div
            key={vil.id}
            className="absolute cursor-pointer"
            style={{ left: vil.x, top: vil.y }}
            onMouseEnter={() => setHoveredVillage(vil.id)}
            onMouseLeave={() => setHoveredVillage(null)}
          >
            <div className="relative">
              <MapPin size={16} style={{ color: markerColor }} />
              <div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping"
                style={{ background: markerColor, opacity: 0.4 }}
              />
            </div>
            {isHovered && (
              <div className="absolute left-5 top-0 z-30 map-probe-tooltip whitespace-nowrap">
                <p className="font-600 text-foreground">{vil.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  Pop: {vil.pop.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px]" style={{ color: markerColor }}>
                  Arrival: {vil.arrivalMin} min · Depth: {vil.depth}m
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Probe result */}
      {probeData && (
        <div className="absolute z-20 map-probe-tooltip" style={{ left: '60%', top: '30%' }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Crosshair size={10} className="text-primary" />
            <span className="text-[10px] font-600 text-foreground">Probe</span>
            <span className="text-[9px] font-mono text-muted-foreground">
              {probeData.x}°E, {probeData.y}°N
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <span className="text-[10px] text-muted-foreground">Depth</span>
            <span className="text-[10px] font-mono text-primary">{probeData.depth} m</span>
            <span className="text-[10px] text-muted-foreground">Velocity</span>
            <span className="text-[10px] font-mono text-primary">{probeData.vel} m/s</span>
            <span className="text-[10px] text-muted-foreground">Arrival</span>
            <span className="text-[10px] font-mono text-primary">{probeData.arrival} min</span>
            <span className="text-[10px] text-muted-foreground">HR</span>
            <span className="text-[10px] font-mono text-warning">{probeData.hr}</span>
          </div>
        </div>
      )}

      {/* Map controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1">
        {[
          { icon: Layers, label: 'Layer manager', key: 'map-layers' },
          { icon: Ruler, label: 'Measure tool', key: 'map-measure' },
          { icon: Bookmark, label: 'Bookmark view', key: 'map-bookmark' },
        ].map(({ icon: Icon, label, key }) => (
          <button
            key={key}
            className="p-2 glass-panel rounded-md text-muted-foreground hover:text-foreground transition-all duration-150"
            aria-label={label}
            title={label}
          >
            <Icon size={14} />
          </button>
        ))}
      </div>

      {/* Depth legend */}
      <div className="absolute bottom-3 left-3 glass-panel rounded-md p-2.5">
        <p className="text-[9px] font-600 text-muted-foreground uppercase tracking-wider mb-1.5">
          {activeLayer === 'depth'
            ? 'Water Depth (m)'
            : activeLayer === 'velocity'
              ? 'Velocity (m/s)'
              : activeLayer === 'hazard'
                ? 'Hazard Rating (HR)'
                : 'Arrival Time (min)'}
        </p>
        <div className="depth-ramp-bar h-2 w-32 rounded-sm mb-1" />
        <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
          <span>0</span>
          <span>
            {activeLayer === 'depth'
              ? '5'
              : activeLayer === 'velocity'
                ? '3'
                : activeLayer === 'hazard'
                  ? '2'
                  : '60'}
          </span>
          <span>
            {activeLayer === 'depth'
              ? '10+'
              : activeLayer === 'velocity'
                ? '6+'
                : activeLayer === 'hazard'
                  ? '4+'
                  : '180+'}
          </span>
        </div>
        <p className="text-[9px] text-muted-foreground mt-1">Colour-blind safe · Defra FD2320</p>
      </div>

      {/* Engine badge */}
      <div className="absolute top-3 left-3 glass-panel rounded-md px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="engine-status-dot engine-online" />
          <div>
            <p className="text-[10px] font-600 text-foreground">{run.engine}</p>
            <p className="text-[9px] font-mono text-muted-foreground">
              {run.engineVersion} · {run.demSource}
            </p>
          </div>
        </div>
        {run.isReplay && (
          <div className="mt-1.5">
            <span className="validation-badge recorded-run-badge">
              Recorded run (replay) · {run.id}
            </span>
          </div>
        )}
      </div>

      {/* CRS info */}
      <div className="absolute bottom-3 right-3 text-[9px] font-mono text-muted-foreground/60">
        WGS84 EPSG:4326 · UTM 44N compute · EGM2008 vertical
      </div>
    </div>
  );
}
