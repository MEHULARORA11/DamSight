'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  Database,
  CheckCircle,
  ExternalLink,
  Globe,
  Satellite,
  Map,
  Users,
  Building2,
} from 'lucide-react';

const dataSources = [
  {
    id: 'ds-dem-copernicusglo30',
    category: 'DEM',
    name: 'Copernicus GLO-30',
    resolution: '30 m',
    coverage: 'Global',
    license: 'Open (Copernicus DEM)',
    status: 'available',
    description:
      'Primary DEM for terrain prep. Auto-clipped corridor from dam to downstream stop point. Known limits in narrow valleys noted in UI.',
    url: 'https://spacedata.copernicus.eu/collections/copernicus-digital-elevation-model',
    icon: Globe,
  },
  {
    id: 'ds-dem-srtm',
    category: 'DEM',
    name: 'SRTM 30m',
    resolution: '30 m',
    coverage: 'Global (±60°)',
    license: 'Public domain (NASA)',
    status: 'available',
    description: 'Tier 1 fallback DEM. Void-filled version used. Vertical datum EGM96.',
    url: 'https://www2.jpl.nasa.gov/srtm/',
    icon: Globe,
  },
  {
    id: 'ds-dem-aster',
    category: 'DEM',
    name: 'ASTER GDEM v3',
    resolution: '30 m',
    coverage: 'Global (83°N–83°S)',
    license: 'Open (NASA/METI)',
    status: 'available',
    description: 'Alternative Tier 1 DEM. Higher noise than SRTM in flat areas.',
    url: 'https://asterweb.jpl.nasa.gov/gdem.asp',
    icon: Globe,
  },
  {
    id: 'ds-dem-alos',
    category: 'DEM',
    name: 'ALOS AW3D30',
    resolution: '30 m',
    coverage: 'Global',
    license: 'Open (JAXA)',
    status: 'available',
    description: 'Generally better accuracy than SRTM in vegetated areas. Used as Tier 1 option.',
    url: 'https://www.eorc.jaxa.jp/ALOS/en/aw3d30/',
    icon: Globe,
  },
  {
    id: 'ds-s1',
    category: 'SAR',
    name: 'Sentinel-1 GRD',
    resolution: '10–20 m',
    coverage: 'Global (6-day revisit)',
    license: 'Open (ESA Copernicus)',
    status: 'available',
    description:
      'IW mode, VH polarisation. Used for NRT flood change detection per UN-SPIDER recommended practice. Fallback: Planetary Computer / AWS STAC.',
    url: 'https://sentinel.esa.int/web/sentinel/missions/sentinel-1',
    icon: Satellite,
  },
  {
    id: 'ds-s2',
    category: 'Optical',
    name: 'Sentinel-2 MSI',
    resolution: '10 m',
    coverage: 'Global (5-day revisit)',
    license: 'Open (ESA Copernicus)',
    status: 'available',
    description:
      'Cloud-free context imagery for NRT monitor. NDWI water index for blockage detection.',
    url: 'https://sentinel.esa.int/web/sentinel/missions/sentinel-2',
    icon: Satellite,
  },
  {
    id: 'ds-jrc-gsw',
    category: 'Water',
    name: 'JRC Global Surface Water',
    resolution: '30 m',
    coverage: 'Global',
    license: 'Open (JRC/Google)',
    status: 'available',
    description:
      'Permanent water mask used in Sentinel-1 change detection to remove false positives.',
    url: 'https://global-surface-water.appspot.com/',
    icon: Map,
  },
  {
    id: 'ds-worldpop',
    category: 'Population',
    name: 'WorldPop',
    resolution: '100 m',
    coverage: 'Global',
    license: 'Open (CC BY 4.0)',
    status: 'available',
    description: 'Population density for exposure analysis. Day/night scenario switch supported.',
    url: 'https://www.worldpop.org/',
    icon: Users,
  },
  {
    id: 'ds-openbuildings',
    category: 'Buildings',
    name: 'Google Open Buildings v3',
    resolution: 'Building footprints',
    coverage: 'South Asia (India)',
    license: 'Open (CC BY 4.0)',
    status: 'available',
    description:
      'Building footprints for exposure analysis. OSM fallback where coverage is sparse.',
    url: 'https://sites.research.google/open-buildings/',
    icon: Building2,
  },
  {
    id: 'ds-worldcover',
    category: 'Land Cover',
    name: 'ESA WorldCover 2021',
    resolution: '10 m',
    coverage: 'Global',
    license: 'Open (CC BY 4.0)',
    status: 'available',
    description:
      "Manning's n map source. Editable lookup table with CWC guideline Table 4-2 style defaults. Also used for debris factor (DF) in hazard rating.",
    url: 'https://esa-worldcover.org/',
    icon: Map,
  },
  {
    id: 'ds-geodar',
    category: 'Dam Catalog',
    name: 'GeoDAR / GRanD',
    resolution: 'Point features',
    coverage: 'Global',
    license: 'Open (CC BY 4.0)',
    status: 'available',
    description:
      'Georeferenced dam catalog seeded with CWC NRLD attributes where available. Every attribute marked with source and user-verified toggle.',
    url: 'https://www.globaldamwatch.org/',
    icon: Database,
  },
  {
    id: 'ds-glofas',
    category: 'Hydrology',
    name: 'Open-Meteo Flood API (GloFAS)',
    resolution: '0.1°',
    coverage: 'Global',
    license: 'Open (no key required)',
    status: 'available',
    description:
      'Live/forecast river discharge for sunny-day vs storm-day scenario pairs. No API key required.',
    url: 'https://open-meteo.com/en/docs/flood-api',
    icon: Globe,
  },
  {
    id: 'ds-merit-hydro',
    category: 'Hydrology',
    name: 'MERIT Hydro (HAND)',
    resolution: '90 m',
    coverage: 'Global',
    license: 'Open (CC BY-NC 4.0)',
    status: 'available',
    description:
      'Height Above Nearest Drainage (HAND) used in NRT flood detection to mask high-relief false positives.',
    url: 'http://hydro.iis.u-tokyo.ac.jp/~yamadai/MERIT_Hydro/',
    icon: Map,
  },
];

const categories = [
  'All',
  'DEM',
  'SAR',
  'Optical',
  'Water',
  'Population',
  'Buildings',
  'Land Cover',
  'Dam Catalog',
  'Hydrology',
];

export default function DataSourcesPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? dataSources
      : dataSources?.filter((d) => d?.category === activeCategory);

  return (
    <AppLayout activePath="/data-sources">
      <div className="flex flex-col h-full overflow-hidden bg-background">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <Database size={20} className="text-primary" />
            <div>
              <h1 className="text-base font-700 text-foreground">Data Sources</h1>
              <p className="text-xs text-muted-foreground">
                All datasets with licence, resolution, coverage and provenance chain
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Category filter */}
          <div className="px-6 py-3 border-b border-border shrink-0 flex gap-1.5 overflow-x-auto">
            {categories?.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-600 whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-2">
              {filtered?.map((ds) => (
                <div key={ds?.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      <ds.icon size={15} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-700 text-foreground">{ds?.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {ds?.category}
                        </span>
                        <CheckCircle size={11} className="text-success" />
                        <span className="text-[10px] text-success">Available</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                        {ds?.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-3 text-[9px] font-mono text-muted-foreground">
                        <span>Resolution: {ds?.resolution}</span>
                        <span>Coverage: {ds?.coverage}</span>
                        <span>Licence: {ds?.license}</span>
                      </div>
                    </div>
                    <a
                      href={ds?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                      title="Open source"
                      onClick={(e) => e?.stopPropagation()}
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
