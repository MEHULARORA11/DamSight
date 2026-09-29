'use client';
import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Layers,
  Eye,
  Share2,
  AlertTriangle,
} from 'lucide-react';
import { type SimRun } from './LiveSimulationClient';
import dynamic from 'next/dynamic';
import StatusBadge from '@/components/ui/StatusBadge';

const HydrographChart = dynamic(() => import('./HydrographChart'), { ssr: false });
const CrossSectionChart = dynamic(() => import('./CrossSectionChart'), { ssr: false });
const BreachUncertaintyChart = dynamic(() => import('./BreachUncertaintyChart'), { ssr: false });

interface Props {
  run: SimRun;
  currentTime: number;
  playing: boolean;
  setPlaying: (v: boolean) => void;
  particleView: boolean;
  setParticleView: (v: boolean) => void;
  activeLayer: string;
  setActiveLayer: (l: 'depth' | 'velocity' | 'hazard' | 'arrival') => void;
}

const layers = [
  { id: 'layer-depth', value: 'depth', label: 'Max Depth' },
  { id: 'layer-velocity', value: 'velocity', label: 'Velocity' },
  { id: 'layer-hazard', value: 'hazard', label: 'Hazard (HR)' },
  { id: 'layer-arrival', value: 'arrival', label: 'Arrival Time' },
];

export default function SimulationControlPanel({
  run,
  currentTime,
  playing,
  setPlaying,
  particleView,
  setParticleView,
  activeLayer,
  setActiveLayer,
}: Props) {
  const simTimeHr = (currentTime * 6).toFixed(1);

  return (
    <div className="flex flex-col h-full">
      {/* Run info */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-600 text-primary">{run.id}</span>
              <StatusBadge variant={run.status as 'running' | 'completed'} />
              {run.isReplay && <span className="validation-badge recorded-run-badge">REPLAY</span>}
            </div>
            <p className="text-xs font-600 text-foreground mt-1 leading-tight">{run.damName}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
              {run.scenario}
            </p>
          </div>
        </div>
        <div className="mt-2 text-[9px] font-mono text-muted-foreground space-y-0.5">
          <p>
            Engine: {run.engine} {run.engineVersion}
          </p>
          <p>DEM: {run.demSource}</p>
          <p>Input hash: {run.runHash}</p>
        </div>
      </div>

      {/* Progress */}
      {run.status === 'running' && (
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-600 text-muted-foreground">Progress</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-700 text-primary">{run.progressPct}%</span>
              {run.etaMin && (
                <span className="text-[10px] text-muted-foreground">ETA {run.etaMin} min</span>
              )}
            </div>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full progress-bar-fill rounded-full transition-all duration-500"
              style={{ width: `${run.progressPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-[9px] font-mono text-muted-foreground">
            <span>
              Step {run.currentTimestep.toLocaleString('en-IN')} /{' '}
              {run.totalTimesteps.toLocaleString('en-IN')}
            </span>
            <span>
              Δt = {run.timestepS}s · CFL ≤ {run.cflMax}
            </span>
          </div>
        </div>
      )}

      {/* Playback controls */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-600 text-muted-foreground">Playback</span>
          <span className="text-[10px] font-mono text-foreground">T = {simTimeHr} hr</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {}}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
            title="Jump to start"
          >
            <SkipBack size={16} />
          </button>
          <button
            onClick={() => setPlaying(!playing)}
            className="p-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 active:scale-95 transition-all duration-150"
            title={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={() => {}}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
            title="Jump to end"
          >
            <SkipForward size={16} />
          </button>
        </div>
      </div>

      {/* Layer selector */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-1.5 mb-2">
          <Layers size={12} className="text-muted-foreground" />
          <span className="text-[11px] font-600 text-muted-foreground">Map Layer</span>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() =>
                setActiveLayer(layer.value as 'depth' | 'velocity' | 'hazard' | 'arrival')
              }
              className={`py-1.5 px-2 rounded text-[10px] font-600 transition-all duration-150 ${
                activeLayer === layer.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
        <div className="mt-2">
          <button
            onClick={() => setParticleView(!particleView)}
            className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-[10px] font-600 border transition-all duration-150 ${
              particleView
                ? 'bg-info-bg border-primary text-primary'
                : 'bg-muted border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Eye size={11} />
            SPH Particle View
          </button>
          {particleView && (
            <p className="text-[9px] text-muted-foreground mt-1 text-center">
              Near-field breach jet · 120k particles · Same solver state
            </p>
          )}
        </div>
      </div>

      {/* Live metrics */}
      <div className="px-4 py-3 border-b border-border">
        <p className="text-[11px] font-600 text-muted-foreground mb-2">Live Metrics</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              label: 'Peak Q_p',
              value: `${(run.peakQpM3s / 1000).toFixed(1)}k`,
              unit: 'm³/s',
              color: 'text-danger',
            },
            {
              label: 'Max Depth',
              value: run.maxDepthM.toFixed(1),
              unit: 'm',
              color: 'text-warning',
            },
            {
              label: 'Inundation',
              value: run.inundationKm2.toFixed(0),
              unit: 'km²',
              color: 'text-primary',
            },
            {
              label: 'Pop at Risk',
              value: (run.popAtRisk / 1000).toFixed(0) + 'k',
              unit: '',
              color: 'text-accent',
            },
          ].map((metric) => (
            <div key={`metric-${metric.label}`} className="p-2 bg-muted/30 rounded-md">
              <p className="text-[9px] text-muted-foreground">{metric.label}</p>
              <div className="flex items-baseline gap-0.5">
                <span className={`text-sm font-700 font-mono tabular-nums ${metric.color}`}>
                  {metric.value}
                </span>
                {metric.unit && (
                  <span className="text-[9px] text-muted-foreground">{metric.unit}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between text-[9px] font-mono">
          <span className="text-muted-foreground">
            Mass err: <span className="text-success">{run.massErrorPct.toFixed(3)}%</span>
          </span>
          <span className="text-muted-foreground">
            Cells: <span className="text-foreground">{(run.cellCount / 1000).toFixed(0)}k</span>
          </span>
        </div>
      </div>

      {/* Charts */}
      <div className="flex-1 overflow-y-auto">
        {/* Hydrograph */}
        <div className="px-4 py-3 border-b border-border">
          <p className="text-[11px] font-600 text-muted-foreground mb-2">Breach Hydrograph</p>
          <HydrographChart currentTime={currentTime} peakQ={run.peakQpM3s} />
        </div>

        {/* Cross section */}
        <div className="px-4 py-3 border-b border-border">
          <p className="text-[11px] font-600 text-muted-foreground mb-2">Cross-Section Profile</p>
          <CrossSectionChart currentTime={currentTime} />
        </div>

        {/* Breach uncertainty */}
        <div className="px-4 py-3 border-b border-border">
          <p className="text-[11px] font-600 text-muted-foreground mb-1">
            Breach Uncertainty (P50/P90/P99)
          </p>
          <p className="text-[9px] text-muted-foreground mb-2">Monte Carlo N=200 · Fast 1D path</p>
          <BreachUncertaintyChart peakQ={run.peakQpM3s} />
        </div>

        {/* Exports */}
        <div className="px-4 py-3 border-b border-border">
          <p className="text-[11px] font-600 text-muted-foreground mb-2">Export Results</p>
          <div className="grid grid-cols-3 gap-1">
            {['.shp', '.kml', '.tif', '.nc', '.csv', 'PDF'].map((fmt) => (
              <button
                key={`export-${fmt}`}
                className="py-1.5 text-[10px] font-600 rounded bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all duration-150"
                title={`Export as ${fmt}`}
              >
                {fmt}
              </button>
            ))}
          </div>
          {/* BACKEND: GET /api/runs/:id/export?format=shp|kml|geojson|tif|pdf */}
        </div>

        {/* Share */}
        <div className="px-4 py-3">
          <button className="w-full flex items-center justify-center gap-2 py-2 border border-border rounded-md text-xs font-600 text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-all duration-150">
            <Share2 size={13} />
            Share Bookmarked URL
          </button>
          <div className="mt-3 p-2 rounded bg-warning-bg/30 border border-warning/20">
            <div className="flex items-start gap-1.5">
              <AlertTriangle size={10} className="text-warning mt-0.5 shrink-0" />
              <p className="text-[9px] text-warning leading-relaxed">
                Advisory: Decision-support estimate. Not a substitute for a Tier-3 study by a
                qualified dam-safety engineer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
