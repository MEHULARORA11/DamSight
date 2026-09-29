'use client';
import React, { useState } from 'react';
import { Zap, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const engines = [
  {
    id: 'eng-native-fv',
    name: 'Native 2D-SWE',
    shortName: 'Native-FV',
    version: 'v2.3.1',
    status: 'online' as const,
    statusLabel: '✅ Ready',
    detail: 'HLLC · MUSCL · WebGPU fallback CPU',
    latencyMs: 12,
  },
  {
    id: 'eng-native-sph',
    name: 'Native SWE-SPH',
    shortName: 'Native-SPH',
    version: 'v1.8.0',
    status: 'online' as const,
    statusLabel: '✅ Ready',
    detail: 'Wendland kernel · CLL neighbour search',
    latencyMs: 18,
  },
  {
    id: 'eng-delft3d',
    name: 'Delft3D FM',
    shortName: 'Delft3D FM',
    version: 'N/A',
    status: 'warning' as const,
    statusLabel: '⚠ Not installed',
    detail: 'D3D_HOME not set · DIMR not found · hydrolib-core available',
    latencyMs: null,
  },
  {
    id: 'eng-dualsph',
    name: 'DualSPHysics',
    shortName: 'DualSPHysics',
    version: 'N/A',
    status: 'warning' as const,
    statusLabel: '⚠ Not installed',
    detail: 'CLI binary not found in PATH',
    latencyMs: null,
  },
  {
    id: 'eng-gee',
    name: 'Google Earth Engine',
    shortName: 'GEE',
    version: 'Python API 0.1.374',
    status: 'warning' as const,
    statusLabel: '⚠ Not authenticated',
    detail: 'Service account key not configured · STAC fallback active',
    latencyMs: null,
  },
];

export default function EngineHealthWidget() {
  const [expanded, setExpanded] = useState(false);
  const [probing, setProbing] = useState(false);

  const handleReprobe = () => {
    setProbing(true);
    setTimeout(() => setProbing(false), 1800);
    // BACKEND: GET /api/health/engines — returns real probe results
  };

  const onlineCount = engines.filter((e) => e.status === 'online').length;

  return (
    <div className="glass-panel rounded-lg overflow-hidden w-64 shadow-elevated">
      <button
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/20 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-primary" />
          <span className="text-xs font-600 text-foreground">Engine Health</span>
          <span className="text-[10px] font-600 px-1.5 py-0.5 rounded-md bg-success-bg text-success">
            {onlineCount}/{engines.length} online
          </span>
        </div>
        {expanded ? (
          <ChevronUp size={12} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={12} className="text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-border animate-fade-in-up">
          <div className="p-2 space-y-1">
            {engines.map((engine) => (
              <div
                key={engine.id}
                className="px-2 py-1.5 rounded-md hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`engine-status-dot ${
                      engine.status === 'online'
                        ? 'engine-online'
                        : engine.status === 'warning'
                          ? 'engine-warning'
                          : 'engine-offline'
                    }`}
                  />
                  <span className="text-xs font-500 text-foreground flex-1">
                    {engine.shortName}
                  </span>
                  <span className="text-[9px] font-mono text-muted-foreground">
                    {engine.version}
                  </span>
                  {engine.latencyMs && (
                    <span className="text-[9px] font-mono text-success">{engine.latencyMs}ms</span>
                  )}
                </div>
                <p className="text-[9px] text-muted-foreground mt-0.5 ml-4 leading-relaxed">
                  {engine.detail}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-border px-3 py-2 flex items-center justify-between">
            <p className="text-[9px] text-muted-foreground">GET /api/health/engines</p>
            <button
              onClick={handleReprobe}
              disabled={probing}
              className="flex items-center gap-1 text-[10px] text-primary hover:underline disabled:opacity-50"
            >
              <RefreshCw size={10} className={probing ? 'animate-spin' : ''} />
              Re-probe
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
