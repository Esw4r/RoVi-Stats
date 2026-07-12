import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import detections from '../../data/detections'
import { MAP_CONFIG } from '../../utils/constants'

function HeatLayer() {
  const map = useMap()

  useEffect(() => {
    let heatLayer = null

    const loadHeat = async () => {
      // leaflet.heat adds L.heatLayer to the global L object
      await import('leaflet.heat')

      const points = detections.map((det) => {
        const intensityMap = { low: 0.3, medium: 0.5, high: 0.7, critical: 1.0 }
        return [det.lat, det.lng, intensityMap[det.severity] || 0.5]
      })

      heatLayer = L.heatLayer(points, {
        radius: 30,
        blur: 20,
        maxZoom: 15,
        max: 1.0,
        gradient: {
          0.2: '#22C55E',
          0.4: '#3B82F6',
          0.6: '#F59E0B',
          0.8: '#EF4444',
          1.0: '#DC2626',
        },
      }).addTo(map)
    }

    loadHeat()

    return () => {
      if (heatLayer) {
        map.removeLayer(heatLayer)
      }
    }
  }, [map])

  return null
}

export default function DamageHeatmap() {
  return (
    <div className="bg-slate-950 border border-zinc-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-zinc-200 mb-1">Damage Heatmap</h3>
      <p className="text-xs text-zinc-500 mb-4">Detection density across the city</p>
      <div className="rounded-lg overflow-hidden border border-zinc-800 h-[320px]">
        <MapContainer
          center={MAP_CONFIG.center}
          zoom={12}
          className="w-full h-full"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url={MAP_CONFIG.tileUrl} />
          <HeatLayer />
        </MapContainer>
      </div>
    </div>
  )
}
