import { useState } from 'react'
import {
  Palette, Bell, Map, Globe, Download, CheckCircle, Wifi,
  Moon, Mail, Smartphone, FileText, Image
} from 'lucide-react'
import toast from 'react-hot-toast'

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-10 h-5.5 rounded-full transition-colors duration-300 flex-shrink-0 ${
        enabled ? 'bg-accent' : 'bg-zinc-700'
      }`}
      style={{ width: 40, height: 22 }}
    >
      <div
        className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform duration-300 ${
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        }`}
        style={{ width: 18, height: 18 }}
      />
    </button>
  )
}

function SettingsSection({ icon: Icon, title, children }) {
  return (
    <div className="bg-slate-950 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="p-2 rounded-lg bg-zinc-900">
          <Icon className="w-4 h-4 text-accent" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

function SettingsRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-sm text-zinc-200">{label}</p>
        {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const [settings, setSettings] = useState({
    emailAlerts: true,
    pushNotifications: false,
    weeklyReport: true,
    defaultZoom: 13,
    mapTile: 'dark_matter',
    includeImages: true,
    autoMonthly: false,
    defaultFormat: 'pdf',
    apiUrl: 'https://api.gopher-ai.dev/v1',
    apiKey: '••••••••••••••••',
  })

  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }))

  return (
    <div className="max-w-3xl space-y-5 animate-fade-in">
      {/* Appearance */}
      <SettingsSection icon={Palette} title="Appearance">
        <SettingsRow label="Theme" description="Active visual profile for the dashboard">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-zinc-400" />
            <span className="text-sm text-zinc-300 font-medium">Dark Industrial</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">Active</span>
          </div>
        </SettingsRow>
        <SettingsRow label="Accent Color" description="Primary brand color used across the interface">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md" style={{ backgroundColor: '#8B1E3F' }} />
            <span className="text-xs text-zinc-400 font-mono">#8B1E3F</span>
          </div>
        </SettingsRow>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection icon={Bell} title="Notifications">
        <SettingsRow label="Email Alerts" description="Receive emails for critical detections">
          <Toggle enabled={settings.emailAlerts} onChange={() => toggle('emailAlerts')} />
        </SettingsRow>
        <SettingsRow label="Push Notifications" description="Browser push for new damage detections">
          <Toggle enabled={settings.pushNotifications} onChange={() => toggle('pushNotifications')} />
        </SettingsRow>
        <SettingsRow label="Weekly Report" description="Auto-send weekly summary via email">
          <Toggle enabled={settings.weeklyReport} onChange={() => toggle('weeklyReport')} />
        </SettingsRow>
      </SettingsSection>

      {/* Map Preferences */}
      <SettingsSection icon={Map} title="Map Preferences">
        <SettingsRow label="Default Zoom Level" description={`Current: ${settings.defaultZoom}`}>
          <input
            type="range"
            min={8}
            max={18}
            value={settings.defaultZoom}
            onChange={(e) => setSettings((s) => ({ ...s, defaultZoom: parseInt(e.target.value) }))}
            className="w-32 accent-accent"
          />
        </SettingsRow>
        <SettingsRow label="Map Tile Style" description="Visual style for map backgrounds">
          <select
            value={settings.mapTile}
            onChange={(e) => setSettings((s) => ({ ...s, mapTile: e.target.value }))}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-colors appearance-none cursor-pointer"
          >
            <option value="dark_matter">Dark Matter</option>
            <option value="voyager">Voyager</option>
            <option value="osm_classic">OSM Classic</option>
          </select>
        </SettingsRow>
        <SettingsRow label="Default Center" description="Hyderabad, India">
          <span className="text-xs text-zinc-400 font-mono">17.385°N, 78.487°E</span>
        </SettingsRow>
      </SettingsSection>

      {/* API Configuration */}
      <SettingsSection icon={Globe} title="API Configuration">
        <SettingsRow label="API Base URL" description="Backend service endpoint">
          <input
            value={settings.apiUrl}
            onChange={(e) => setSettings((s) => ({ ...s, apiUrl: e.target.value }))}
            className="w-64 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-300 font-mono focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </SettingsRow>
        <SettingsRow label="API Key" description="Authentication token">
          <input
            type="password"
            value={settings.apiKey}
            readOnly
            className="w-48 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-400 font-mono focus:outline-none"
          />
        </SettingsRow>
        <SettingsRow label="Connection Status">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-glow-green" />
            <span className="text-xs text-green-400 font-medium">Connected</span>
          </div>
        </SettingsRow>
        <div>
          <button
            onClick={() => toast.success('Connection test passed')}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            <Wifi className="w-4 h-4" />
            Test Connection
          </button>
        </div>
      </SettingsSection>

      {/* Export Defaults */}
      <SettingsSection icon={Download} title="Export Defaults">
        <SettingsRow label="Default Format" description="Preferred file format for exports">
          <div className="flex gap-2">
            {['pdf', 'csv'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSettings((s) => ({ ...s, defaultFormat: fmt }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase transition-colors ${
                  settings.defaultFormat === fmt
                    ? 'bg-accent text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </SettingsRow>
        <SettingsRow label="Include Images" description="Embed damage snapshots in reports">
          <Toggle enabled={settings.includeImages} onChange={() => toggle('includeImages')} />
        </SettingsRow>
        <SettingsRow label="Auto Monthly Reports" description="Generate and save reports automatically">
          <Toggle enabled={settings.autoMonthly} onChange={() => toggle('autoMonthly')} />
        </SettingsRow>
      </SettingsSection>
    </div>
  )
}
