'use client';
import React from 'react';
import {
  ChevronLeft,
  Play,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  FileJson,
  Copy,
} from 'lucide-react';
import { damCatalog, failureModes, demSources, engineOptions } from '@/lib/mockData';
import { type WizardState } from './ScenarioWizardClient';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'sonner';

interface Props {
  state: WizardState;
  update: (p: Partial<WizardState>) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

export default function Step5Review({ state, onBack, onSubmit, submitting }: Props) {
  const dam = damCatalog.find((d) => d.id === state.damId);
  const mode = failureModes.find((f) => f.id === state.failureMode);
  const dem = demSources.find((d) => d.id === state.demSource);
  const engines = engineOptions.filter((e) => state.engines.includes(e.id));

  const scenarioJson = {
    schemaVersion: '1.0.0',
    scenarioName: state.scenarioName || `${dam?.name} — ${mode?.label}`,
    dam: { id: dam?.id, name: dam?.name, river: dam?.river },
    failureMode: state.failureMode,
    floodClass: state.floodClass,
    terrain: {
      demSource: state.demSource,
      sinkFill: state.sinkFill,
      riverBurn: state.riverBurn,
      hydrologicEnforcement: state.hydrologicEnforcement,
      bridgeFlag: state.bridgeFlag,
    },
    engines: state.engines,
    resolution: `${state.resolution}m`,
    monteCarlo: state.monteCarlo ? { enabled: true, N: state.mcN } : { enabled: false },
    createdAt: '2026-09-29T05:03:52Z',
    createdBy: 'anjali.sharma@cwc.gov.in',
  };

  const handleCopyJson = () => {
    // BACKEND: This JSON is POST /api/scenarios body
    toast.success('Scenario JSON copied to clipboard');
  };

  const isValid = dam && mode && dem && engines.length > 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Review summary */}
      <div className="xl:col-span-2 space-y-4">
        <div className="wizard-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-600 text-foreground">Scenario Summary</h3>
            {isValid ? (
              <div className="flex items-center gap-1.5 text-success text-xs font-600">
                <CheckCircle2 size={14} />
                Ready to run
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-danger text-xs font-600">
                <AlertTriangle size={14} />
                Incomplete
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Dam */}
            <div className="p-3 bg-muted/30 rounded-md">
              <p className="text-[10px] font-600 text-muted-foreground uppercase tracking-wider mb-2">
                Dam
              </p>
              {dam ? (
                <>
                  <p className="text-xs font-600 text-foreground">{dam.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {dam.river} · {dam.state}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <StatusBadge variant={dam.hazardClass as 'high' | 'significant' | 'low'} />
                    <span className="text-[10px] font-mono text-muted-foreground">
                      H:{dam.heightM}m · {dam.storageGm3}Mm³
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-xs text-danger">Not selected</p>
              )}
            </div>

            {/* Failure mode */}
            <div className="p-3 bg-muted/30 rounded-md">
              <p className="text-[10px] font-600 text-muted-foreground uppercase tracking-wider mb-2">
                Failure Mode
              </p>
              {mode ? (
                <>
                  <p className="text-xs font-600 text-foreground">
                    {mode.icon} {mode.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{mode.cwcRef}</p>
                  {(state.failureMode === 'fm-piping' ||
                    state.failureMode === 'fm-overtopping') && (
                    <p className="text-[10px] text-primary mt-1">IDF: {state.floodClass}</p>
                  )}
                </>
              ) : (
                <p className="text-xs text-danger">Not selected</p>
              )}
            </div>

            {/* Terrain */}
            <div className="p-3 bg-muted/30 rounded-md">
              <p className="text-[10px] font-600 text-muted-foreground uppercase tracking-wider mb-2">
                Terrain & DEM
              </p>
              {dem ? (
                <>
                  <p className="text-xs font-600 text-foreground">{dem.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {dem.resolution} · {dem.coverage}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {state.sinkFill && (
                      <span className="text-[9px] bg-success-bg text-success px-1.5 py-0.5 rounded">
                        Sink Fill
                      </span>
                    )}
                    {state.riverBurn && (
                      <span className="text-[9px] bg-success-bg text-success px-1.5 py-0.5 rounded">
                        River Burn
                      </span>
                    )}
                    {state.hydrologicEnforcement && (
                      <span className="text-[9px] bg-success-bg text-success px-1.5 py-0.5 rounded">
                        Hydro Enforce
                      </span>
                    )}
                    {state.bridgeFlag && (
                      <span className="text-[9px] bg-info-bg text-primary px-1.5 py-0.5 rounded">
                        Bridge Flag
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-xs text-danger">Not selected</p>
              )}
            </div>

            {/* Engines */}
            <div className="p-3 bg-muted/30 rounded-md">
              <p className="text-[10px] font-600 text-muted-foreground uppercase tracking-wider mb-2">
                Engines & Resolution
              </p>
              <div className="space-y-1">
                {engines.map((eng) => (
                  <div key={`rev-eng-${eng.id}`} className="flex items-center gap-1.5">
                    <span className="engine-status-dot engine-online" />
                    <span className="text-xs font-500 text-foreground">{eng.shortName}</span>
                    <span className="text-[9px] font-mono text-muted-foreground">
                      {eng.version}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                Grid: {state.resolution}m ·{' '}
                {state.monteCarlo ? `Monte Carlo N=${state.mcN}` : 'Deterministic'}
              </p>
            </div>
          </div>

          {/* Breach params summary */}
          {dam && mode && (
            <div className="mt-4 p-3 bg-muted/20 rounded-md border border-border">
              <p className="text-[10px] font-600 text-muted-foreground uppercase tracking-wider mb-2">
                Breach Parameters (Froehlich 2016/17)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'B_avg', value: `${dam.breachBavgM} m` },
                  { label: 't_f', value: `${dam.breachTfMin} min` },
                  { label: 'Q_p', value: `${dam.peakQpM3s.toLocaleString('en-IN')} m³/s` },
                  { label: 'Q_p 1995', value: `${dam.qp1995M3s.toLocaleString('en-IN')} m³/s` },
                ].map((item) => (
                  <div key={`rev-breach-${item.label}`} className="text-center">
                    <p className="text-[10px] text-muted-foreground">{item.label}</p>
                    <p className="text-xs font-mono font-700 text-primary">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Provenance chain */}
        <div className="wizard-card p-4">
          <h3 className="text-sm font-600 text-foreground mb-3">Provenance Chain</h3>
          <p className="text-[10px] text-muted-foreground mb-3">
            Every result card in the simulation output will show this chain. Required by DamSight
            truth-labelling policy.
          </p>
          <div className="space-y-1.5 font-mono text-[10px]">
            {[
              { label: 'Engine', value: engines.map((e) => `${e.name} ${e.version}`).join(' + ') },
              { label: 'DEM Source', value: `${dem?.name} (${dem?.resolution})` },
              { label: 'Breach Method', value: 'Froehlich 2016/17 · CWC Guidelines 2018' },
              { label: 'Input Hash', value: 'sha256:pending (computed on submit)' },
              { label: 'CRS', value: 'WGS84 EPSG:4326 exchange · UTM 44N compute' },
              { label: 'Vertical Datum', value: 'EGM2008 geoid (DEM-native)' },
              { label: 'Run Type', value: 'Live run (not recorded replay)' },
            ].map((item) => (
              <div key={`prov-${item.label}`} className="flex gap-2">
                <span className="text-muted-foreground w-28 shrink-0">{item.label}:</span>
                <span className="text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: JSON preview + submit */}
      <div className="space-y-4">
        {/* Scenario JSON */}
        <div className="wizard-card overflow-hidden">
          <div className="px-3 py-2.5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileJson size={14} className="text-primary" />
              <span className="text-xs font-600 text-foreground">Scenario JSON</span>
            </div>
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1 text-[10px] text-primary hover:underline"
            >
              <Copy size={10} />
              Copy
            </button>
          </div>
          <div className="p-3 overflow-x-auto">
            <pre className="text-[9px] font-mono text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {JSON.stringify(scenarioJson, null, 2)}
            </pre>
          </div>
          <div className="px-3 py-2 border-t border-border">
            <p className="text-[9px] text-muted-foreground">
              POST /api/scenarios — versioned, shareable, diff-able
            </p>
          </div>
        </div>

        {/* Warnings */}
        {dam && !dam.storageVerified && (
          <div className="p-3 rounded-md bg-warning-bg border border-warning/30">
            <div className="flex items-start gap-2">
              <AlertTriangle size={12} className="text-warning mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-600 text-warning">Unverified dam attributes</p>
                <p className="text-[10px] text-warning/80 mt-0.5">
                  Storage and catchment area sourced from GeoDAR (not user-verified). Breach
                  parameters may be inaccurate. Confirm values before operational use.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="wizard-card p-4">
          <h3 className="text-sm font-600 text-foreground mb-1">Queue Simulation Run</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Run will be queued immediately. Monitor progress in Live Simulation View.
          </p>
          <button
            onClick={onSubmit}
            disabled={!isValid || submitting}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground text-sm font-600 rounded-md hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Submitting scenario…
              </>
            ) : (
              <>
                <Play size={16} />
                Run Simulation
              </>
            )}
          </button>
          <div className="mt-3 flex items-center justify-center">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={12} />
              Back to Engines
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 rounded-md bg-warning-bg/30 border border-warning/20">
          <p className="text-[10px] text-warning leading-relaxed">
            ⚠ Advisory disclaimer: All simulation outputs are decision-support estimates and do not
            substitute for a Tier-3 study by a qualified dam-safety engineer per CWC Guidelines
            (2018).
          </p>
        </div>
      </div>
    </div>
  );
}
