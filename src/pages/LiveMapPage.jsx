import { useMemo } from 'react'
import { MapPin, AlertTriangle, Activity } from 'lucide-react'
import LiveMap from '../components/map/LiveMap'
import MapFilters from '../components/map/MapFilters'
import detections from '../data/detections'
import useAppStore from '../store/useAppStore'
import { DAMAGE_TYPES } from '../utils/constants'
import { formatNumber } from '../utils/formatters'

export default function LiveMapPage() {
  const { mapVisibility } = useAppStore()

  const stats = useMemo(() => {
    const visible = detections.filter((d) => mapVisibility[d.damageType])
    const critical = visible.filter((d) => d.severity === 'critical')
    const byType = {}
    Object.keys(DAMAGE_TYPES).forEach((t) => {
      byType[t] = visible.filter((d) => d.damageType === t).length
    })
    return { total: visible.length, critical: critical.length, byType }
  }, [mapVisibility])

  return (
    <div className="flex gap-4 h-[calc(100vh-112px)] animate-fade-in">
      {/* Left Panel */}
      <div className="w-[300px] flex-shrink-0 bg-slate-950 border border-zinc-800 rounded-xl p-5 flex flex-col gap-5 overflow-y-auto">
        {/* Stats Summary */}
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium mb-3">
            Detection Overview
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-zinc-900 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] text-zinc-500 uppercase">Active</span>
              </div>
              <span className="text-xl font-bold text-zinc-100">{stats.total}</span>
            </div>
            <div className="bg-zinc-900 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span className="text-[10px] text-zinc-500 uppercase">Critical</span>
              </div>
              <span className="text-xl font-bold text-red-400">{stats.critical}</span>
            </div>
          </div>
        </div>

        {/* Type Breakdown */}
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium mb-2">
            By Type
          </p>
          <div className="space-y-2">
            {Object.entries(DAMAGE_TYPES).map(([key, dt]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: dt.color }}
                  />
                  <span className="text-xs text-zinc-400">{dt.label}</span>
                </div>
                <span className="text-xs font-semibold text-zinc-200 tabular-nums">
                  {stats.byType[key]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800" />

        {/* Filters */}
        <MapFilters />

        {/* Detection List */}
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium mb-2">
            Recent Detections
          </p>
          <div className="space-y-1.5">
            {detections
              .filter((d) => mapVisibility[d.damageType])
              .sort((a, b) => new Date(b.detectedAt) - new Date(a.detectedAt))
              .slice(0, 8)
              .map((det) => {
                const dt = DAMAGE_TYPES[det.damageType]
                return (
                  <div
                    key={det.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-800/50 transition-colors cursor-pointer"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: dt.color }}
                    />
                    <span className="text-xs text-zinc-300 truncate flex-1">
                      {det.roadName}
                    </span>
                    <span className="text-[10px] text-zinc-600 tabular-nums">
                      {det.confidence > 0.9 ? '●' : '○'}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1">
        <LiveMap />
      </div>
    </div>
  )
}
