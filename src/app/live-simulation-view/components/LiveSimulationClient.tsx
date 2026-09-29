'use client';
import React, { useState, useEffect, useCallback } from 'react';
import SimulationMap from './SimulationMap';
import SimulationControlPanel from './SimulationControlPanel';
import TimeSlider from './TimeSlider';
import RunSelector from './RunSelector';

export interface SimRun {
  id: string;
  damName: string;
  scenario: string;
  engine: string;
  engineVersion: string;
  demSource: string;
  status: 'running' | 'completed' | 'queued';
  progressPct: number;
  etaMin: number | null;
  startedAt: string;
  elapsedMin: number;
  cellCount: number;
  timestepS: number;
  currentTimestep: number;
  totalTimesteps: number;
  isReplay: boolean;
  runHash: string;
  peakQpM3s: number;
  maxDepthM: number;
  inundationKm2: number;
  popAtRisk: number;
  massErrorPct: number;
  cflMax: number;
}

const mockRuns: SimRun[] = [
  {
    id: 'RUN-2848',
    damName: 'Hirakud Dam',
    scenario: 'Controlled Release — 2011-type gate misoperation',
    engine: 'Native SWE-SPH',
    engineVersion: 'v1.8.0',
    demSource: 'Copernicus GLO-30 (30m)',
    status: 'running',
    progressPct: 67,
    etaMin: 8,
    startedAt: '2026-09-29T04:44:00Z',
    elapsedMin: 19,
    cellCount: 467000,
    timestepS: 0.42,
    currentTimestep: 1340,
    totalTimesteps: 2000,
    isReplay: false,
    runHash: 'sha256:a3f8c2e1d9b74a56',
    peakQpM3s: 62400,
    maxDepthM: 8.3,
    inundationKm2: 342,
    popAtRisk: 187400,
    massErrorPct: 0.018,
    cflMax: 0.48,
  },
  {
    id: 'RUN-2847',
    damName: 'Tehri Dam',
    scenario: 'Overtopping PMF — IS 11223 Class IV',
    engine: 'Native 2D-SWE (Delft3D-class, finite volume)',
    engineVersion: 'v2.3.1',
    demSource: 'Copernicus GLO-30 (30m)',
    status: 'completed',
    progressPct: 100,
    etaMin: null,
    startedAt: '2026-09-29T04:41:00Z',
    elapsedMin: 22,
    cellCount: 1840000,
    timestepS: 0.31,
    currentTimestep: 3600,
    totalTimesteps: 3600,
    isReplay: false,
    runHash: 'sha256:b7d1f4c8e2a09b33',
    peakQpM3s: 185400,
    maxDepthM: 18.7,
    inundationKm2: 1240,
    popAtRisk: 892000,
    massErrorPct: 0.004,
    cflMax: 0.47,
  },
  {
    id: 'RUN-2865',
    damName: 'Teesta-III Dam',
    scenario: 'GLOF reconstruction — South Lhonak Oct 2023',
    engine: 'Native 2D-SWE (Delft3D-class, finite volume)',
    engineVersion: 'v2.3.1',
    demSource: 'Copernicus GLO-30 (30m)',
    status: 'completed',
    progressPct: 100,
    etaMin: null,
    startedAt: '2026-09-28T14:22:00Z',
    elapsedMin: 31,
    cellCount: 284000,
    timestepS: 0.28,
    currentTimestep: 4320,
    totalTimesteps: 4320,
    isReplay: true,
    runHash: 'sha256:c9e3a1d7f5b28c44',
    peakQpM3s: 7820,
    maxDepthM: 14.2,
    inundationKm2: 87,
    popAtRisk: 24600,
    massErrorPct: 0.009,
    cflMax: 0.44,
  },
];

export default function LiveSimulationClient() {
  const [selectedRunId, setSelectedRunId] = useState('RUN-2848');
  const [currentTime, setCurrentTime] = useState(0.67);
  const [playing, setPlaying] = useState(false);
  const [particleView, setParticleView] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'depth' | 'velocity' | 'hazard' | 'arrival'>(
    'depth'
  );
  const [probeData, setProbeData] = useState<{
    x: number;
    y: number;
    depth: number;
    vel: number;
    arrival: number;
    hr: number;
  } | null>(null);

  const selectedRun = mockRuns.find((r) => r.id === selectedRunId) ?? mockRuns[0];

  // Simulate progress update for running runs
  useEffect(() => {
    if (selectedRun.status !== 'running') return;
    const interval = setInterval(() => {
      // BACKEND: Replace with Supabase realtime channel subscription for run progress
      // supabase.channel(`run-${selectedRunId}`).on('broadcast', { event: 'progress' }, handler)
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedRun.status, selectedRunId]);

  // Playback animation
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setCurrentTime((t) => {
        if (t >= 1) {
          setPlaying(false);
          return 1;
        }
        return Math.min(t + 0.005, 1);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [playing]);

  const handleMapProbe = useCallback((x: number, y: number) => {
    // BACKEND: Query run artifact raster at (x, y) for depth/velocity values
    setProbeData({
      x: Number(x.toFixed(3)),
      y: Number(y.toFixed(3)),
      depth: Number((Math.random() * 8 + 0.5).toFixed(2)),
      vel: Number((Math.random() * 3).toFixed(2)),
      arrival: Math.floor(Math.random() * 120 + 5),
      hr: Number((Math.random() * 4).toFixed(2)),
    });
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Run selector bar */}
      <RunSelector runs={mockRuns} selectedRunId={selectedRunId} onSelect={setSelectedRunId} />

      {/* Main area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <SimulationMap
            run={selectedRun}
            currentTime={currentTime}
            activeLayer={activeLayer}
            particleView={particleView}
            probeData={probeData}
            onProbe={handleMapProbe}
          />
        </div>

        {/* Right panel */}
        <div className="w-80 xl:w-96 shrink-0 border-l border-border bg-card/80 overflow-y-auto">
          <SimulationControlPanel
            run={selectedRun}
            currentTime={currentTime}
            playing={playing}
            setPlaying={setPlaying}
            particleView={particleView}
            setParticleView={setParticleView}
            activeLayer={activeLayer}
            setActiveLayer={setActiveLayer}
          />
        </div>
      </div>

      {/* Time slider */}
      <TimeSlider
        run={selectedRun}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        playing={playing}
        setPlaying={setPlaying}
      />
    </div>
  );
}
