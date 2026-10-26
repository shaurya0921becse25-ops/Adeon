import React, { useState } from 'react'
import { Satellite } from 'lucide-react'

/**
 * SatelliteToggle Component
 * Floating MapLibre satellite imagery toggle button matching Abeon WanderWise design.
 */
export default function SatelliteToggle({ map, isSatellite: controlledSatellite, onToggle }) {
  const [internalSatellite, setInternalSatellite] = useState(false)
  const isSatellite = controlledSatellite !== undefined ? controlledSatellite : internalSatellite

  const handleSatelliteToggle = (e) => {
    e?.stopPropagation?.()

    if (onToggle) {
      onToggle()
      return
    }

    if (!map) return

    const nextMode = !isSatellite

    const normalStyle = 'https://tiles.openfreemap.org/styles/positron'

    const satelliteStyle = {
      version: 8,
      sources: {
        esri: {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          attribution: 'Tiles © Esri',
        },
      },
      layers: [
        {
          id: 'satellite-imagery',
          type: 'raster',
          source: 'esri',
        },
      ],
    }

    map.setStyle(nextMode ? satelliteStyle : normalStyle)
    setInternalSatellite(nextMode)
  }

  return (
    <div
      className="satellite-control"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className={`satellite-button ${isSatellite ? 'active' : ''}`}
        onClick={handleSatelliteToggle}
        aria-label={isSatellite ? 'Switch to map view' : 'Switch to satellite view'}
        aria-pressed={isSatellite}
        title={isSatellite ? 'Map view' : 'Satellite view'}
      >
        <Satellite size={18} strokeWidth={1.8} />
      </button>
    </div>
  )
}
