import React from 'react';

type BadgeVariant =
  | 'high'
  | 'significant'
  | 'low'
  | 'running'
  | 'completed'
  | 'queued'
  | 'failed'
  | 'draft'
  | 'online'
  | 'warning'
  | 'offline'
  | 'replay';

interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
  size?: 'sm' | 'md';
}

const variantConfig: Record<BadgeVariant, { className: string; defaultLabel: string }> = {
  high: { className: 'hazard-chip-high', defaultLabel: 'High Hazard' },
  significant: { className: 'hazard-chip-significant', defaultLabel: 'Significant' },
  low: { className: 'hazard-chip-low', defaultLabel: 'Low Hazard' },
  running: { className: 'bg-info-bg text-info border border-info/30', defaultLabel: 'Running' },
  completed: {
    className: 'bg-success-bg text-success border border-success/30',
    defaultLabel: 'Completed',
  },
  queued: {
    className: 'bg-muted text-muted-foreground border border-border',
    defaultLabel: 'Queued',
  },
  failed: { className: 'bg-danger-bg text-danger border border-danger/30', defaultLabel: 'Failed' },
  draft: {
    className: 'bg-muted text-muted-foreground border border-border',
    defaultLabel: 'Draft',
  },
  online: {
    className: 'bg-success-bg text-success border border-success/30',
    defaultLabel: 'Online',
  },
  warning: {
    className: 'bg-warning-bg text-warning border border-warning/30',
    defaultLabel: 'Warning',
  },
  offline: {
    className: 'bg-danger-bg text-danger border border-danger/30',
    defaultLabel: 'Offline',
  },
  replay: { className: 'recorded-run-badge', defaultLabel: 'Recorded Run' },
};

export default function StatusBadge({ variant, label, size = 'sm' }: StatusBadgeProps) {
  const config = variantConfig[variant];
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';
  return (
    <span
      className={`inline-flex items-center font-600 rounded-md whitespace-nowrap ${sizeClass} ${config.className}`}
    >
      {label ?? config.defaultLabel}
    </span>
  );
}
