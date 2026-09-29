'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import {
  Map,
  Wand2,
  Activity,
  GitCompare,
  Satellite,
  CheckCircle2,
  FileOutput,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
  ShieldAlert,
  Database,
  Zap,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeType?: 'alert' | 'info' | 'success';
  group?: string;
}

const navItems: NavItem[] = [
  { id: 'nav-portfolio', label: 'Portfolio Map', href: '/', icon: Map, group: 'MONITOR' },
  {
    id: 'nav-wizard',
    label: 'Scenario Wizard',
    href: '/scenario-wizard',
    icon: Wand2,
    group: 'SIMULATE',
  },
  {
    id: 'nav-live',
    label: 'Live Simulation',
    href: '/live-simulation-view',
    icon: Activity,
    badge: '2',
    badgeType: 'info',
    group: 'SIMULATE',
  },
  {
    id: 'nav-compare',
    label: 'Compare Lab',
    href: '/compare-lab',
    icon: GitCompare,
    group: 'SIMULATE',
  },
  {
    id: 'nav-impact',
    label: 'Impact & Loss',
    href: '/impact-loss',
    icon: ShieldAlert,
    badge: '!',
    badgeType: 'alert',
    group: 'ANALYSE',
  },
  {
    id: 'nav-nrt',
    label: 'NRT Monitor',
    href: '/nrt-monitor',
    icon: Satellite,
    badge: 'LIVE',
    badgeType: 'success',
    group: 'ANALYSE',
  },
  {
    id: 'nav-validation',
    label: 'Validation',
    href: '/validation',
    icon: CheckCircle2,
    group: 'ANALYSE',
  },
  {
    id: 'nav-exports',
    label: 'Reports & Exports',
    href: '/reports',
    icon: FileOutput,
    group: 'OUTPUTS',
  },
  { id: 'nav-engines', label: 'Engine Health', href: '/engine-health', icon: Zap, group: 'SYSTEM' },
  { id: 'nav-data', label: 'Data Sources', href: '/data-sources', icon: Database, group: 'SYSTEM' },
  { id: 'nav-layers', label: 'Layer Manager', href: '/layers', icon: Layers, group: 'SYSTEM' },
  { id: 'nav-settings', label: 'Settings', href: '/settings', icon: Settings, group: 'SYSTEM' },
];

const groups = ['MONITOR', 'SIMULATE', 'ANALYSE', 'OUTPUTS', 'SYSTEM'];

interface SidebarProps {
  activePath?: string;
}

export default function Sidebar({ activePath = '/' }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const getBadgeClass = (type?: string) => {
    if (type === 'alert') return 'bg-danger text-white';
    if (type === 'success') return 'bg-success text-background';
    return 'bg-primary text-primary-foreground';
  };

  return (
    <aside
      className="relative flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out shrink-0 z-20"
      style={{ width: collapsed ? '64px' : '240px' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-border min-h-[56px]">
        <div className="shrink-0">
          <AppLogo size={32} />
        </div>
        {!collapsed && (
          <span className="font-sans font-700 text-base text-foreground tracking-tight truncate">
            DamSight
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        {groups.map((group) => {
          const groupItems = navItems.filter((item) => item.group === group);
          if (groupItems.length === 0) return null;
          return (
            <div key={`group-${group}`} className="mb-1">
              {!collapsed && (
                <p className="px-4 py-1.5 text-[10px] font-600 tracking-widest text-muted-foreground uppercase">
                  {group}
                </p>
              )}
              {collapsed && <div className="mx-3 my-1 border-t border-border" />}
              {groupItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePath === item.href;
                return (
                  <div key={item.id} className="relative group/nav px-2 mb-0.5">
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-2 py-2 rounded-md transition-all duration-150 text-sm font-500 ${
                        isActive
                          ? 'sidebar-item-active text-primary'
                          : 'text-muted-foreground sidebar-item-hover'
                      }`}
                    >
                      <Icon
                        size={18}
                        className={`shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                      />
                      {!collapsed && (
                        <>
                          <span className="truncate flex-1">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[10px] font-700 px-1.5 py-0.5 rounded-full leading-none ${getBadgeClass(
                                item.badgeType
                              )}`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                    {/* Tooltip when collapsed */}
                    {collapsed && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 opacity-0 group-hover/nav:opacity-100 pointer-events-none transition-opacity duration-150">
                        <div className="glass-panel text-foreground text-xs font-500 px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-elevated">
                          {item.label}
                          {item.badge && (
                            <span
                              className={`ml-1.5 text-[10px] font-700 px-1 py-0.5 rounded-full ${getBadgeClass(
                                item.badgeType
                              )}`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {/* Badge dot when collapsed */}
                    {collapsed && item.badge && (
                      <span
                        className={`absolute top-1 right-1 w-2 h-2 rounded-full ${getBadgeClass(
                          item.badgeType
                        )}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-2 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150 text-xs font-500"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <ChevronLeft size={16} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
