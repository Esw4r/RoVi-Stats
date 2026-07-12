import { DAMAGE_TYPES } from '../../utils/constants'

export default function MapLegend() {
  return (
    <div className="absolute bottom-4 right-4 z-[1000] bg-slate-950/90 backdrop-blur-sm border border-zinc-800 rounded-lg p-3">
      <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium mb-2">Legend</p>
      <div className="space-y-1.5">
        {Object.entries(DAMAGE_TYPES).map(([key, dt]) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: dt.color, boxShadow: `0 0 6px ${dt.color}50` }}
            />
            <span className="text-xs text-zinc-300">{dt.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
