import { DAMAGE_TYPES, SEVERITY_LEVELS } from '../../utils/constants'
import { formatDateTime, formatPercent } from '../../utils/formatters'

export default function MarkerPopup({ detection }) {
  const dtype = DAMAGE_TYPES[detection.damageType]
  const sev = SEVERITY_LEVELS[detection.severity]

  return (
    <div className="font-sans text-zinc-100 min-w-[240px]">
      {/* Header */}
      <div className="flex items-start gap-2 mb-3">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
          style={{ backgroundColor: dtype.color, boxShadow: `0 0 6px ${dtype.color}60` }}
        />
        <div>
          <h4 className="text-sm font-semibold text-zinc-100 leading-tight">
            {detection.roadName}
          </h4>
          <p className="text-xs text-zinc-500">{detection.district}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-zinc-800/50 rounded-md px-2.5 py-1.5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Type</span>
          <span className={`text-xs font-medium ${dtype.textClass}`}>{dtype.label}</span>
        </div>
        <div className="bg-zinc-800/50 rounded-md px-2.5 py-1.5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Severity</span>
          <span className={`text-xs font-medium ${sev.textClass}`}>{sev.label}</span>
        </div>
        <div className="bg-zinc-800/50 rounded-md px-2.5 py-1.5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Confidence</span>
          <span className="text-xs font-medium text-zinc-200">{formatPercent(detection.confidence)}</span>
        </div>
        <div className="bg-zinc-800/50 rounded-md px-2.5 py-1.5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Repair Score</span>
          <span className="text-xs font-medium text-zinc-200">{detection.repairScore}/100</span>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mb-3">
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${detection.confidence * 100}%`,
              backgroundColor: dtype.color,
            }}
          />
        </div>
      </div>

      {/* Detection Time */}
      <p className="text-[10px] text-zinc-500">
        Detected: {formatDateTime(detection.detectedAt)}
      </p>
    </div>
  )
}
