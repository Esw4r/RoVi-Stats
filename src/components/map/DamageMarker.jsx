import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { DAMAGE_TYPES } from '../../utils/constants'
import MarkerPopup from './MarkerPopup'

function createGlowIcon(damageType) {
  const dt = DAMAGE_TYPES[damageType]
  return L.divIcon({
    className: '',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    html: `<div style="
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: ${dt.color};
      border: 2px solid ${dt.color};
      box-shadow: 0 0 12px 4px ${dt.color}60, 0 0 4px 1px ${dt.color}40;
      opacity: 0.95;
    "></div>`,
  })
}

export default function DamageMarker({ detection }) {
  const icon = createGlowIcon(detection.damageType)

  return (
    <Marker position={[detection.lat, detection.lng]} icon={icon}>
      <Popup maxWidth={300} minWidth={260}>
        <MarkerPopup detection={detection} />
      </Popup>
    </Marker>
  )
}
