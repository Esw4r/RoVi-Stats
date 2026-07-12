import { useMemo } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import DamageMarker from './DamageMarker'
import MapLegend from './MapLegend'
import detections from '../../data/detections'
import useAppStore from '../../store/useAppStore'
import { MAP_CONFIG } from '../../utils/constants'

export default function LiveMap() {
  const { mapVisibility, filters } = useAppStore()

  const filteredDetections = useMemo(() => {
    return detections.filter((det) => {
      if (!mapVisibility[det.damageType]) return false
      if (filters.search) {
        const s = filters.search.toLowerCase()
        if (!det.roadName.toLowerCase().includes(s) && !det.district.toLowerCase().includes(s)) {
          return false
        }
      }
      return true
    })
  }, [mapVisibility, filters.search])

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-zinc-800">
      <MapContainer
        center={MAP_CONFIG.center}
        zoom={MAP_CONFIG.zoom}
        className="w-full h-full"
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          url={MAP_CONFIG.tileUrl}
          attribution={MAP_CONFIG.tileAttribution}
        />
        {filteredDetections.map((det) => (
          <DamageMarker key={det.id} detection={det} />
        ))}
      </MapContainer>
      <MapLegend />
    </div>
  )
}
