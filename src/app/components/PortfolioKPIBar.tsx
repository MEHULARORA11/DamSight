import React from 'react';
import { Activity, AlertTriangle, Users, Layers, Zap } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';

const kpis = [
  {
    id: 'kpi-active-runs',
    label: 'Active Runs',
    value: '3',
    unit: '',
    icon: Activity,
    variant: 'info',
    sub: '2 queued',
  },
  {
    id: 'kpi-dams',
    label: 'Dams Monitored',
    value: '47',
    unit: '',
    icon: Layers,
    variant: 'default',
    sub: 'GeoDAR + NRLD',
  },
  {
    id: 'kpi-high-hazard',
    label: 'High Hazard Dams',
    value: '12',
    unit: '',
    icon: AlertTriangle,
    variant: 'alert',
    sub: '3 unreviewed',
  },
  {
    id: 'kpi-pop-risk',
    label: 'Population at Risk',
    value: '2.4M',
    unit: '',
    icon: Users,
    variant: 'warning',
    sub: 'Worst-case P99',
  },
  {
    id: 'kpi-nrt',
    label: 'NRT S1 Age',
    value: '1.8',
    unit: 'days',
    icon: Zap,
    variant: 'success',
    sub: 'Teesta basin',
  },
];

export default function PortfolioKPIBar() {
  return (
    <div className="border-b border-border bg-card/80 px-4 py-2 flex items-center gap-3 overflow-x-auto shrink-0">
      {kpis?.map((kpi) => {
        const Icon = kpi?.icon;
        const variantClass =
          {
            default: 'border-border',
            alert: 'border-danger/40 bg-danger-bg/50',
            warning: 'border-warning/40 bg-warning-bg/50',
            success: 'border-success/40 bg-success-bg/50',
            info: 'border-info/40 bg-info-bg/50',
          }?.[kpi?.variant] || 'border-border';

        const valueColor =
          {
            default: 'text-foreground',
            alert: 'text-danger',
            warning: 'text-warning',
            success: 'text-success',
            info: 'text-primary',
          }?.[kpi?.variant] || 'text-foreground';

        return (
          <div
            key={kpi?.id}
            className={`flex items-center gap-3 px-3 py-2 rounded-md border shrink-0 min-w-[160px] ${variantClass}`}
          >
            <div className="p-1.5 rounded bg-muted/50">
              <Icon size={14} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-600 text-muted-foreground uppercase tracking-wider">
                {kpi?.label}
              </p>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-lg font-700 tabular-nums font-mono leading-none ${valueColor}`}
                >
                  {kpi?.value}
                </span>
                {kpi?.unit && (
                  <span className="text-[10px] text-muted-foreground">{kpi?.unit}</span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground">{kpi?.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
