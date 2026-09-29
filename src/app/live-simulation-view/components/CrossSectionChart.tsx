'use client';
import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface Props {
  currentTime: number;
}

function generateCrossSection(currentTime: number) {
  const bedProfile = [
    { dist: 0, bed: 50, wse: 0 },
    { dist: 100, bed: 45, wse: 0 },
    { dist: 300, bed: 38, wse: 0 },
    { dist: 600, bed: 30, wse: 0 },
    { dist: 1000, bed: 22, wse: 0 },
    { dist: 1500, bed: 18, wse: 0 },
    { dist: 2000, bed: 15, wse: 0 },
    { dist: 2800, bed: 12, wse: 0 },
    { dist: 3500, bed: 10, wse: 0 },
    { dist: 4000, bed: 8, wse: 0 },
  ];

  return bedProfile.map((pt) => {
    const waveDepth = Math.max(0, (currentTime * 12 - pt.dist / 500) * 4);
    const wse = pt.bed + Math.min(waveDepth, 14);
    return { ...pt, wse: wse > pt.bed ? wse : 0, label: `${(pt.dist / 1000).toFixed(1)}km` };
  });
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel rounded-md px-2.5 py-2 text-[10px] shadow-elevated">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p
          key={`cs-tip-${i}`}
          className="font-mono"
          style={{ color: i === 0 ? 'var(--chart-3)' : 'var(--chart-1)' }}
        >
          {p.name === 'bed' ? 'Bed elev' : 'WSE'}: {p.value.toFixed(1)} m
        </p>
      ))}
    </div>
  );
};

export default function CrossSectionChart({ currentTime }: Props) {
  const data = generateCrossSection(currentTime);

  return (
    <ResponsiveContainer width="100%" height={110}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="wse-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.5} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 9, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
        />
        <YAxis
          tick={{ fontSize: 9, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="bed"
          stroke="var(--chart-3)"
          strokeWidth={1.5}
          fill="rgba(34,211,160,0.08)"
          dot={false}
          name="bed"
        />
        <Area
          type="monotone"
          dataKey="wse"
          stroke="var(--chart-1)"
          strokeWidth={1.5}
          fill="url(#wse-gradient)"
          dot={false}
          name="wse"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
