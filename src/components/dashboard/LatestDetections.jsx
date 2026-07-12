import { MapPin, Clock } from 'lucide-react'
import detections from '../../data/detections'
import { DAMAGE_TYPES, SEVERITY_LEVELS } from '../../utils/constants'
import { formatRelative } from '../../utils/formatters'

export default function LatestDetections() {
  const latest = [...detections]
    .sort((a, b) => new Date(b.detectedAt) - new Date(a.detectedAt))
    .slice(0, 5)

  return (
    <div className="bg-slate-950 border border-zinc-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-zinc-200 mb-4">Latest Detections</h3>
      <div className="space-y-3">
        {latest.map((det) => {
          const dtype = DAMAGE_TYPES[det.damageType]
          const sev = SEVERITY_LEVELS[det.severity]
          return (
            <div
              key={det.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 transition-colors"
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: dtype.color, boxShadow: `0 0 8px ${dtype.color}50` }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm text-zinc-200 font-medium truncate">
                    {det.roadName}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span className={dtype.textClass}>{dtype.label}</span>
                  <span>•</span>
                  <span className={sev.textClass}>{sev.label}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-zinc-500 flex-shrink-0">
                <Clock className="w-3 h-3" />
                {formatRelative(det.detectedAt)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
