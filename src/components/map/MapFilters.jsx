import { Eye, EyeOff } from 'lucide-react'
import { DAMAGE_TYPES } from '../../utils/constants'
import useAppStore from '../../store/useAppStore'

export default function MapFilters() {
  const { mapVisibility, toggleMapVisibility } = useAppStore()

  return (
    <div className="space-y-2">
      <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium mb-2">
        Filter Markers
      </p>
      {Object.entries(DAMAGE_TYPES).map(([key, dt]) => (
        <button
          key={key}
          onClick={() => toggleMapVisibility(key)}
          className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
            mapVisibility[key]
              ? 'bg-zinc-800 text-zinc-200'
              : 'bg-transparent text-zinc-500 opacity-50'
          }`}
        >
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{
              backgroundColor: mapVisibility[key] ? dt.color : '#52525b',
              boxShadow: mapVisibility[key] ? `0 0 6px ${dt.color}50` : 'none',
            }}
          />
          <span className="flex-1 text-left">{dt.label}</span>
          {mapVisibility[key] ? (
            <Eye className="w-3.5 h-3.5 text-zinc-400" />
          ) : (
            <EyeOff className="w-3.5 h-3.5 text-zinc-600" />
          )}
        </button>
      ))}
    </div>
  )
}
