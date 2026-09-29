'use client';
import React, { useEffect, useRef, useState } from 'react';
import { type Dam } from '@/lib/mockData';
import { ZoomIn, ZoomOut, Compass, MapPin } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';

interface MapCanvasProps {
  selectedDam: Dam | null;
  dams: Dam[];
  onDamClick: (dam: Dam) => void;
}

export default function MapCanvas({ selectedDam, dams, onDamClick }: MapCanvasProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredDam, setHoveredDam] = useState<Dam | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => setMapLoaded(true), 800);
    return () => clearTimeout(timer);
    // BACKEND: Replace with MapLibre GL JS initialization
    // const map = new maplibregl.Map({ container: mapRef.current!, style: OSM_STYLE, center: [78.9629, 20.5937], zoom: 4.5 })
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-background" ref={mapRef}>
      {/* Map background simulation */}
      {!mapLoaded ? (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-muted-foreground">Loading map tiles…</p>
          </div>
        </div>
      ) : (
        <>
          {/* Simulated India map background */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 40%, #0d1929 0%, #0a0e1a 100%)',
            }}
          >
            {/* Grid lines simulating map */}
            <svg
              className="absolute inset-0 w-full h-full opacity-10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path
                    d="M 60 0 L 0 0 0 60"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* River lines simulation */}
            <svg
              className="absolute inset-0 w-full h-full opacity-30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 200,100 Q 350,200 300,350 Q 250,500 350,620"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <path
                d="M 500,80 Q 550,180 520,300 Q 490,420 560,530"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              <path
                d="M 700,150 Q 680,280 720,400 Q 760,520 700,640"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              <path
                d="M 150,200 Q 300,250 450,230 Q 600,210 750,260"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <path
                d="M 100,400 Q 280,380 460,410 Q 640,440 800,400"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
            </svg>

            {/* Dam markers */}
            {dams.map((dam, idx) => {
              const x = 120 + (idx % 8) * 100 + Math.floor(idx / 8) * 20;
              const y = 100 + Math.floor(idx / 8) * 120 + (idx % 3) * 30;
              const isSelected = selectedDam?.id === dam.id;
              const markerColor =
                dam.hazardClass === 'high'
                  ? 'var(--danger)'
                  : dam.hazardClass === 'significant'
                    ? 'var(--warning)'
                    : 'var(--success)';

              return (
                <div
                  key={dam.id}
                  className="absolute cursor-pointer transition-transform duration-150 hover:scale-125"
                  style={{ left: x, top: y, transform: isSelected ? 'scale(1.4)' : undefined }}
                  onClick={() => onDamClick(dam)}
                  onMouseEnter={(e) => {
                    setHoveredDam(dam);
                    const rect = mapRef.current?.getBoundingClientRect();
                    if (rect) setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                  }}
                  onMouseLeave={() => setHoveredDam(null)}
                >
                  <div
                    className="w-3 h-3 rounded-full border-2 border-background"
                    style={{
                      background: markerColor,
                      boxShadow: isSelected ? `0 0 12px ${markerColor}` : `0 0 6px ${markerColor}`,
                    }}
                  />
                  {isSelected && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{ background: markerColor, opacity: 0.3 }}
                    />
                  )}
                </div>
              );
            })}

            {/* Hover tooltip */}
            {hoveredDam && (
              <div
                className="map-probe-tooltip absolute z-30 pointer-events-none"
                style={{ left: tooltipPos.x + 12, top: tooltipPos.y - 40 }}
              >
                <p className="font-600 text-foreground text-xs">{hoveredDam.name}</p>
                <p className="text-muted-foreground text-[10px]">
                  {hoveredDam.river} · {hoveredDam.state}
                </p>
                <p className="text-[10px] mt-0.5">
                  <span
                    className={
                      hoveredDam.hazardClass === 'high'
                        ? 'text-danger'
                        : hoveredDam.hazardClass === 'significant'
                          ? 'text-warning'
                          : 'text-success'
                    }
                  >
                    {hoveredDam.hazardClass.toUpperCase()} HAZARD
                  </span>
                  {' · '}H: {hoveredDam.heightM}m
                </p>
              </div>
            )}

            {/* Map attribution */}
            <div className="absolute bottom-1 right-1 text-[9px] text-muted-foreground/50 bg-background/50 px-1 rounded">
              © OpenStreetMap contributors · MapLibre GL JS
            </div>

            {/* Basemap label */}
            <div className="absolute top-3 left-3 text-[10px] text-muted-foreground/70 font-mono bg-background/60 px-2 py-1 rounded">
              OSM Basemap · WGS84 EPSG:4326 · UTM 44N compute
            </div>

            {/* Legend */}
            <div className="absolute top-12 left-3 glass-panel rounded-md p-2.5 text-[10px] space-y-1.5">
              <p className="text-muted-foreground font-600 uppercase tracking-wider text-[9px] mb-1">
                CWC Hazard Class
              </p>
              {[
                { color: 'var(--danger)', label: 'High Hazard' },
                { color: 'var(--warning)', label: 'Significant' },
                { color: 'var(--success)', label: 'Low Hazard' },
              ].map((item) => (
                <div key={`legend-${item.label}`} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map controls */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1">
            {['Satellite', 'Terrain', 'OSM'].map((layer) => (
              <button
                key={`basemap-${layer}`}
                className="px-2.5 py-1 text-[10px] font-600 rounded glass-panel hover:bg-muted/50 transition-all duration-150 text-muted-foreground hover:text-foreground first:text-primary first:border-primary/40"
              >
                {layer}
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
            {[
              { icon: ZoomIn, label: 'Zoom in', key: 'ctrl-zoom-in' },
              { icon: ZoomOut, label: 'Zoom out', key: 'ctrl-zoom-out' },
              { icon: Compass, label: 'Reset bearing', key: 'ctrl-compass' },
              { icon: MapPin, label: 'My location', key: 'ctrl-location' },
            ].map(({ icon: Icon, label, key }) => (
              <button
                key={key}
                className="p-2 glass-panel rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
                aria-label={label}
                title={label}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
