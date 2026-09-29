import React from 'react';
import { Activity, CheckCircle2, Clock, Satellite } from 'lucide-react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const activities = [
  {
    id: 'act-001',
    type: 'run_complete',
    title: 'Tehri Dam — Overtopping PMF',
    engine: 'Native-FV',
    runId: 'RUN-2847',
    time: '3 min ago',
    icon: CheckCircle2,
    iconColor: 'text-success',
  },
  {
    id: 'act-002',
    type: 'run_running',
    title: 'Hirakud — Controlled Release',
    engine: 'Native-SPH',
    runId: 'RUN-2848',
    time: 'Running · 67%',
    icon: Activity,
    iconColor: 'text-primary',
  },
  {
    id: 'act-003',
    type: 'nrt',
    title: 'Teesta basin S1 update',
    engine: 'GEE · Sentinel-1',
    runId: 'NRT-0091',
    time: '1.8 days old',
    icon: Satellite,
    iconColor: 'text-warning',
  },
  {
    id: 'act-004',
    type: 'alert',
    title: 'Machhu-II — Piping scenario queued',
    engine: 'Native-FV',
    runId: 'RUN-2849',
    time: 'Queued · 0%',
    icon: Clock,
    iconColor: 'text-muted-foreground',
  },
  {
    id: 'act-005',
    type: 'run_complete',
    title: 'Sardar Sarovar — SPF comparison',
    engine: 'Native-FV vs SPH',
    runId: 'CMP-0047',
    time: '2 hr ago',
    icon: CheckCircle2,
    iconColor: 'text-success',
  },
];

export default function RecentActivityFeed() {
  return (
    <div className="glass-panel rounded-lg overflow-hidden shadow-elevated">
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <span className="text-xs font-600 text-foreground">Recent Activity</span>
        <Link href="/live-simulation-view" className="text-[10px] text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="divide-y divide-border/50 max-h-52 overflow-y-auto">
        {activities?.map((act) => {
          const Icon = act?.icon;
          return (
            <div
              key={act?.id}
              className="px-3 py-2 hover:bg-muted/20 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-2">
                <Icon size={13} className={`mt-0.5 shrink-0 ${act?.iconColor}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-500 text-foreground truncate">{act?.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] font-mono text-muted-foreground">{act?.runId}</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-[9px] text-muted-foreground">{act?.engine}</span>
                  </div>
                </div>
                <span className="text-[9px] text-muted-foreground shrink-0">{act?.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
