'use client';
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, AlertTriangle, Info } from 'lucide-react';
import { failureModes } from '@/lib/mockData';
import { type WizardState } from './ScenarioWizardClient';

interface Props {
  state: WizardState;
  update: (p: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const floodClasses = [
  { id: 'fc-100yr', value: '100yr', label: '100-year flood', sub: 'Standard design flood' },
  { id: 'fc-spf', value: 'SPF', label: 'Standard Project Flood', sub: 'IS 11223 Class III–IV' },
  {
    id: 'fc-pmf',
    value: 'PMF',
    label: 'Probable Maximum Flood',
    sub: 'IS 11223 Class IV+ (critical)',
  },
];

export default function Step2FailureMode({ state, update, onNext, onBack }: Props) {
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!state.failureMode) {
      setError('Select a failure mode to continue.');
      return;
    }
    setError('');
    onNext();
  };

  const selectedMode = failureModes.find((f) => f.id === state.failureMode);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Failure mode grid */}
      <div className="xl:col-span-2">
        <div className="wizard-card p-4">
          <h3 className="text-sm font-600 text-foreground mb-1">Failure Mode</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Select the breach mechanism. Breach parameters (Froehlich 2016/17) and outflow equations
            are applied per mode.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {failureModes.map((mode) => {
              const isSelected = state.failureMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    update({ failureMode: mode.id });
                    setError('');
                  }}
                  className={`text-left p-3 rounded-md border transition-all duration-150 ${
                    isSelected
                      ? 'border-primary bg-info-bg'
                      : 'border-border hover:border-muted-foreground/40 hover:bg-muted/20'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-lg leading-none mt-0.5">{mode.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p
                          className={`text-xs font-600 ${isSelected ? 'text-primary' : 'text-foreground'}`}
                        >
                          {mode.label}
                        </p>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-600 ${
                            mode.riskLevel === 'high'
                              ? 'bg-danger-bg text-danger'
                              : 'bg-warning-bg text-warning'
                          }`}
                        >
                          {mode.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                        {mode.description}
                      </p>
                      <p className="text-[9px] text-muted-foreground/60 mt-1">{mode.cwcRef}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Flood class (for overtopping / piping) */}
        {(state.failureMode === 'fm-overtopping' || state.failureMode === 'fm-piping') && (
          <div className="wizard-card p-4 mt-4">
            <h3 className="text-sm font-600 text-foreground mb-1">Inflow Design Flood</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Per IS 11223 and CWC Guidelines §2. Select the design flood standard for this
              scenario.
            </p>
            <div className="flex gap-2">
              {floodClasses.map((fc) => (
                <button
                  key={fc.id}
                  onClick={() => update({ floodClass: fc.value })}
                  className={`flex-1 p-3 rounded-md border text-left transition-all duration-150 ${
                    state.floodClass === fc.value
                      ? 'border-primary bg-info-bg'
                      : 'border-border hover:border-muted-foreground/40 hover:bg-muted/20'
                  }`}
                >
                  <p
                    className={`text-xs font-600 ${state.floodClass === fc.value ? 'text-primary' : 'text-foreground'}`}
                  >
                    {fc.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{fc.sub}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: selected mode detail + equations */}
      <div className="space-y-4">
        {selectedMode ? (
          <div className="wizard-card p-4">
            <h3 className="text-sm font-600 text-foreground mb-3">Breach Parameters</h3>
            <p className="text-[10px] text-muted-foreground mb-3">
              Froehlich 2016/17 equations · CWC Guidelines for Mapping Flood Risks (2018)
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-muted/30 rounded-md">
                <p className="text-[10px] font-600 text-muted-foreground mb-1.5">
                  Average Breach Width
                </p>
                <p className="text-xs font-mono text-primary">B_avg = 0.23 · kM · V_W^(1/3)</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  kM ={' '}
                  {selectedMode.id === 'fm-piping' ? '1.0 (internal erosion)' : '1.5 (overtopping)'}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-md">
                <p className="text-[10px] font-600 text-muted-foreground mb-1.5">
                  Breach Side Slope (H:V)
                </p>
                <p className="text-xs font-mono text-primary">
                  {selectedMode.id === 'fm-piping'
                    ? '0.6 (internal erosion)'
                    : selectedMode.id === 'fm-concrete-partial'
                      ? 'Vertical (0:1) — concrete'
                      : '1.0 (overtopping)'}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-md">
                <p className="text-[10px] font-600 text-muted-foreground mb-1.5">Formation Time</p>
                <p className="text-xs font-mono text-primary">t_f = 60 · √(V_W / (g · H_b²))</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  seconds → converted to minutes for display
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-md">
                <p className="text-[10px] font-600 text-muted-foreground mb-1.5">
                  Peak Outflow Q_p
                </p>
                <p className="text-xs font-mono text-primary leading-relaxed">
                  0.0175 · kM&apos; · kH · √(g · V_W · H_W · H_b² / W_avg)
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Cross-check: Froehlich 1995: 0.607 · V^0.295 · H^1.24
                </p>
              </div>
            </div>
            <div className="mt-3 p-2 rounded bg-muted/20 border border-border">
              <div className="flex items-start gap-1.5">
                <Info size={10} className="text-primary mt-0.5 shrink-0" />
                <p className="text-[9px] text-muted-foreground leading-relaxed">
                  MacDonald & Langridge-Monopolis, Von Thun & Gillette, Xu & Zhang methods available
                  only when coefficients are user-entered from cited papers. Coefficients are not
                  pre-filled.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="wizard-card flex flex-col items-center justify-center py-12 text-center">
            <p className="text-xs text-muted-foreground">
              Select a failure mode to see breach parameter equations
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 border border-border text-sm font-600 text-muted-foreground rounded-md hover:text-foreground hover:border-muted-foreground transition-all duration-150"
          >
            <ChevronLeft size={14} /> Back
          </button>
          <div className="flex-1">
            {error && (
              <p className="text-xs text-danger flex items-center gap-1">
                <AlertTriangle size={11} /> {error}
              </p>
            )}
          </div>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-600 rounded-md hover:opacity-90 active:scale-95 transition-all duration-150"
          >
            Next: Terrain
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
