'use client';
import React, { useState } from 'react';
import { Bell, Search, HelpCircle, User, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

const notifications = [
  {
    id: 'notif-001',
    type: 'alert',
    message: 'Run #RUN-2847 completed — Tehri Dam overtopping scenario',
    time: '3 min ago',
  },
  {
    id: 'notif-002',
    type: 'warning',
    message: 'GEE authentication expired — NRT monitor degraded',
    time: '18 min ago',
  },
  {
    id: 'notif-003',
    type: 'success',
    message: 'Validation benchmark Ritter passed — error norm 0.0023',
    time: '1 hr ago',
  },
  {
    id: 'notif-004',
    type: 'info',
    message: 'New Sentinel-1 acquisition over Teesta basin — 1.2 days old',
    time: '2 hr ago',
  },
];

export default function Topbar() {
  const [notifOpen, setNotifOpen] = useState(false);
  const alertCount = notifications?.filter(
    (n) => n?.type === 'alert' || n?.type === 'warning'
  )?.length;

  return (
    <header className="h-topbar border-b border-border bg-card/80 backdrop-blur-sm flex items-center px-4 gap-4 shrink-0 z-10">
      {/* Search */}
      <div className="flex-1 max-w-sm relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search dams, scenarios, runs…"
          className="w-full bg-input border border-border rounded-md pl-8 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
          ⌘K
        </span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Engine health indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted/50 border border-border text-xs">
          <span className="engine-status-dot engine-online" />
          <span className="text-muted-foreground font-500">Native-FV</span>
          <span className="text-border mx-1">|</span>
          <span className="engine-status-dot engine-online" />
          <span className="text-muted-foreground font-500">Native-SPH</span>
          <span className="text-border mx-1">|</span>
          <span className="engine-status-dot engine-warning" />
          <span className="text-warning font-500">Delft3D</span>
        </div>

        {/* Disclaimer badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded bg-warning-bg border border-warning/30 text-[10px] text-warning font-600">
          <AlertTriangle size={10} />
          Decision-support only
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {alertCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-[9px] font-700 rounded-full flex items-center justify-center">
                {alertCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-1 w-80 glass-panel rounded-lg shadow-elevated z-50 overflow-hidden animate-fade-in-up">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="text-sm font-600 text-foreground">Notifications</span>
                <span className="text-xs text-muted-foreground">
                  {notifications?.length} recent
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications?.map((n) => (
                  <div
                    key={n?.id}
                    className="px-4 py-3 border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {n?.type === 'alert' && <AlertTriangle size={14} className="text-danger" />}
                        {n?.type === 'warning' && (
                          <AlertTriangle size={14} className="text-warning" />
                        )}
                        {n?.type === 'success' && (
                          <CheckCircle2 size={14} className="text-success" />
                        )}
                        {n?.type === 'info' && <Clock size={14} className="text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground leading-relaxed">{n?.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{n?.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 text-center">
                <button className="text-xs text-primary hover:underline">View all activity</button>
              </div>
            </div>
          )}
        </div>

        <button
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
          aria-label="Help"
        >
          <HelpCircle size={18} />
        </button>

        {/* User avatar */}
        <button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-all duration-150">
          <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
            <User size={14} className="text-primary" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-600 text-foreground leading-none">Dr. Anjali Sharma</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">CWC · Analyst</p>
          </div>
        </button>
      </div>
    </header>
  );
}
