'use client';
import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { type Dam } from '@/lib/mockData';
import Link from 'next/link';

interface DamListPanelProps {
  dams: Dam[];
  selectedDam: Dam | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  hazardFilter: string;
  setHazardFilter: (f: string) => void;
  onSelect: (dam: Dam) => void;
}

const hazardOptions = [
  { id: 'filter-all', value: 'all', label: 'All hazard' },
  { id: 'filter-high', value: 'high', label: 'High' },
  { id: 'filter-significant', value: 'significant', label: 'Significant' },
  { id: 'filter-low', value: 'low', label: 'Low' },
];

export default function DamListPanel({
  dams,
  selectedDam,
  searchQuery,
  setSearchQuery,
  hazardFilter,
  setHazardFilter,
  onSelect,
}: DamListPanelProps) {
  const filtered = dams.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.river.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchHazard = hazardFilter === 'all' || d.hazardClass === hazardFilter;
    return matchSearch && matchHazard;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-3 border-b border-border">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-600 text-foreground">Dam Catalog</h2>
          <Link
            href="/scenario-wizard"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary text-primary-foreground text-xs font-600 rounded-md hover:opacity-90 active:scale-95 transition-all duration-150"
          >
            <Plus size={12} />
            New Scenario
          </Link>
        </div>
        {/* Search */}
        <div className="relative mb-2">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search dam, river, state…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-input border border-border rounded-md pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        {/* Filters */}
        <div className="flex items-center gap-1.5">
          <Filter size={12} className="text-muted-foreground" />
          {hazardOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setHazardFilter(opt.value)}
              className={`px-2 py-0.5 rounded text-[10px] font-600 transition-all duration-150 ${
                hazardFilter === opt.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="px-3 py-1.5 border-b border-border/50">
        <p className="text-[10px] text-muted-foreground">
          {filtered.length} of {dams.length} dams
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
            <p className="text-sm font-600 text-foreground mb-1">No dams found</p>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filtered.map((dam) => {
              const isSelected = selectedDam?.id === dam.id;
              return (
                <button
                  key={dam.id}
                  onClick={() => onSelect(dam)}
                  className={`w-full text-left p-2.5 rounded-md border transition-all duration-150 group ${
                    isSelected
                      ? 'border-primary/50 bg-info-bg'
                      : 'border-transparent hover:border-border hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Dam type icon */}
                    <div
                      className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-[10px] font-700 ${
                        dam.type === 'Earthen Embankment'
                          ? 'bg-warning-bg text-warning'
                          : dam.type === 'Concrete Gravity'
                            ? 'bg-info-bg text-primary'
                            : dam.type === 'Arch'
                              ? 'bg-muted text-muted-foreground'
                              : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {dam.type === 'Earthen Embankment'
                        ? 'EMB'
                        : dam.type === 'Concrete Gravity'
                          ? 'CG'
                          : dam.type === 'Arch'
                            ? 'AR'
                            : 'RB'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className="text-xs font-600 text-foreground truncate">{dam.name}</p>
                        <StatusBadge variant={dam.hazardClass as 'high' | 'significant' | 'low'} />
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {dam.river} · {dam.state}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground font-mono">
                          H: {dam.heightM}m
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {dam.storageGm3} Mm³
                        </span>
                        {dam.lastRunStatus && (
                          <StatusBadge
                            variant={dam.lastRunStatus as 'completed' | 'running' | 'failed'}
                            label={dam.lastRunStatus === 'completed' ? '✓ Run' : dam.lastRunStatus}
                            size="sm"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center">
          Sources: GeoDAR v1.1 · CWC NRLD 2023 · User-verified attributes marked ✓
        </p>
      </div>
    </div>
  );
}
