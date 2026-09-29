'use client';
import React from 'react';
import { type SimRun } from './LiveSimulationClient';
import StatusBadge from '@/components/ui/StatusBadge';
import { AlertTriangle } from 'lucide-react';

interface Props {
  runs: SimRun[];
  selectedRunId: string;
  onSelect: (id: string) => void;
}

export default function RunSelector({ runs, selectedRunId, onSelect }: Props) {
  return (
    <div className="border-b border-border bg-card/80 px-4 py-2 flex items-center gap-3 overflow-x-auto shrink-0">
      <span className="text-[11px] font-600 text-muted-foreground uppercase tracking-wider shrink-0">
        Active Runs
      </span>
      {runs.map((run) => {
        const isSelected = run.id === selectedRunId;
        return (
          <button
            key={run.id}
            onClick={() => onSelect(run.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md border shrink-0 transition-all duration-150 ${
              isSelected
                ? 'border-primary bg-info-bg'
                : 'border-border hover:border-muted-foreground/40 hover:bg-muted/20'
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-mono font-600 ${isSelected ? 'text-primary' : 'text-foreground'}`}
                >
                  {run.id}
                </span>
                <StatusBadge variant={run.status as 'running' | 'completed' | 'queued'} />
                {run.isReplay && (
                  <span className="validation-badge recorded-run-badge">REPLAY</span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {run.damName} · {run.engine.split(' ')[0]}
              </p>
            </div>
            {run.status === 'running' && (
              <div className="flex items-center gap-1.5">
                <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full progress-bar-fill rounded-full"
                    style={{ width: `${run.progressPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-primary">{run.progressPct}%</span>
              </div>
            )}
          </button>
        );
      })}
      <div className="ml-auto shrink-0 flex items-center gap-1.5 text-[10px] text-warning">
        <AlertTriangle size={11} />
        <span>Decision-support only · Not a Tier-3 study</span>
      </div>
    </div>
  );
}
