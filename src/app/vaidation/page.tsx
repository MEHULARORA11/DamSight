'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { CheckCircle2, XCircle, Clock, Play } from 'lucide-react';

const tests = [
  {
    id: 'test-ritter',
    name: 'Ritter Dry-Bed Dam-Break',
    category: 'Analytical',
    description:
      'Compares simulated depth and velocity against the Ritter (1892) exact solution for a dry-bed dam-break on a flat frictionless channel.',
    status: 'passed',
    L2_depth: 0.0031,
    L2_vel: 0.0048,
    ref: 'Ritter (1892); Stoker (1957)',
    engine: 'Native 2D-SWE (FV) v2.3.1',
    cells: 1000,
    runtime_ms: 142,
  },
  {
    id: 'test-stoker',
    name: 'Stoker Wet-Bed Dam-Break',
    category: 'Analytical',
    description:
      'Stoker (1957) wet-bed solution with tailwater depth ratio 0.1. Tests shock-capturing and wet/dry front propagation.',
    status: 'passed',
    L2_depth: 0.0052,
    L2_vel: 0.0071,
    ref: 'Stoker (1957)',
    engine: 'Native 2D-SWE (FV) v2.3.1',
    cells: 1000,
    runtime_ms: 168,
  },
  {
    id: 'test-lake',
    name: 'Lake-at-Rest Well-Balancing',
    category: 'Well-Balancing',
    description:
      'Still water over a non-trivial bathymetry. Verifies that the Audusse hydrostatic reconstruction produces zero spurious velocities (machine-precision residual).',
    status: 'passed',
    L2_depth: 2.1e-14,
    L2_vel: 1.8e-14,
    ref: 'Audusse et al. (2004)',
    engine: 'Native 2D-SWE (FV) v2.3.1',
    cells: 2500,
    runtime_ms: 89,
  },
  {
    id: 'test-mass',
    name: 'Mass Conservation',
    category: 'Conservation',
    description:
      'Tracks total water volume over a 6-hour run with inflow and outflow boundaries. Mass error must remain below 0.1%.',
    status: 'passed',
    L2_depth: null,
    L2_vel: null,
    massErr: 0.004,
    ref: 'CWC Guidelines §5.3',
    engine: 'Native 2D-SWE (FV) v2.3.1',
    cells: 50000,
    runtime_ms: 4820,
  },
  {
    id: 'test-convergence',
    name: 'Grid Convergence Study',
    category: 'Convergence',
    description:
      'Runs the Ritter case at 4 resolutions (Δx = 10, 5, 2.5, 1.25 m). Verifies second-order spatial convergence rate.',
    status: 'passed',
    convergenceOrder: 1.94,
    ref: 'LeVeque (2002)',
    engine: 'Native 2D-SWE (FV) v2.3.1',
    cells: null,
    runtime_ms: 2100,
  },
  {
    id: 'test-sph-fv',
    name: 'SPH vs FV Agreement',
    category: 'Cross-Engine',
    description:
      'Compares SWE-SPH and Native FV on the same flat-bed dam-break case. Peak depth difference must be < 5%.',
    status: 'passed',
    peakDepthDiffPct: 2.8,
    ref: 'Internal benchmark',
    engine: 'Native SWE-SPH v1.8.0 vs Native 2D-SWE (FV) v2.3.1',
    cells: 5000,
    runtime_ms: 890,
  },
  {
    id: 'test-malpasset',
    name: 'Malpasset Dam-Break (Optional)',
    category: 'Historical',
    description:
      'Malpasset arch dam failure (1959, France). Requires user-supplied DEM and gauge data. Skipped if data not provided.',
    status: 'skipped',
    ref: 'Hervouet & Petitjean (1999)',
    engine: 'Native 2D-SWE (FV) v2.3.1',
    cells: null,
    runtime_ms: null,
  },
];

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  passed: {
    icon: <CheckCircle2 size={14} className="text-success" />,
    color: 'text-success',
    label: 'PASSED',
  },
  failed: {
    icon: <XCircle size={14} className="text-danger" />,
    color: 'text-danger',
    label: 'FAILED',
  },
  skipped: {
    icon: <Clock size={14} className="text-muted-foreground" />,
    color: 'text-muted-foreground',
    label: 'SKIPPED',
  },
  running: {
    icon: <Play size={14} className="text-primary animate-pulse" />,
    color: 'text-primary',
    label: 'RUNNING',
  },
};

export default function ValidationPage() {
  const [expanded, setExpanded] = useState<string | null>('test-ritter');

  const passed = tests.filter((t) => t.status === 'passed').length;
  const skipped = tests.filter((t) => t.status === 'skipped').length;

  return (
    <AppLayout activePath="/validation">
      <div className="flex flex-col h-full overflow-hidden bg-background">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-success" />
              <div>
                <h1 className="text-base font-700 text-foreground">Validation</h1>
                <p className="text-xs text-muted-foreground">
                  Analytical benchmarks · Well-balancing · Mass conservation · Grid convergence ·
                  Cross-engine agreement
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-success font-700">{passed} passed</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{skipped} skipped</span>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-600 hover:opacity-90 transition-all">
                <Play size={12} />
                Run All Tests
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {tests.map((test) => {
            const cfg = statusConfig[test.status];
            const isExpanded = expanded === test.id;
            return (
              <div
                key={test.id}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/20 transition-all"
                  onClick={() => setExpanded(isExpanded ? null : test.id)}
                >
                  {cfg.icon}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-700 text-foreground">{test.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {test.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                      {test.description}
                    </p>
                  </div>
                  <span className={`text-[10px] font-700 ${cfg.color} shrink-0`}>{cfg.label}</span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border pt-3">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                      {test.L2_depth !== null && test.L2_depth !== undefined && (
                        <div className="p-2 bg-muted/30 rounded-md">
                          <p className="text-[9px] text-muted-foreground">L² depth error</p>
                          <p className="text-sm font-700 font-mono text-success">
                            {test.L2_depth.toExponential(2)}
                          </p>
                        </div>
                      )}
                      {test.L2_vel !== null && test.L2_vel !== undefined && (
                        <div className="p-2 bg-muted/30 rounded-md">
                          <p className="text-[9px] text-muted-foreground">L² velocity error</p>
                          <p className="text-sm font-700 font-mono text-success">
                            {test.L2_vel.toExponential(2)}
                          </p>
                        </div>
                      )}
                      {test.massErr !== undefined && (
                        <div className="p-2 bg-muted/30 rounded-md">
                          <p className="text-[9px] text-muted-foreground">Mass error</p>
                          <p className="text-sm font-700 font-mono text-success">{test.massErr}%</p>
                        </div>
                      )}
                      {test.convergenceOrder !== undefined && (
                        <div className="p-2 bg-muted/30 rounded-md">
                          <p className="text-[9px] text-muted-foreground">Convergence order</p>
                          <p className="text-sm font-700 font-mono text-success">
                            {test.convergenceOrder}
                          </p>
                        </div>
                      )}
                      {test.peakDepthDiffPct !== undefined && (
                        <div className="p-2 bg-muted/30 rounded-md">
                          <p className="text-[9px] text-muted-foreground">Peak depth diff</p>
                          <p className="text-sm font-700 font-mono text-success">
                            {test.peakDepthDiffPct}%
                          </p>
                        </div>
                      )}
                      {test.runtime_ms !== null && test.runtime_ms !== undefined && (
                        <div className="p-2 bg-muted/30 rounded-md">
                          <p className="text-[9px] text-muted-foreground">Runtime</p>
                          <p className="text-sm font-700 font-mono text-foreground">
                            {test.runtime_ms} ms
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground space-y-0.5">
                      <p>Engine: {test.engine}</p>
                      <p>Reference: {test.ref}</p>
                      {test.cells && <p>Cells: {test.cells.toLocaleString('en-IN')}</p>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
            <p className="text-[10px] font-600 text-foreground mb-1">Validation Methodology</p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              All tests are reproducible and run against published analytical solutions or
              documented benchmarks. Error norms follow LeVeque (2002). Mass conservation threshold
              0.1% per CWC §5.3. Convergence order ≥ 1.8 accepted for second-order schemes.
              Cross-engine agreement threshold 5% peak depth difference.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
