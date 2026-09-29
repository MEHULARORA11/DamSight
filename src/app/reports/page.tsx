'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  FileOutput,
  Download,
  FileText,
  Map,
  Database,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

const runs = [
  {
    id: 'RUN-2847',
    dam: 'Tehri Dam',
    scenario: 'Overtopping PMF — IS 11223 Class IV',
    engine: 'Native 2D-SWE (FV)',
    status: 'completed',
    date: '2026-09-29',
  },
  {
    id: 'RUN-2848',
    dam: 'Hirakud Dam',
    scenario: 'Controlled Release — 2011-type',
    engine: 'Native SWE-SPH',
    status: 'running',
    date: '2026-09-29',
  },
  {
    id: 'RUN-2865',
    dam: 'Teesta-III',
    scenario: 'GLOF reconstruction — Oct 2023',
    engine: 'Native 2D-SWE (FV)',
    status: 'completed',
    date: '2026-09-28',
  },
];

const exportFormats = [
  {
    id: 'shp',
    label: 'Shapefile (.shp)',
    desc: 'Zipped .shp + .shx + .dbf + .prj — opens in QGIS',
    icon: Map,
    color: 'text-primary',
  },
  {
    id: 'kml',
    label: 'KML/KMZ',
    desc: 'Styled polygons by depth class, time-stamped for Google Earth animation',
    icon: Map,
    color: 'text-accent',
  },
  {
    id: 'geojson',
    label: 'GeoJSON',
    desc: 'Web-compatible vector format with depth/velocity attributes',
    icon: Map,
    color: 'text-success',
  },
  {
    id: 'tif',
    label: 'GeoTIFF / COG',
    desc: 'Max depth, max velocity, arrival time, hazard rasters — correct CRS',
    icon: Database,
    color: 'text-warning',
  },
  {
    id: 'nc',
    label: 'NetCDF (CF)',
    desc: 'CF-compliant time series — depth, velocity, WSE per timestep',
    icon: Database,
    color: 'text-info',
  },
  {
    id: 'csv',
    label: 'CSV',
    desc: 'Hydrographs, exposure tables, settlement arrival times',
    icon: FileText,
    color: 'text-muted-foreground',
  },
  {
    id: 'pdf',
    label: 'EAP PDF',
    desc: 'Auto-generated Emergency Action Plan — CWC guideline aligned',
    icon: FileText,
    color: 'text-danger',
  },
  {
    id: 'cap',
    label: 'CAP 1.2 XML',
    desc: 'NDMA-compatible alert payloads per affected block/village',
    icon: AlertTriangle,
    color: 'text-warning',
  },
];

const eapSections = [
  {
    id: 'eap-1',
    label: 'Inundation Maps',
    desc: 'Title, legend, scale bar, north arrow, date, coordinate grid, CRS',
    done: true,
  },
  {
    id: 'eap-2',
    label: 'Arrival-Time Table',
    desc: 'Per settlement: arrival time, peak depth, hazard class',
    done: true,
  },
  {
    id: 'eap-3',
    label: 'Notification Flowcharts',
    desc: 'Watch / Potential-failure / Failure conditions',
    done: true,
  },
  {
    id: 'eap-4',
    label: 'Contact Tables',
    desc: 'District Magistrate, SDMA, NDRF, dam owner',
    done: true,
  },
  {
    id: 'eap-5',
    label: 'Public Announcement Templates',
    desc: 'English and Hindi (demo mode — sending mocked)',
    done: true,
  },
  {
    id: 'eap-6',
    label: 'Assumptions & Disclaimer',
    desc: 'Engine, DEM, breach parameters, limitations',
    done: true,
  },
];

export default function ReportsPage() {
  const [selectedRun, setSelectedRun] = useState(runs[0]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['shp', 'pdf']);

  const toggleFormat = (id: string) => {
    setSelectedFormats((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <AppLayout activePath="/reports">
      <div className="flex flex-col h-full overflow-hidden bg-background">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <FileOutput size={20} className="text-primary" />
            <div>
              <h1 className="text-base font-700 text-foreground">Reports &amp; Exports</h1>
              <p className="text-xs text-muted-foreground">
                .shp · .kml · GeoTIFF/COG · NetCDF · CSV · EAP PDF · CAP 1.2 XML
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: run selector + format picker */}
            <div className="lg:col-span-2 space-y-5">
              {/* Run selector */}
              <div>
                <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">
                  Select Run
                </p>
                <div className="space-y-2">
                  {runs.map((run) => (
                    <button
                      key={run.id}
                      onClick={() => setSelectedRun(run)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedRun.id === run.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card hover:border-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-600 text-primary">
                              {run.id}
                            </span>
                            <span
                              className={`text-[10px] font-600 ${run.status === 'completed' ? 'text-success' : 'text-warning'}`}
                            >
                              {run.status === 'completed' ? '● completed' : '● running'}
                            </span>
                          </div>
                          <p className="text-xs font-600 text-foreground mt-0.5">{run.dam}</p>
                          <p className="text-[10px] text-muted-foreground">{run.scenario}</p>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {run.date}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Format picker */}
              <div>
                <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">
                  Export Formats
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {exportFormats.map((fmt) => {
                    const selected = selectedFormats.includes(fmt.id);
                    return (
                      <button
                        key={fmt.id}
                        onClick={() => toggleFormat(fmt.id)}
                        className={`text-left p-3 rounded-lg border transition-all ${
                          selected
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-card hover:border-muted-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <fmt.icon size={13} className={fmt.color} />
                          <span className="text-xs font-600 text-foreground">{fmt.label}</span>
                          {selected && <CheckCircle size={11} className="text-primary ml-auto" />}
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          {fmt.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Export button */}
              <button
                disabled={selectedRun.status !== 'completed'}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-600 text-sm hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download size={16} />
                Export {selectedFormats.length} format{selectedFormats.length !== 1 ? 's' : ''} for{' '}
                {selectedRun.id}
              </button>
              {selectedRun.status !== 'completed' && (
                <p className="text-[10px] text-warning text-center -mt-3">
                  Run must be completed before export
                </p>
              )}
            </div>

            {/* Right: EAP sections */}
            <div>
              <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">
                EAP PDF Contents
              </p>
              <div className="space-y-2">
                {eapSections.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-card border border-border"
                  >
                    <CheckCircle size={13} className="text-success mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-600 text-foreground">{s.label}</p>
                      <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-warning-bg/20 border border-warning/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={12} className="text-warning mt-0.5 shrink-0" />
                  <p className="text-[10px] text-warning leading-relaxed">
                    Advisory: EAP is a decision-support starter pack. Not a substitute for a Tier-3
                    study. CAP alerts are in demo mode — sending is mocked.
                  </p>
                </div>
              </div>

              <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border">
                <p className="text-[10px] font-600 text-foreground mb-1">API Endpoints</p>
                <div className="space-y-1 text-[9px] font-mono text-muted-foreground">
                  <p>GET /api/runs/:id/export?format=shp</p>
                  <p>GET /api/runs/:id/export?format=kml</p>
                  <p>GET /api/runs/:id/export?format=tif</p>
                  <p>GET /api/runs/:id/export?format=pdf</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
