'use client';
import React, { useState } from 'react';
import WizardProgress from './WizardProgress';
import Step1DamSelection from './Step1DamSelection';
import Step2FailureMode from './Step2FailureMode';
import Step3Terrain from './Step3Terrain';
import Step4Engines from './Step4Engines';
import Step5Review from './Step5Review';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export interface WizardState {
  step: number;
  damId: string;
  damName: string;
  failureMode: string;
  floodClass: string;
  demSource: string;
  sinkFill: boolean;
  riverBurn: boolean;
  bridgeFlag: boolean;
  hydrologicEnforcement: boolean;
  engines: string[];
  resolution: string;
  monteCarlo: boolean;
  mcN: number;
  notes: string;
  scenarioName: string;
}

const initialState: WizardState = {
  step: 1,
  damId: '',
  damName: '',
  failureMode: '',
  floodClass: 'PMF',
  demSource: 'dem-copernicusglo30',
  sinkFill: true,
  riverBurn: true,
  bridgeFlag: false,
  hydrologicEnforcement: true,
  engines: ['engine-native-fv'],
  resolution: '50',
  monteCarlo: false,
  mcN: 200,
  notes: '',
  scenarioName: '',
};

export default function ScenarioWizardClient() {
  const [state, setState] = useState<WizardState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const update = (partial: Partial<WizardState>) => setState((prev) => ({ ...prev, ...partial }));

  const next = () => setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, 5) }));
  const back = () => setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1) }));

  const handleSubmit = async () => {
    setSubmitting(true);
    // BACKEND: POST /api/scenarios + POST /api/runs — submit scenario JSON, receive run ID
    await new Promise((r) => setTimeout(r, 1800));
    setSubmitting(false);
    toast.success('Scenario queued — Run RUN-2850 created', {
      description: `${state.damName} · ${state.failureMode} · ${state.engines.join(' + ')}`,
    });
    router.push('/live-simulation-view');
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="max-w-screen-xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-600 text-foreground">New Simulation Scenario</h1>
              <p className="text-sm text-muted-foreground mt-1">
                CWC-compliant dam-break / flood scenario configuration · Froehlich 2016/17 breach
                parameters
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Scenario auto-saved as draft</span>
              <div className="w-2 h-2 rounded-full bg-success animate-pulse-slow" />
            </div>
          </div>
        </div>

        {/* Progress */}
        <WizardProgress currentStep={state.step} />

        {/* Step content */}
        <div className="mt-6">
          {state.step === 1 && <Step1DamSelection state={state} update={update} onNext={next} />}
          {state.step === 2 && (
            <Step2FailureMode state={state} update={update} onNext={next} onBack={back} />
          )}
          {state.step === 3 && (
            <Step3Terrain state={state} update={update} onNext={next} onBack={back} />
          )}
          {state.step === 4 && (
            <Step4Engines state={state} update={update} onNext={next} onBack={back} />
          )}
          {state.step === 5 && (
            <Step5Review
              state={state}
              update={update}
              onBack={back}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-3 rounded-md border border-warning/30 bg-warning-bg/30 text-[11px] text-warning">
          ⚠ Advisory disclaimer: All outputs are decision-support estimates. Not a substitute for a
          Tier-3 study by a qualified dam-safety engineer per CWC Guidelines for Mapping Flood Risks
          Associated with Dams (2018).
        </div>
      </div>
    </div>
  );
}
