'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

interface Props {
  peakQ: number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel rounded-md px-2.5 py-2 text-[10px] shadow-elevated">
      <p className="text-muted-foreground">{label}</p>
      <p className="text-primary font-mono font-600">
        Q = {payload[0].value.toLocaleString('en-IN')} m³/s
      </p>
    </div>
  );
};

export default function BreachUncertaintyChart({ peakQ }: Props) {
  const data = [
    { percentile: 'P10', q: Math.round(peakQ * 0.62), color: 'var(--chart-3)' },
    { percentile: 'P25', q: Math.round(peakQ * 0.75), color: 'var(--chart-3)' },
    { percentile: 'P50', q: Math.round(peakQ * 0.92), color: 'var(--chart-1)' },
    { percentile: 'P75', q: Math.round(peakQ * 1.08), color: 'var(--chart-4)' },
    { percentile: 'P90', q: Math.round(peakQ * 1.22), color: 'var(--chart-4)' },
    { percentile: 'P99', q: Math.round(peakQ * 1.48), color: 'var(--chart-6)' },
  ];

  return (
    <ResponsiveContainer width="100%" height={100}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="percentile"
          tick={{ fontSize: 9, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
        />
        <YAxis
          tick={{ fontSize: 9, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={peakQ} stroke="var(--primary)" strokeDasharray="3 2" strokeWidth={1} />
        <Bar dataKey="q" radius={[2, 2, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
