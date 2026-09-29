'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Settings, User, Globe, Sliders, Shield, Bell, Save, CheckCircle } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'simulation', label: 'Simulation Defaults', icon: Sliders },
  { id: 'display', label: 'Display & Units', icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security & Roles', icon: Shield },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('simulation');
  const [saved, setSaved] = useState(false);

  // Simulation defaults state
  const [cflMax, setCflMax] = useState('0.5');
  const [wetDryThreshold, setWetDryThreshold] = useState('0.001');
  const [defaultResolution, setDefaultResolution] = useState('30');
  const [defaultEngine, setDefaultEngine] = useState('native-fv');
  const [defaultDEM, setDefaultDEM] = useState('copernicus-glo30');
  const [mcN, setMcN] = useState('200');

  // Display state
  const [units, setUnits] = useState('SI');
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [colorBlindSafe, setColorBlindSafe] = useState(true);

  // Notification state
  const [notifyRunComplete, setNotifyRunComplete] = useState(true);
  const [notifyRunFailed, setNotifyRunFailed] = useState(true);
  const [notifyNRT, setNotifyNRT] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppLayout activePath="/settings">
      <div className="flex flex-col h-full overflow-hidden bg-background">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <Settings size={20} className="text-primary" />
            <div>
              <h1 className="text-base font-700 text-foreground">Settings</h1>
              <p className="text-xs text-muted-foreground">
                Simulation defaults · Display preferences · Notifications · Security
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Sidebar nav */}
          <div className="w-48 shrink-0 border-r border-border p-3 space-y-1">
            {sections?.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-600 transition-all ${
                  activeSection === id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeSection === 'profile' && (
              <div className="max-w-lg space-y-4">
                <h2 className="text-sm font-700 text-foreground">Profile</h2>
                {[
                  { label: 'Full Name', placeholder: 'Dr. Ananya Sharma', type: 'text' },
                  { label: 'Organisation', placeholder: 'CWC / NDMA / Dam Owner', type: 'text' },
                  { label: 'Role', placeholder: 'Analyst', type: 'text' },
                  { label: 'Email', placeholder: 'analyst@cwc.gov.in', type: 'email' },
                ]?.map(({ label, placeholder, type }) => (
                  <div key={label}>
                    <label className="block text-xs font-600 text-muted-foreground mb-1">
                      {label}
                    </label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-600 text-muted-foreground mb-1">
                    Role (system)
                  </label>
                  <select className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-all">
                    <option>Analyst</option>
                    <option>Viewer</option>
                    <option>Dam Owner</option>
                    <option>Admin</option>
                  </select>
                </div>
              </div>
            )}

            {activeSection === 'simulation' && (
              <div className="max-w-lg space-y-4">
                <h2 className="text-sm font-700 text-foreground">Simulation Defaults</h2>
                <p className="text-xs text-muted-foreground">
                  These values are used as defaults for new scenarios. All can be overridden
                  per-run.
                </p>

                <div>
                  <label className="block text-xs font-600 text-muted-foreground mb-1">
                    Default Engine
                  </label>
                  <select
                    value={defaultEngine}
                    onChange={(e) => setDefaultEngine(e?.target?.value)}
                    className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                  >
                    <option value="native-fv">Native 2D-SWE (Delft3D-class, FV)</option>
                    <option value="native-sph">Native SWE-SPH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-600 text-muted-foreground mb-1">
                    Default DEM Source
                  </label>
                  <select
                    value={defaultDEM}
                    onChange={(e) => setDefaultDEM(e?.target?.value)}
                    className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                  >
                    <option value="copernicus-glo30">Copernicus GLO-30 (30m)</option>
                    <option value="srtm">SRTM 30m</option>
                    <option value="aster">ASTER GDEM v3</option>
                    <option value="alos">ALOS AW3D30</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-600 text-muted-foreground mb-1">
                    Default Grid Resolution (m)
                  </label>
                  <input
                    type="number"
                    value={defaultResolution}
                    onChange={(e) => setDefaultResolution(e?.target?.value)}
                    className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-600 text-muted-foreground mb-1">
                    Max CFL Number
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="1.0"
                    value={cflMax}
                    onChange={(e) => setCflMax(e?.target?.value)}
                    className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Recommended ≤ 0.5 for stability
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-600 text-muted-foreground mb-1">
                    Wet/Dry Threshold (m)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={wetDryThreshold}
                    onChange={(e) => setWetDryThreshold(e?.target?.value)}
                    className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-600 text-muted-foreground mb-1">
                    Monte Carlo N (breach uncertainty)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={mcN}
                    onChange={(e) => setMcN(e?.target?.value)}
                    className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Max 500 on fast 1D/level-pool path
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'display' && (
              <div className="max-w-lg space-y-4">
                <h2 className="text-sm font-700 text-foreground">Display &amp; Units</h2>

                <div>
                  <label className="block text-xs font-600 text-muted-foreground mb-1">
                    Unit System
                  </label>
                  <div className="flex gap-2">
                    {['SI', 'Imperial']?.map((u) => (
                      <button
                        key={u}
                        onClick={() => setUnits(u)}
                        className={`px-4 py-2 rounded-md text-xs font-600 border transition-all ${
                          units === u
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card text-muted-foreground border-border hover:text-foreground'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    SI units used internally; display only
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-600 text-muted-foreground mb-1">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e?.target?.value)}
                    className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-600 text-muted-foreground mb-1">Theme</label>
                  <div className="flex gap-2">
                    {['dark', 'light']?.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`px-4 py-2 rounded-md text-xs font-600 border transition-all capitalize ${
                          theme === t
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card text-muted-foreground border-border hover:text-foreground'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                  <div>
                    <p className="text-xs font-600 text-foreground">Colour-blind safe depth ramp</p>
                    <p className="text-[10px] text-muted-foreground">
                      No red/green-only encoding — Defra FD2320
                    </p>
                  </div>
                  <button
                    onClick={() => setColorBlindSafe(!colorBlindSafe)}
                    className={`w-10 h-5 rounded-full transition-all relative ${colorBlindSafe ? 'bg-primary' : 'bg-muted'}`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${colorBlindSafe ? 'left-5' : 'left-0.5'}`}
                    />
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="max-w-lg space-y-3">
                <h2 className="text-sm font-700 text-foreground">Notifications</h2>
                {[
                  {
                    label: 'Run completed',
                    desc: 'Notify when a simulation run finishes',
                    value: notifyRunComplete,
                    set: setNotifyRunComplete,
                  },
                  {
                    label: 'Run failed',
                    desc: 'Notify when a run encounters an error',
                    value: notifyRunFailed,
                    set: setNotifyRunFailed,
                  },
                  {
                    label: 'NRT new acquisition',
                    desc: 'Notify when new Sentinel-1 data is available',
                    value: notifyNRT,
                    set: setNotifyNRT,
                  },
                ]?.map(({ label, desc, value, set }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
                  >
                    <div>
                      <p className="text-xs font-600 text-foreground">{label}</p>
                      <p className="text-[10px] text-muted-foreground">{desc}</p>
                    </div>
                    <button
                      onClick={() => set(!value)}
                      className={`w-10 h-5 rounded-full transition-all relative ${value ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${value ? 'left-5' : 'left-0.5'}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'security' && (
              <div className="max-w-lg space-y-4">
                <h2 className="text-sm font-700 text-foreground">Security &amp; Roles</h2>
                <div className="p-3 rounded-lg bg-muted/30 border border-border text-[10px] text-muted-foreground space-y-1">
                  <p className="font-600 text-foreground">Supabase Auth + Row Level Security</p>
                  <p>
                    All tables protected by RLS. Private storage buckets with signed URLs. Audit log
                    of runs/exports. Rate limiting and input validation (zod) on all endpoints.
                  </p>
                </div>
                <div className="space-y-2">
                  {[
                    { role: 'Viewer', desc: 'Read-only access to runs and exports' },
                    { role: 'Analyst', desc: 'Create and run scenarios, export results' },
                    { role: 'Dam Owner', desc: 'Manage dam catalog entries and attributes' },
                    { role: 'Admin', desc: 'Full access including user management and audit log' },
                  ]?.map(({ role, desc }) => (
                    <div
                      key={role}
                      className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg"
                    >
                      <Shield size={14} className="text-primary shrink-0" />
                      <div>
                        <p className="text-xs font-600 text-foreground">{role}</p>
                        <p className="text-[10px] text-muted-foreground">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save button */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2 rounded-md bg-primary text-primary-foreground text-xs font-600 hover:opacity-90 active:scale-[0.99] transition-all"
              >
                <Save size={13} />
                Save Changes
              </button>
              {saved && (
                <div className="flex items-center gap-1.5 text-success text-xs font-600">
                  <CheckCircle size={13} />
                  Saved
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
