'use client';
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface Props {
  currentTime: number;
  peakQ: number;
}

function generateHydrograph(peakQ: number) {
  const data = [];
  const totalHr = 6;
  const steps = 36;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * totalHr;
    const tPeak = 0.8;
    let q: number;
    if (t <= tPeak) {
      q = peakQ * Math.pow(t / tPeak, 1.8);
    } else {
      q = peakQ * Math.exp(-1.4 * (t - tPeak));
    }
    // Add some noise
    q = q * (1 + Math.sin(i * 1.3) * 0.03);
    data.push({
      time: t.toFixed(1),
      discharge: Math.max(0, Math.round(q)),
      label: `${t.toFixed(1)}h`,
    });
  }
  return data;
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
      <p className="text-muted-foreground">T = {label} hr</p>
      <p className="text-primary font-mono font-600">
        Q = {payload[0].value.toLocaleString('en-IN')} m³/s
      </p>
    </div>
  );
};

export default function HydrographChart({ currentTime, peakQ }: Props) {
  const data = generateHydrograph(peakQ);
  const currentHr = (currentTime * 6).toFixed(1);

  return (
    <ResponsiveContainer width="100%" height={120}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="hydrograph-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 9, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
          label={{
            value: 'Time (hr)',
            position: 'insideBottomRight',
            offset: -4,
            fontSize: 9,
            fill: 'var(--muted-foreground)',
          }}
        />
        <YAxis
          tick={{ fontSize: 9, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          x={currentHr}
          stroke="var(--primary)"
          strokeDasharray="3 3"
          strokeWidth={1.5}
        />
        <Area
          type="monotone"
          dataKey="discharge"
          stroke="var(--chart-1)"
          strokeWidth={1.5}
          fill="url(#hydrograph-gradient)"
          dot={false}
          activeDot={{ r: 3, fill: 'var(--chart-1)' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
