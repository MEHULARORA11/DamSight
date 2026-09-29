'use client';
import React from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { demSources } from '@/lib/mockData';
import { type WizardState } from './ScenarioWizardClient';

interface Props {
  state: WizardState;
  update: (p: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface ToggleRowProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ label, description, value, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-xs font-600 text-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex w-9 h-5 rounded-full transition-colors duration-200 shrink-0 ${
          value ? 'bg-primary' : 'bg-muted'
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
            value ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

export default function Step3Terrain({ state, update, onNext, onBack }: Props) {
  const selectedDem = demSources.find((d) => d.id === state.demSource);

  // Tier recommendation logic
  const getTierRecommendation = () => {
    if (state.demSource === 'dem-user')
      return {
        tier: 'Tier 2–3',
        color: 'text-success',
        note: 'User LiDAR/survey data — highest accuracy for narrow valleys',
      };
    if (state.demSource === 'dem-copernicusglo30')
      return {
        tier: 'Tier 1–2',
        color: 'text-primary',
        note: 'Copernicus GLO-30 recommended for Indian terrain; known limits in steep gorges < 30m wide',
      };
    return {
      tier: 'Tier 1',
      color: 'text-warning',
      note: 'SRTM/ASTER/ALOS at 30m; level-pool routing adequate; 2D SWE errors may be significant in narrow valleys (CWC note)',
    };
  };

  const tier = getTierRecommendation();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* DEM source selection */}
      <div className="space-y-4">
        <div className="wizard-card p-4">
          <h3 className="text-sm font-600 text-foreground mb-1">DEM Source</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Terrain resolution directly affects inundation accuracy. CWC Tier 1/2/3 classification
            shown.
          </p>
          <div className="space-y-2">
            {demSources.map((dem) => (
              <button
                key={dem.id}
                onClick={() => update({ demSource: dem.id })}
                className={`w-full text-left p-3 rounded-md border transition-all duration-150 ${
                  state.demSource === dem.id
                    ? 'border-primary bg-info-bg'
                    : 'border-border hover:border-muted-foreground/40 hover:bg-muted/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {state.demSource === dem.id ? (
                      <CheckCircle2 size={14} className="text-primary shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-border shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-xs font-600 ${state.demSource === dem.id ? 'text-primary' : 'text-foreground'}`}
                        >
                          {dem.name}
                        </p>
                        {dem.recommended && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-success-bg text-success font-600">
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {dem.resolution} · {dem.coverage} · {dem.license}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tier recommendation */}
        <div className="wizard-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info size={14} className="text-primary" />
            <h3 className="text-sm font-600 text-foreground">CWC Tier Recommendation</h3>
          </div>
          <div className={`text-sm font-700 mb-1 ${tier.color}`}>{tier.tier}</div>
          <p className="text-xs text-muted-foreground leading-relaxed">{tier.note}</p>
          <div className="mt-3 p-2 bg-muted/20 rounded-md">
            <p className="text-[10px] text-muted-foreground">
              Ref: CWC &quot;Guidelines for Mapping Flood Risks Associated with Dams&quot; (2018)
              §2.3 — DEM quality requirements per dam hazard class
            </p>
          </div>
        </div>
      </div>

      {/* Terrain conditioning */}
      <div className="space-y-4">
        <div className="wizard-card p-4">
          <h3 className="text-sm font-600 text-foreground mb-1">Terrain Conditioning</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Hydrological pre-processing applied before simulation. Recommended defaults from CWC
            practice.
          </p>
          <div>
            <ToggleRow
              label="Sink Fill (depression removal)"
              description="Fill spurious DEM sinks to ensure continuous flow routing. Required for most DEMs."
              value={state.sinkFill}
              onChange={(v) => update({ sinkFill: v })}
            />
            <ToggleRow
              label="River Burn (channel enforcement)"
              description="Enforce known river channel from OSM/SWAT into DEM to prevent cross-bank spill artifacts."
              value={state.riverBurn}
              onChange={(v) => update({ riverBurn: v })}
            />
            <ToggleRow
              label="Hydrologic Enforcement"
              description="Enforce flow connectivity using DEM-derived flow accumulation. Improves valley routing."
              value={state.hydrologicEnforcement}
              onChange={(v) => update({ hydrologicEnforcement: v })}
            />
            <ToggleRow
              label="Bridge / Culvert Flag"
              description="Flag road crossings as potential flow obstructions. Requires OSM road network overlay."
              value={state.bridgeFlag}
              onChange={(v) => update({ bridgeFlag: v })}
            />
          </div>
        </div>

        {/* DEM info */}
        {selectedDem && (
          <div className="wizard-card p-4">
            <h3 className="text-sm font-600 text-foreground mb-2">Selected DEM Details</h3>
            <div className="space-y-1.5">
              {[
                { label: 'Name', value: selectedDem.name },
                { label: 'Resolution', value: selectedDem.resolution },
                { label: 'Coverage', value: selectedDem.coverage },
                { label: 'License', value: selectedDem.license },
              ].map((item) => (
                <div key={`demdetail-${item.label}`} className="flex justify-between">
                  <span className="text-[11px] text-muted-foreground">{item.label}</span>
                  <span className="text-[11px] text-foreground font-500">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2 bg-muted/20 rounded-md">
              <p className="text-[10px] text-muted-foreground">
                DEM will be auto-clipped to dam–downstream corridor. Resolution and known limits in
                narrow valleys reported in run diagnostics.
              </p>
            </div>
            {state.demSource !== 'dem-copernicusglo30' && (
              <div className="mt-2 p-2 bg-warning-bg rounded-md border border-warning/30 flex items-start gap-1.5">
                <AlertTriangle size={10} className="text-warning mt-0.5 shrink-0" />
                <p className="text-[10px] text-warning">
                  Non-recommended DEM. Accuracy in steep gorges and narrow valleys may be limited.
                  Consider upgrading to Copernicus GLO-30 or user LiDAR for Tier 2+ analysis.
                </p>
              </div>
            )}
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
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-600 rounded-md hover:opacity-90 active:scale-95 transition-all duration-150"
          >
            Next: Engines
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
