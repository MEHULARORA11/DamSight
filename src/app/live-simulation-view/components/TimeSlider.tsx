'use client';
import React, { useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Clock } from 'lucide-react';
import { type SimRun } from './LiveSimulationClient';

interface Props {
  run: SimRun;
  currentTime: number;
  setCurrentTime: (t: number) => void;
  playing: boolean;
  setPlaying: (v: boolean) => void;
}

const timeMarkers = [
  { id: 'tm-0', label: 'T=0', pct: 0 },
  { id: 'tm-30', label: '30m', pct: 0.083 },
  { id: 'tm-1h', label: '1h', pct: 0.167 },
  { id: 'tm-2h', label: '2h', pct: 0.333 },
  { id: 'tm-3h', label: '3h', pct: 0.5 },
  { id: 'tm-4h', label: '4h', pct: 0.667 },
  { id: 'tm-5h', label: '5h', pct: 0.833 },
  { id: 'tm-6h', label: '6h', pct: 1.0 },
];

export default function TimeSlider({
  run,
  currentTime,
  setCurrentTime,
  playing,
  setPlaying,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const simTimeHr = (currentTime * 6).toFixed(2);
  const simTimeMin = Math.floor(currentTime * 360);

  const handleTrackClick = (e: React.MouseEvent) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const t = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setCurrentTime(t);
  };

  const handleTrackMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 1) return;
    handleTrackClick(e);
  };

  return (
    <div className="border-t border-border bg-card/90 px-4 py-3 shrink-0">
      <div className="flex items-center gap-4">
        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setCurrentTime(0)}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
            title="Jump to start"
          >
            <SkipBack size={14} />
          </button>
          <button
            onClick={() => setPlaying(!playing)}
            className="p-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 active:scale-95 transition-all duration-150"
            title={playing ? 'Pause simulation' : 'Play simulation'}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={() => setCurrentTime(1)}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
            title="Jump to end"
          >
            <SkipForward size={14} />
          </button>
        </div>

        {/* Time display */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Clock size={13} className="text-muted-foreground" />
          <span className="text-xs font-mono font-700 text-primary tabular-nums">
            T = {simTimeHr} hr
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">({simTimeMin} min)</span>
        </div>

        {/* Track */}
        <div className="flex-1 relative">
          {/* Time markers */}
          <div className="flex justify-between mb-1">
            {timeMarkers.map((marker) => (
              <span key={marker.id} className="text-[9px] font-mono text-muted-foreground/60">
                {marker.label}
              </span>
            ))}
          </div>

          {/* Slider track */}
          <div
            ref={trackRef}
            className="relative w-full h-3 cursor-pointer"
            onClick={handleTrackClick}
            onMouseMove={handleTrackMouseMove}
          >
            <div className="absolute inset-y-1 w-full time-slider-track" />
            <div
              className="absolute inset-y-1 time-slider-fill"
              style={{ width: `${currentTime * 100}%` }}
            />
            {/* Village arrival markers */}
            {[
              {
                id: 'vil-marker-sambalpur',
                label: 'Sambalpur',
                pct: 0.083 * 0.7,
                color: 'var(--danger)',
              },
              {
                id: 'vil-marker-bargarh',
                label: 'Bargarh',
                pct: 0.083 * 1.45,
                color: 'var(--danger)',
              },
              {
                id: 'vil-marker-jharsuguda',
                label: 'Jharsuguda',
                pct: 0.083 * 1.97,
                color: 'var(--warning)',
              },
              {
                id: 'vil-marker-sonepur',
                label: 'Sonepur',
                pct: 0.083 * 2.6,
                color: 'var(--success)',
              },
            ].map((vm) => (
              <div
                key={vm.id}
                className="absolute top-0 -translate-x-1/2 group"
                style={{ left: `${vm.pct * 100}%` }}
              >
                <div className="w-1 h-3" style={{ background: vm.color }} />
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap"
                    style={{
                      background: 'rgba(10,14,26,0.9)',
                      border: `1px solid ${vm.color}`,
                      color: vm.color,
                    }}
                  >
                    {vm.label}
                  </div>
                </div>
              </div>
            ))}
            {/* Playhead */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background shadow-glow-primary cursor-grab active:cursor-grabbing"
              style={{ left: `${currentTime * 100}%` }}
            />
          </div>

          {/* Run info below */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-[9px] text-muted-foreground font-mono">
              {run.engine} · {run.engineVersion} · {run.demSource}
            </span>
            {run.isReplay && (
              <span className="text-[9px] text-warning font-mono">
                Recorded run (replay) · {run.id}
              </span>
            )}
            <span className="text-[9px] text-muted-foreground font-mono">
              Step {Math.floor(currentTime * run.totalTimesteps).toLocaleString('en-IN')} /{' '}
              {run.totalTimesteps.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] text-muted-foreground">Speed:</span>
          {['0.5×', '1×', '2×', '4×'].map((speed) => (
            <button
              key={`speed-${speed}`}
              className={`px-1.5 py-0.5 rounded text-[9px] font-600 font-mono transition-all duration-150 ${
                speed === '1×'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {speed}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
