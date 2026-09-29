import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'alert' | 'warning' | 'success' | 'info';
  icon?: React.ElementType;
  subtext?: string;
  className?: string;
}

export default function MetricCard({
  label,
  value,
  unit,
  trend,
  trendValue,
  variant = 'default',
  icon: Icon,
  subtext,
  className = '',
}: MetricCardProps) {
  const variantClass = {
    default: 'bg-card border-border',
    alert: 'metric-card-alert',
    warning: 'metric-card-warning',
    success: 'metric-card-success',
    info: 'metric-card-info',
  }[variant];

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-muted-foreground';

  return (
    <div
      className={`rounded-lg border p-4 flex flex-col gap-2 transition-all duration-150 hover:shadow-elevated ${variantClass} ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-600 tracking-wider text-muted-foreground uppercase">
          {label}
        </p>
        {Icon && (
          <div className="p-1.5 rounded-md bg-muted/50">
            <Icon size={14} className="text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex items-end gap-1.5">
        <span className="text-2xl font-700 text-foreground tabular-nums font-mono leading-none">
          {value}
        </span>
        {unit && <span className="text-xs text-muted-foreground mb-0.5">{unit}</span>}
      </div>
      {(trend || subtext) && (
        <div className="flex items-center gap-1.5">
          {trend && (
            <div className={`flex items-center gap-1 ${trendColor}`}>
              <TrendIcon size={12} />
              {trendValue && <span className="text-xs font-500">{trendValue}</span>}
            </div>
          )}
          {subtext && <span className="text-[11px] text-muted-foreground">{subtext}</span>}
        </div>
      )}
    </div>
  );
}
