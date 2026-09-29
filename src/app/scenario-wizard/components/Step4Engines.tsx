'use client';
import React, { useMemo } from 'react';
import { ChevronRight, ChevronLeft, Zap, Info } from 'lucide-react';
import { engineOptions, damCatalog } from '@/lib/mockData';
import { type WizardState } from './ScenarioWizardClient';

interface Props {
  state: WizardState;
  update: (p: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const resolutionOptions = [
  { id: 'res-25', value: '25', label: '25 m', sub: 'High detail · WebGPU required · ~2M cells' },
  {
    id: 'res-50',
    value: '50',
    label: '50 m',
    sub: 'Standard · CPU/GPU · ~500k cells',
    recommended: true,
  },
  { id: 'res-100', value: '100', label: '100 m', sub: 'Fast preview · CPU · ~125k cells' },
  { id: 'res-200', value: '200', label: '200 m', sub: 'Rapid screening · ~30k cells' },
];

export default function Step4Engines({ state, update, onNext, onBack }: Props) {
  const dam = damCatalog.find((d) => d.id === state.damId);

  const toggleEngine = (engineId: string) => {
    const eng = engineOptions.find((e) => e.id === engineId);
    if (!eng?.available) return;
    const current = state.engines;
    if (current.includes(engineId)) {
      if (current.length === 1) return; // must have at least one
      update({ engines: current.filter((e) => e !== engineId) });
    } else {
      update({ engines: [...current, engineId] });
    }
  };

  // Live breach calc for selected dam
  const breachCalc = useMemo(() => {
    if (!dam) return null;
    const VW = dam.vwMm3 * 1e6; // m³
    const Hb = dam.heightM;
    const g = 9.81;
    const kM = state.failureMode === 'fm-piping' ? 1.0 : 1.5;
    const Bavg = (0.23 * kM * Math.pow(VW, 1 / 3)).toFixed(1);
    const tf = (60 * Math.sqrt(VW / (g * Hb * Hb))).toFixed(0);
    return { Bavg, tf, VW: (VW / 1e6).toFixed(1), Hb };
  }, [dam, state.failureMode]);

  const selectedRes = resolutionOptions.find((r) => r.value === state.resolution);
  const estimatedCells =
    {
      '25': '~1.8M',
      '50': '~460k',
      '100': '~115k',
      '200': '~29k',
    }[state.resolution] || '~460k';

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Engine selection */}
      <div className="xl:col-span-2 space-y-4">
        <div className="wizard-card p-4">
          <h3 className="text-sm font-600 text-foreground mb-1">Engine Selection</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Select one or more engines. Multiple engines run a comparison scenario automatically.
          </p>
          <div className="space-y-3">
            {engineOptions.map((eng) => {
              const isSelected = state.engines.includes(eng.id);
              return (
                <button
                  key={eng.id}
                  onClick={() => toggleEngine(eng.id)}
                  disabled={!eng.available}
                  className={`w-full text-left p-4 rounded-md border transition-all duration-150 ${
                    !eng.available
                      ? 'border-border opacity-50 cursor-not-allowed'
                      : isSelected
                        ? 'border-primary bg-info-bg'
                        : 'border-border hover:border-muted-foreground/40 hover:bg-muted/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-primary border-primary' : 'border-border'
                      }`}
                    >
                      {isSelected && (
                        <span className="text-primary-foreground text-[9px] font-700">✓</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p
                          className={`text-xs font-600 ${isSelected ? 'text-primary' : eng.available ? 'text-foreground' : 'text-muted-foreground'}`}
                        >
                          {eng.name}
                        </p>
                        <span className="text-[9px] font-mono text-muted-foreground">
                          {eng.version}
                        </span>
                        {!eng.available && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-warning-bg text-warning font-600">
                            NOT INSTALLED
                          </span>
                        )}
                        {eng.available && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-success-bg text-success font-600">
                            READY
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                        {eng.description}
                      </p>
                      {eng.available && (
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] text-muted-foreground">
                            CPU: ≤{(eng.maxCellsCpu! / 1000).toFixed(0)}k cells
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            GPU: ≤{(eng.maxCellsGpu! / 1000).toFixed(0)}k cells
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Est. {eng.timeToRunMin} min
                          </span>
                        </div>
                      )}
                      {!eng.available && (
                        <p className="text-[10px] text-warning mt-1">
                          {eng.id === 'engine-delft3d'
                            ? 'Set D3D_HOME env var and install DIMR to enable. hydrolib-core adapter is ready.'
                            : 'Install DualSPHysics CLI and add to PATH.'}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          {state.engines.length >= 2 && (
            <div className="mt-3 p-2 rounded bg-info-bg border border-primary/30 flex items-center gap-2">
              <Zap size={12} className="text-primary" />
              <p className="text-[10px] text-primary">
                Multi-engine comparison enabled — results will appear in Compare Lab automatically.
              </p>
            </div>
          )}
        </div>

        {/* Resolution */}
        <div className="wizard-card p-4">
          <h3 className="text-sm font-600 text-foreground mb-1">Grid Resolution</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Cell size for the 2D shallow-water grid. Finer resolution = higher accuracy + longer
            runtime.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {resolutionOptions.map((res) => (
              <button
                key={res.id}
                onClick={() => update({ resolution: res.value })}
                className={`p-3 rounded-md border text-left transition-all duration-150 ${
                  state.resolution === res.value
                    ? 'border-primary bg-info-bg'
                    : 'border-border hover:border-muted-foreground/40 hover:bg-muted/20'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <p
                    className={`text-sm font-700 font-mono ${state.resolution === res.value ? 'text-primary' : 'text-foreground'}`}
                  >
                    {res.label}
                  </p>
                  {res.recommended && (
                    <span className="text-[9px] px-1 py-0.5 rounded bg-success-bg text-success font-600">
                      REC
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{res.sub}</p>
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 p-2 bg-muted/20 rounded-md">
            <Info size={12} className="text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground">
              Estimated cells at {state.resolution}m:{' '}
              <span className="text-foreground font-mono font-600">{estimatedCells}</span>. WebGPU
              auto-detected at runtime; CPU fallback active if unavailable.
            </p>
          </div>
        </div>

        {/* Monte Carlo */}
        <div className="wizard-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-600 text-foreground">Monte Carlo Breach Uncertainty</h3>
              <p className="text-xs text-muted-foreground">
                Sample breach width, formation time, side slope — output P50/P90/P99 peak discharge
              </p>
            </div>
            <button
              role="switch"
              aria-checked={state.monteCarlo}
              onClick={() => update({ monteCarlo: !state.monteCarlo })}
              className={`relative inline-flex w-9 h-5 rounded-full transition-colors duration-200 shrink-0 ${
                state.monteCarlo ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                  state.monteCarlo ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          {state.monteCarlo && (
            <div className="mt-3">
              <label className="block text-[11px] font-600 text-muted-foreground mb-1">
                Number of samples (N)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={50}
                  max={500}
                  step={50}
                  value={state.mcN}
                  onChange={(e) => update({ mcN: Number(e.target.value) })}
                  className="flex-1 accent-primary"
                />
                <span className="text-sm font-mono font-600 text-foreground w-12 text-right">
                  {state.mcN}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                N=200 recommended for P99 stability. Runs on fast 1D/level-pool path (not full 2D).
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right: live breach calc + navigation */}
      <div className="space-y-4">
        {breachCalc && dam && (
          <div className="wizard-card p-4">
            <h3 className="text-sm font-600 text-foreground mb-3">Live Breach Estimate</h3>
            <p className="text-[10px] text-muted-foreground mb-3">
              Froehlich 2016/17 · CWC 2018 · {dam.name}
            </p>
            <div className="space-y-2">
              {[
                {
                  label: 'B_avg (breach width)',
                  value: `${breachCalc.Bavg} m`,
                  formula: `0.23 × ${state.failureMode === 'fm-piping' ? '1.0' : '1.5'} × V_W^(1/3)`,
                },
                {
                  label: 'Formation time t_f',
                  value: `${Math.floor(Number(breachCalc.tf) / 60)} min ${Number(breachCalc.tf) % 60} s`,
                  formula: '60·√(V_W/(g·H_b²))',
                },
                {
                  label: 'Peak Q_p (Froehlich)',
                  value: `${dam.peakQpM3s.toLocaleString('en-IN')} m³/s`,
                  formula: 'empirical eq.',
                },
                {
                  label: 'Q_p cross-check (1995)',
                  value: `${dam.qp1995M3s.toLocaleString('en-IN')} m³/s`,
                  formula: '0.607·V^0.295·H^1.24',
                },
              ].map((item) => (
                <div key={`brcalc-${item.label}`} className="p-2.5 bg-muted/30 rounded-md">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground">{item.label}</p>
                    <p className="text-xs font-mono font-700 text-primary">{item.value}</p>
                  </div>
                  <p className="text-[9px] text-muted-foreground/60 mt-0.5 font-mono">
                    {item.formula}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2 bg-muted/20 rounded-md">
              <p className="text-[10px] text-muted-foreground">
                V_W = {breachCalc.VW} Mm³ · H_b = {breachCalc.Hb} m · g = 9.81 m/s²
              </p>
            </div>
            <div className="mt-2 p-2 bg-warning-bg rounded-md border border-warning/30">
              <p className="text-[9px] text-warning leading-relaxed">
                Sanity check: Compare with USACE Table 4-1 ranges. Values outside envelope will
                trigger a warning in run diagnostics.
              </p>
            </div>
          </div>
        )}

        {/* Scenario name */}
        <div className="wizard-card p-4">
          <label className="block text-xs font-600 text-foreground mb-1">
            Scenario Name (optional)
          </label>
          <p className="text-[10px] text-muted-foreground mb-2">
            Auto-generated if blank. Used in exports and EAP reports.
          </p>
          <input
            type="text"
            placeholder={`${dam?.name ?? 'Dam'} — ${state.failureMode ? failureModes.find((f) => f.id === state.failureMode)?.label : 'Scenario'}`}
            value={state.scenarioName}
            onChange={(e) => update({ scenarioName: e.target.value })}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 border border-border text-sm font-600 text-muted-foreground rounded-md hover:text-foreground hover:border-muted-foreground transition-all duration-150"
          >
            <ChevronLeft size={14} /> Back
          </button>
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-600 rounded-md hover:opacity-90 active:scale-95 transition-all duration-150"
          >
            Review & Run
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Need to import failureModes for the placeholder
import { failureModes } from '@/lib/mockData';
