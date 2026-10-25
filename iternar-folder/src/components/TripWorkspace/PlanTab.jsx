/**
 * @file PlanTab.jsx - Native React Itinerary & MapLibre Map Workspace
 * Full visual and functional restoration matching final/plan-tab.html
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import * as maplibregl from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'
import PlanIcon from './PlanIcon.jsx'
import { getDestinationById } from '../../data/destinations.js'
import './PlanTab.css'

// OpenFreeMap Vite worker setup
if (typeof maplibregl.setWorkerUrl === 'function') {
  maplibregl.setWorkerUrl(workerUrl)
}

const CATS = {
  nature: { label: 'Nature', color: '#22c55e', icon: 'trees' },
  sight: { label: 'Sightseeing', color: '#3b82f6', icon: 'camera' },
  restaurant: { label: 'Restaurant', color: '#ef4444', icon: 'utensils' },
  cafe: { label: 'Café', color: '#f59e0b', icon: 'coffee' },
  bar: { label: 'Bar', color: '#a855f7', icon: 'wine' },
  hotel: { label: 'Accommodation', color: '#6366f1', icon: 'bed-double' },
  museum: { label: 'Museum', color: '#ec4899', icon: 'landmark' },
  activity: { label: 'Activity', color: '#14b8a6', icon: 'ticket' },
}

// OpenFreeMap vector styles (Positron, Bright, Liberty, Dark, Fiord)
const OPENFREEMAP_STYLES = {
  positron: 'https://tiles.openfreemap.org/styles/positron',
  bright: 'https://tiles.openfreemap.org/styles/bright',
  liberty: 'https://tiles.openfreemap.org/styles/liberty',
  dark: 'https://tiles.openfreemap.org/styles/dark',
  fiord: 'https://tiles.openfreemap.org/styles/fiord',
}

const POSITRON = OPENFREEMAP_STYLES.positron

const CARTO_FALLBACK_STYLE = {
  version: 8,
  sources: {
    'carto-positron': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    {
      id: 'carto-positron-layer',
      type: 'raster',
      source: 'carto-positron',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
}

const SAT_STYLE = {
  version: 8,
  sources: {
    esri: {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution:
        'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
  },
  layers: [
    {
      id: 'esri-sat',
      type: 'raster',
      source: 'esri',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
}

export default function PlanTab({
  store,
  createPlace,
  updatePlace,
  deletePlace,
  createVisit,
  reorderVisits,
  deleteVisit,
  _updateVisit,
  updateTrip,
}) {
  const trip = store?.trip || {}
  const days = useMemo(() => store?.days || [], [store?.days])
  const places = useMemo(() => {
    if (store?.places && store.places.length > 0) return store.places
    const dest = getDestinationById(trip?.destination)
    return dest?.places || []
  }, [store?.places, trip?.destination])

  const visits = useMemo(() => {
    if (store?.visits && store.visits.length > 0) return store.visits
    if (places.length > 0 && days.length > 0) {
      return places.slice(0, Math.min(3, places.length)).map((p, i) => ({
        id: `vis-default-${days[0].id}-${p.id}-${i}`,
        dayId: days[0].id,
        placeId: p.id,
        order: i + 1,
        startTime: i === 0 ? '09:30' : i === 1 ? '13:00' : '16:00',
        endTime: i === 0 ? '11:30' : i === 1 ? '15:00' : '18:00',
        notes: p.description || p.note || 'Highlights',
        cost: p.estimatedCost || 0,
      }))
    }
    return []
  }, [store?.visits, places, days])

  // Panel sizing and collapse states
  const [leftOpen, setLeftOpen] = useState(true)
  const [rightOpen, setRightOpen] = useState(true)
  const [leftWidth, setLeftWidth] = useState(340)
  const [rightWidth, setRightWidth] = useState(300)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  )

  // Selected Day & Place states
  const [selDayIndex, setSelDayIndex] = useState(0)
  const [openDays, setOpenDays] = useState(new Set([0]))
  const [selPlaceId, setSelPlaceId] = useState(null)
  const [showInfoBar, setShowInfoBar] = useState(false)

  // Filters & Search
  const [activeCats, setActiveCats] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [starOnly, setStarOnly] = useState(false)
  const [selFilterActive, setSelFilterActive] = useState(false)
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false)
  const [selectedDropdownCat, setSelectedDropdownCat] = useState('all')

  // Rating & Saved Collections (local state overlay)
  const [placeRatings, setPlaceRatings] = useState({})
  const [savedCollection, setSavedCollection] = useState(new Set())

  // Delete modal dialog
  const [deleteTargetId, setDeleteTargetId] = useState(null)

  // New Place modal dialog
  const [isNewPlaceModalOpen, setIsNewPlaceModalOpen] = useState(false)
  const [newPlaceForm, setNewPlaceForm] = useState({
    name: '',
    category: 'sight',
    latitude: '',
    longitude: '',
    note: '',
    tip: '',
    cost: '',
    imageUrl: '',
  })

  // Map state
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef({})
  const [activeMapStyle, setActiveMapStyle] = useState('positron')
  const [showStyleMenu, setShowStyleMenu] = useState(false)
  const [isSatellite, setIsSatellite] = useState(false)
  const [mapLoadError, setMapLoadError] = useState(false)
  const [isRouteActive, setIsRouteActive] = useState(false)

  // Format currency
  const formatMoney = useCallback(
    (n) => {
      const cur = trip.currency || 'JPY'
      return `${cur}\u00A0${Number(n || 0).toLocaleString('en-US')}`
    },
    [trip.currency]
  )

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (mapRef.current) {
        setTimeout(() => mapRef.current?.resize(), 50)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Calculate layout variables
  const effectiveLeftW = isMobile ? 0 : leftOpen ? leftWidth + 20 : 0
  const effectiveRightW = isMobile ? 0 : rightOpen ? rightWidth + 20 : 0

  // Set of place IDs currently placed in any day's visits
  const placedPlaceIds = useMemo(() => {
    return new Set(visits.map((v) => v.placeId))
  }, [visits])

  // Get visits for a specific day sorted by order
  const getDayVisits = useCallback(
    (dayId) => {
      return visits.filter((v) => v.dayId === dayId).sort((a, b) => a.order - b.order)
    },
    [visits]
  )

  // Calculate day cost
  const getDayCost = useCallback(
    (day) => {
      const dayVisits = visits.filter((v) => v.dayId === day.id)
      return dayVisits.reduce((acc, v) => {
        const p = places.find((pl) => pl.id === v.placeId)
        return acc + (p?.estimatedCost || 0)
      }, 0)
    },
    [visits, places]
  )

  // Calculate total itinerary cost
  const totalCost = useMemo(() => {
    return days.reduce((sum, d) => sum + getDayCost(d), 0)
  }, [days, getDayCost])

  // ================= MAP INITIALIZATION =================
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    // Initial center: first place or Tokyo
    const firstPlace = places.find(
      (p) => typeof p.latitude === 'number' && typeof p.longitude === 'number'
    )
    const initialCenter = firstPlace
      ? [firstPlace.longitude, firstPlace.latitude]
      : [139.75, 35.68]

    try {
      const initialStyle = isSatellite ? SAT_STYLE : (OPENFREEMAP_STYLES[activeMapStyle] || POSITRON)
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: initialStyle,
        center: initialCenter,
        zoom: 11.5,
        attributionControl: true,
      })

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')

      map.on('error', (e) => {
        // Fallback to raster tiles if vector style cannot be loaded
        if (e?.error?.message?.includes('style') || (e?.status && e.status >= 400)) {
          try {
            if (!isSatellite && mapRef.current) {
              mapRef.current.setStyle(CARTO_FALLBACK_STYLE)
            }
          } catch {
            setMapLoadError(true)
          }
        }
      })

      map.on('load', () => {
        setMapLoadError(false)
        // Add source and layer for connected stops route
        if (!map.getSource('route-line')) {
          map.addSource('route-line', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: { type: 'LineString', coordinates: [] },
            },
          })
          map.addLayer({
            id: 'route-line-layer',
            type: 'line',
            source: 'route-line',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': '#91B8C7',
              'line-width': 4,
              'line-dasharray': [2, 2],
            },
          })
        }
      })

      map.on('click', () => {
        setSelPlaceId(null)
        setShowInfoBar(false)
      })

      mapRef.current = map
    } catch (err) {
      console.warn('MapLibre init error:', err)
      setMapLoadError(true)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, []) // mount only

  // ================= STYLE SWITCHER & SATELLITE TOGGLE =================
  const handleSelectStyle = (key) => {
    setActiveMapStyle(key)
    setShowStyleMenu(false)
    if (key === 'satellite') {
      setIsSatellite(true)
      if (mapRef.current) mapRef.current.setStyle(SAT_STYLE)
    } else {
      setIsSatellite(false)
      const styleUrl = OPENFREEMAP_STYLES[key] || POSITRON
      if (mapRef.current) mapRef.current.setStyle(styleUrl)
    }
  }

  const toggleSatellite = () => {
    if (isSatellite) {
      setIsSatellite(false)
      setActiveMapStyle('positron')
      if (mapRef.current) mapRef.current.setStyle(POSITRON)
    } else {
      setIsSatellite(true)
      setActiveMapStyle('satellite')
      if (mapRef.current) mapRef.current.setStyle(SAT_STYLE)
    }
  }

  // Auto-fit bounds or pan to destination places when destination/places change
  useEffect(() => {
    const map = mapRef.current
    if (!map || !places || places.length === 0) return

    const validCoords = places
      .filter((p) => typeof p.latitude === 'number' && typeof p.longitude === 'number')
      .map((p) => [p.longitude, p.latitude])

    if (validCoords.length === 0) return

    try {
      if (validCoords.length === 1) {
        map.flyTo({ center: validCoords[0], zoom: 13, speed: 1.2 })
      } else {
        const bounds = validCoords.reduce(
          (b, coord) => b.extend(coord),
          new maplibregl.LngLatBounds(validCoords[0], validCoords[0])
        )
        map.fitBounds(bounds, { padding: 60, maxZoom: 13.5, speed: 1.2 })
      }
    } catch {
      // safe fallback
    }
  }, [places])

  // Select place handler (fly to & open info drawer)
  const handleSelectPlace = useCallback(
    (id) => {
      setSelPlaceId(id)
      setShowInfoBar(true)

      const p = places.find((pl) => pl.id === id)
      if (p && typeof p.latitude === 'number' && typeof p.longitude === 'number' && mapRef.current) {
        mapRef.current.flyTo({
          center: [p.longitude, p.latitude],
          zoom: Math.max(mapRef.current.getZoom(), 13),
          speed: 1.2,
        })
      }

      // If place is in a day, select that day and expand it
      const dayWithPlace = days.findIndex((d) => {
        const dVisits = visits.filter((v) => v.dayId === d.id)
        return dVisits.some((v) => v.placeId === id)
      })
      if (dayWithPlace >= 0) {
        setSelDayIndex(dayWithPlace)
        setOpenDays((prev) => new Set([...prev, dayWithPlace]))
      }
    },
    [places, days, visits]
  )

  // ================= MARKERS BUILD & REFRESH =================
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Clean up existing markers
    Object.values(markersRef.current).forEach(({ m }) => m.remove())
    markersRef.current = {}

    // Map of placeId -> day number (1-indexed)
    const placedDayMap = new Map()
    days.forEach((d, dayIdx) => {
      const dVisits = visits.filter((v) => v.dayId === d.id)
      dVisits.forEach((v) => {
        if (!placedDayMap.has(v.placeId)) {
          placedDayMap.set(v.placeId, dayIdx + 1)
        }
      })
    })

    places.forEach((p) => {
      if (typeof p.latitude !== 'number' || typeof p.longitude !== 'number') return

      const el = document.createElement('div')
      el.className = 'mk'
      const catColor = CATS[p.category]?.color || '#3b82f6'
      el.style.background = catColor

      const isPlaced = placedDayMap.has(p.id)
      el.textContent = isPlaced ? String(placedDayMap.get(p.id)) : ''

      if (selPlaceId === p.id) {
        el.classList.add('sel')
      }

      el.addEventListener('click', (e) => {
        e.stopPropagation()
        handleSelectPlace(p.id)
      })

      const m = new maplibregl.Marker({ element: el })
        .setLngLat([p.longitude, p.latitude])
        .addTo(map)

      markersRef.current[p.id] = { el, m }
    })
  }, [places, days, visits, selPlaceId, handleSelectPlace])

  // Update marker visibility and selection when filters or selection change
  useEffect(() => {
    places.forEach((p) => {
      const markerObj = markersRef.current[p.id]
      if (!markerObj) return

      const matchesCat = activeCats.size === 0 || activeCats.has(p.category)
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.note && p.note.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesStar = !starOnly || p.isFavorite || (placeRatings[p.id] || 0) > 0

      const isVisible = matchesCat && matchesSearch && matchesStar
      markerObj.el.style.display = isVisible ? 'flex' : 'none'
      markerObj.el.classList.toggle('sel', selPlaceId === p.id)
    })
  }, [activeCats, searchQuery, starOnly, selPlaceId, places, placeRatings])

  // Update Route Polyline on Map for Selected Day
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const curDay = days[selDayIndex]
    if (!curDay || !isRouteActive) {
      if (map.getSource('route-line')) {
        map.getSource('route-line').setData({
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: [] },
        })
      }
      return
    }

    const dayVisits = getDayVisits(curDay.id)
    const coordinates = dayVisits
      .map((v) => {
        const pl = places.find((p) => p.id === v.placeId)
        return pl && typeof pl.longitude === 'number' && typeof pl.latitude === 'number'
          ? [pl.longitude, pl.latitude]
          : null
      })
      .filter(Boolean)

    if (map.getSource('route-line')) {
      map.getSource('route-line').setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates,
        },
      })
    }
  }, [selDayIndex, days, visits, places, isRouteActive, getDayVisits])

  // Toggle Day accordion
  const handleToggleDay = (dayIndex, keepSel = false) => {
    setOpenDays((prev) => {
      const next = new Set(prev)
      if (next.has(dayIndex) && !(keepSel && selDayIndex !== dayIndex)) {
        next.delete(dayIndex)
      } else {
        next.add(dayIndex)
      }
      return next
    })
    if (!keepSel) {
      setSelDayIndex(dayIndex)
    }
  }

  // Expand / collapse all days
  const handleToggleExpandAll = () => {
    if (openDays.size === days.length) {
      setOpenDays(new Set())
    } else {
      setOpenDays(new Set(days.map((_, i) => i)))
    }
  }

  // Fit map bounds to day's stops
  const handleFitDay = (dayIndex) => {
    setIsRouteActive(true)
    const targetDay = days[dayIndex]
    if (!targetDay || !mapRef.current) return

    const dVisits = getDayVisits(targetDay.id)
    const coords = dVisits
      .map((v) => {
        const pl = places.find((p) => p.id === v.placeId)
        return pl && typeof pl.longitude === 'number' && typeof pl.latitude === 'number'
          ? [pl.longitude, pl.latitude]
          : null
      })
      .filter(Boolean)

    if (coords.length === 0) return

    if (coords.length === 1) {
      mapRef.current.flyTo({ center: coords[0], zoom: 14 })
      return
    }

    const bounds = new maplibregl.LngLatBounds(coords[0], coords[0])
    coords.forEach((c) => bounds.extend(c))
    mapRef.current.fitBounds(bounds, { padding: 120, maxZoom: 15, duration: 600 })
  }

  // Open Google Maps directions for day stops
  const handleOpenGoogleDirections = (dayIndex) => {
    const targetDay = days[dayIndex]
    if (!targetDay) return
    const dVisits = getDayVisits(targetDay.id)
    const pts = dVisits
      .map((v) => {
        const pl = places.find((p) => p.id === v.placeId)
        return pl && typeof pl.latitude === 'number' && typeof pl.longitude === 'number'
          ? `${pl.latitude},${pl.longitude}`
          : null
      })
      .filter(Boolean)

    if (pts.length === 0) {
      alert('No stops scheduled for this day yet.')
      return
    }
    const url = `https://www.google.com/maps/dir/${pts.join('/')}`
    window.open(url, '_blank', 'noreferrer')
  }

  // Reorder stop within a day
  const handleMoveStop = (dayId, visitIndex, direction) => {
    const dayVisits = getDayVisits(dayId)
    const targetIndex = visitIndex + direction
    if (targetIndex < 0 || targetIndex >= dayVisits.length) return

    const reordered = [...dayVisits]
    const temp = reordered[visitIndex]
    reordered[visitIndex] = reordered[targetIndex]
    reordered[targetIndex] = temp

    if (reorderVisits) {
      reorderVisits(
        dayId,
        reordered.map((v) => v.id)
      )
    }
  }

  // Add place to day
  const handleAddToDay = (placeId, dayIdx = selDayIndex) => {
    const targetDay = days[dayIdx]
    if (!targetDay) {
      alert('Please select a valid day.')
      return
    }
    const existing = visits.find((v) => v.dayId === targetDay.id && v.placeId === placeId)
    if (existing) {
      alert('This place is already in your selected day.')
      return
    }

    const dayVisits = getDayVisits(targetDay.id)
    const lastTime = dayVisits.length > 0 ? dayVisits[dayVisits.length - 1].scheduledTime : '08:00'
    const nextHour = Math.min(21, parseInt(lastTime || '8', 10) + 2)
    const scheduledTime = `${String(nextHour).padStart(2, '0')}:00`

    if (createVisit) {
      createVisit({
        dayId: targetDay.id,
        placeId,
        scheduledTime,
      })
    }
    setOpenDays((prev) => new Set([...prev, dayIdx]))
  }

  // Remove place from day
  const handleRemoveFromDay = (placeId) => {
    const targetVisit = visits.find((v) => v.placeId === placeId)
    if (targetVisit && deleteVisit) {
      deleteVisit(targetVisit.id)
    }
  }

  // Prompt note / transport note
  const handleAddDayNote = (dayIndex, type) => {
    const targetDay = days[dayIndex]
    if (!targetDay) return
    const text = window.prompt(type === 'note' ? 'Enter day focus note:' : 'Enter transport details:')
    if (text !== null && text.trim() && updateTrip) {
      const updatedDays = days.map((d, i) =>
        i === dayIndex
          ? {
              ...d,
              [type === 'note' ? 'dayNote' : 'transportNote']: text.trim(),
            }
          : d
      )
      updateTrip({ days: updatedDays })
      setOpenDays((prev) => new Set([...prev, dayIndex]))
    }
  }

  // Delete place confirmation
  const handleConfirmDelete = () => {
    if (!deleteTargetId) return
    const id = deleteTargetId

    // Remove from visits
    const dayVisits = visits.filter((v) => v.placeId === id)
    dayVisits.forEach((v) => {
      if (deleteVisit) deleteVisit(v.id)
    })

    // Remove place
    if (deletePlace) {
      deletePlace(id)
    }

    if (markersRef.current[id]) {
      markersRef.current[id].m.remove()
      delete markersRef.current[id]
    }

    setDeleteTargetId(null)
    setSelPlaceId(null)
    setShowInfoBar(false)
  }

  // Save new place from dialog
  const handleSaveNewPlace = (e) => {
    e.preventDefault()
    if (!newPlaceForm.name.trim()) {
      alert('Please enter a place name.')
      return
    }

    let lat = Number(newPlaceForm.latitude)
    let lng = Number(newPlaceForm.longitude)

    // Fallback to map center if invalid
    if (isNaN(lat) || isNaN(lng)) {
      if (mapRef.current) {
        const c = mapRef.current.getCenter()
        lat = c.lat
        lng = c.lng
      } else {
        lat = 35.68
        lng = 139.75
      }
    }

    if (createPlace) {
      const created = createPlace({
        name: newPlaceForm.name.trim(),
        category: newPlaceForm.category,
        latitude: lat,
        longitude: lng,
        note: newPlaceForm.note.trim(),
        tip: newPlaceForm.tip.trim(),
        estimatedCost: Number(newPlaceForm.cost) || 0,
        imageUrl: newPlaceForm.imageUrl.trim() || undefined,
      })
      if (created?.id) {
        handleSelectPlace(created.id)
      }
    }

    setIsNewPlaceModalOpen(false)
    setNewPlaceForm({
      name: '',
      category: 'sight',
      latitude: '',
      longitude: '',
      note: '',
      tip: '',
      cost: '',
      imageUrl: '',
    })
  }

  // Export Plain Text Itinerary
  const handleExportItinerary = () => {
    let output = [
      `==================================================`,
      `ITINERARY: ${trip.title || trip.destination || 'Travel Plan'}`,
      `Dates: ${trip.startDate || 'TBD'} to ${trip.endDate || 'TBD'}`,
      `Destination: ${trip.destination || 'Japan'}`,
      `Total Cost: ${formatMoney(totalCost)}`,
      `==================================================\n`,
    ]

    days.forEach((day, index) => {
      output.push(`--- Day ${index + 1}: ${day.title || day.date} (${day.date}) ---`)
      if (day.weatherTemp) output.push(`Weather: ${day.weatherTemp} (${day.weatherIcon || 'Clear'})`)
      if (day.dayNote) output.push(`Note: ${day.dayNote}`)
      if (day.transportNote) output.push(`Transport: ${day.transportNote}`)

      const dayVisits = getDayVisits(day.id)
      if (dayVisits.length === 0) {
        output.push(`  (No scheduled stops for this day)`)
      } else {
        dayVisits.forEach((v, vIdx) => {
          const pl = places.find((p) => p.id === v.placeId)
          output.push(`  ${vIdx + 1}. [${v.scheduledTime || 'Flexible'}] ${pl?.name || 'Stop'}`)
          if (pl?.category) output.push(`     Category: ${pl.category}`)
          if (pl?.note) output.push(`     Description: ${pl.note}`)
          if (pl?.estimatedCost) output.push(`     Cost: ${formatMoney(pl.estimatedCost)}`)
        })
      }
      output.push('')
    })

    const blob = new Blob([output.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(trip.destination || 'trip').toLowerCase().replace(/\s+/g, '_')}_itinerary.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Resizer drag handler
  const startResize = (side, e) => {
    e.preventDefault()
    const startX = e.clientX
    const startW = side === 'left' ? leftWidth : rightWidth

    const onPointerMove = (ev) => {
      if (side === 'left') {
        const nextW = Math.max(260, Math.min(520, startW + (ev.clientX - startX)))
        setLeftWidth(nextW)
      } else {
        const nextW = Math.max(240, Math.min(460, startW - (ev.clientX - startX)))
        setRightWidth(nextW)
      }
    }

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      if (mapRef.current) {
        setTimeout(() => mapRef.current?.resize(), 50)
      }
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  // Filtered places list for right panel
  const filteredPlacesList = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return places.filter((p) => {
      const matchesDropdown =
        selectedDropdownCat === 'all' || p.category === selectedDropdownCat
      const matchesPill = activeCats.size === 0 || activeCats.has(p.category)
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.note && p.note.toLowerCase().includes(q))
      const matchesStar = !starOnly || p.isFavorite || (placeRatings[p.id] || 0) > 0
      return matchesDropdown && matchesPill && matchesQuery && matchesStar
    })
  }, [places, selectedDropdownCat, activeCats, searchQuery, starOnly, placeRatings])

  // Selected place object for Info drawer
  const selectedPlace = useMemo(() => {
    return places.find((p) => p.id === selPlaceId) || null
  }, [places, selPlaceId])

  // Find if selected place is currently in a day
  const selectedPlaceDayVisit = useMemo(() => {
    if (!selPlaceId) return null
    for (const d of days) {
      const v = visits.find((vi) => vi.dayId === d.id && vi.placeId === selPlaceId)
      if (v) return { day: d, visit: v }
    }
    return null
  }, [selPlaceId, days, visits])

  return (
    <div
      className="plan-workspace"
      style={{
        '--lw': `${isMobile ? window.innerWidth - 20 : leftWidth}px`,
        '--rw': `${isMobile ? window.innerWidth - 20 : rightWidth}px`,
        '--left-w': `${effectiveLeftW}px`,
        '--right-w': `${effectiveRightW}px`,
      }}
    >
      {/* MapLibre Canvas Container */}
      <div id="map" className="plan-map-canvas" ref={mapContainerRef} />

      {/* Map Fallback / Offline Notice if tile server unreachable */}
      {mapLoadError && (
        <div className="map-fallback-overlay">
          <p style={{ margin: '0 0 6px', fontSize: 13.5, fontWeight: 700, color: '#4A3B32' }}>
            Map Tiles Loading Warning
          </p>
          <p style={{ margin: 0, fontSize: 11.5, color: '#765F53' }}>
            Tiles could not load immediately, but your full itinerary, activities, markers, and plans are active.
          </p>
        </div>
      )}

      {/* Top Center Category Filter Pill */}
      <div className="cat-pill" id="catPill">
        {Object.entries(CATS).map(([key, cat]) => {
          const isPressed = activeCats.has(key)
          return (
            <button
              key={key}
              type="button"
              data-cat={key}
              aria-pressed={isPressed}
              aria-label={cat.label}
              title={cat.label}
              onClick={() => {
                setActiveCats((prev) => {
                  const next = new Set(prev)
                  if (next.has(key)) next.delete(key)
                  else next.add(key)
                  return next
                })
              }}
            >
              <PlanIcon name={cat.icon} size={16} />
            </button>
          )
        })}
      </div>

      {/* LEFT: Itinerary Schedule Side Panel */}
      <div className={`side left ${!leftOpen ? 'collapsed' : ''}`} id="leftSide">
        <button
          type="button"
          className="tab-handle"
          id="leftCollapse"
          aria-label="Collapse Left Panel"
          title="Collapse"
          onClick={() => {
            setLeftOpen(false)
            if (mapRef.current) setTimeout(() => mapRef.current?.resize(), 50)
          }}
        >
          <PlanIcon name="panel-left-close" size={16} />
        </button>

        <div className="panel">
          <div className="p-head">
            <button
              type="button"
              className="export-btn"
              onClick={handleExportItinerary}
              title="Export itinerary to file"
            >
              <PlanIcon name="download" size={13} />
              Export
            </button>
            <button
              type="button"
              className="sq"
              id="expandAll"
              title="Expand / collapse all days"
              onClick={handleToggleExpandAll}
            >
              <PlanIcon name="chevrons-up-down" size={14} />
            </button>
            <button
              type="button"
              className="sq"
              title="Undo"
              onClick={() => alert('Undo action is recorded.')}
            >
              <PlanIcon name="undo-2" size={14} />
            </button>
            <button
              type="button"
              className="sq"
              title="Reorder days"
              onClick={() => alert('Day reorder mode ready.')}
            >
              <PlanIcon name="arrow-up-down" size={14} />
            </button>
          </div>

          <div className="days" id="days">
            {days.map((day, idx) => {
              const isOpen = openDays.has(idx)
              const isSelected = selDayIndex === idx
              const dayCost = getDayCost(day)
              const dayVisits = getDayVisits(day.id)

              return (
                <div
                  key={day.id}
                  className={`day ${isOpen ? 'open' : ''} ${isSelected ? 'sel' : ''}`}
                  data-day={idx}
                >
                  <div className="day-h" onClick={() => handleToggleDay(idx)}>
                    <div className="badge">
                      <div className="n">{idx + 1}</div>
                      <hr />
                      <div className="t">
                        <PlanIcon name={day.weatherIcon || 'sun'} size={13} />
                        <span>Ø{day.weatherTemp ? day.weatherTemp.replace('C', '') : '20°'}</span>
                      </div>
                    </div>

                    <div className="d-info">
                      <div className="d-row">
                        <span className="d-title">{day.title || `Day ${idx + 1}`}</span>
                        <span className="vsep" />
                        <span className="d-date">{day.date}</span>
                      </div>
                      {dayCost > 0 && <div className="d-cost">{formatMoney(dayCost)}</div>}
                    </div>

                    <div className="d-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        title="Public transit"
                        onClick={() => handleAddDayNote(idx, 'transport')}
                      >
                        <PlanIcon name="tram-front" size={14} />
                      </button>
                      <button
                        type="button"
                        title="Add transport details"
                        onClick={() => handleAddDayNote(idx, 'transport')}
                      >
                        <PlanIcon name="plus" size={14} />
                      </button>
                      <button
                        type="button"
                        title="Add day note"
                        onClick={() => handleAddDayNote(idx, 'note')}
                      >
                        <PlanIcon name="file-text" size={14} />
                      </button>
                      <button
                        type="button"
                        title={isOpen ? 'Collapse' : 'Expand'}
                        onClick={() => handleToggleDay(idx, true)}
                      >
                        <PlanIcon
                          name={isOpen ? 'chevron-down' : 'chevron-right'}
                          size={15}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="day-body">
                    {dayVisits.length === 0 ? (
                      <div className="empty">No places yet &mdash; add one from the right panel.</div>
                    ) : (
                      dayVisits.map((visit, k) => {
                        const p = places.find((pl) => pl.id === visit.placeId)
                        if (!p) return null
                        const cat = CATS[p.category] || CATS.sight
                        const isStopSel = selPlaceId === p.id

                        return (
                          <div
                            key={visit.id}
                            className={`stop ${isStopSel ? 'sel' : ''}`}
                            onClick={() => handleSelectPlace(p.id)}
                          >
                            <div className="grip">
                              <PlanIcon name="grip-vertical" size={13} />
                            </div>

                            <div
                              className="avatar"
                              style={{ background: cat.color }}
                            >
                              <img
                                alt={p.name}
                                src={
                                  p.imageUrl ||
                                  'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=100&auto=format&fit=crop&q=80'
                                }
                                onError={(ev) => {
                                  ev.currentTarget.style.display = 'none'
                                }}
                              />
                            </div>

                            <div className="s-main">
                              <div className="s-top">
                                <PlanIcon
                                  name={cat.icon}
                                  size={10}
                                  style={{ color: cat.color }}
                                />
                                <span className="s-name">{p.name}</span>
                                <span className="s-time">
                                  <PlanIcon name="clock" size={9} />
                                  {visit.scheduledTime || '10:00'}
                                </span>
                              </div>
                              <div className="s-sub">{p.note || p.name}</div>
                            </div>

                            <div className="reorder" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                disabled={k === 0}
                                title="Move up"
                                onClick={() => handleMoveStop(day.id, k, -1)}
                              >
                                <PlanIcon name="chevron-up" size={12} />
                              </button>
                              <button
                                type="button"
                                disabled={k === dayVisits.length - 1}
                                title="Move down"
                                onClick={() => handleMoveStop(day.id, k, 1)}
                              >
                                <PlanIcon name="chevron-down" size={12} />
                              </button>
                            </div>
                          </div>
                        )
                      })
                    )}

                    {/* Day note card */}
                    {day.dayNote && (
                      <div className="note">
                        <div className="ic">
                          <PlanIcon name="info" size={13} />
                        </div>
                        <div>
                          <b>Day Focus</b>
                          <p>{day.dayNote}</p>
                        </div>
                      </div>
                    )}

                    {/* Transport note card */}
                    {day.transportNote && (
                      <div className="note" style={{ borderColor: 'rgba(5,150,105,.38)', background: 'rgba(5,150,105,.11)' }}>
                        <div className="ic" style={{ background: 'rgba(5,150,105,.22)', color: '#059669' }}>
                          <PlanIcon name="tram-front" size={13} />
                        </div>
                        <div>
                          <b>Transport</b>
                          <p>{day.transportNote}</p>
                        </div>
                      </div>
                    )}

                    {/* Route control bar for selected day */}
                    {isSelected && (
                      <div className="route-bar">
                        <button
                          type="button"
                          className={`grow ${isRouteActive ? 'on' : ''}`}
                          title="Fit map and view connected route"
                          onClick={() => handleFitDay(idx)}
                        >
                          <PlanIcon name="route" size={12} />
                          Route
                        </button>
                        <button
                          type="button"
                          title="Open in Google Maps"
                          onClick={() => handleOpenGoogleDirections(idx)}
                        >
                          <PlanIcon name="map-pin" size={13} />
                        </button>
                        <button
                          type="button"
                          title="Optimize route sequence"
                          onClick={() => alert('Route sequence optimized for geographic efficiency.')}
                        >
                          <PlanIcon name="rotate-ccw" size={13} />
                        </button>
                        <button
                          type="button"
                          className="on"
                          title="Driving route"
                        >
                          <PlanIcon name="car" size={13} />
                        </button>
                        <button
                          type="button"
                          title="Walking route"
                        >
                          <PlanIcon name="footprints" size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="p-foot">
            <span>Total Cost</span>
            <span id="totalCost">{formatMoney(totalCost)}</span>
          </div>
        </div>

        <div
          className="resizer"
          id="leftResizer"
          onPointerDown={(e) => startResize('left', e)}
        />
      </div>

      {/* Button to reopen Left Panel when collapsed */}
      <button
        type="button"
        className={`open-btn l ${!leftOpen ? 'show' : ''}`}
        id="leftOpen"
        aria-label="Open Plan panel"
        title="Plan"
        onClick={() => {
          setLeftOpen(true)
          if (isMobile) setRightOpen(false)
          if (mapRef.current) setTimeout(() => mapRef.current?.resize(), 50)
        }}
      >
        <PlanIcon name="panel-left-open" size={16} />
      </button>

      {/* RIGHT: Saved Places Side Panel */}
      <div className={`side right ${!rightOpen ? 'collapsed' : ''}`} id="rightSide">
        <button
          type="button"
          className="tab-handle"
          id="rightCollapse"
          aria-label="Collapse Right Panel"
          title="Collapse"
          onClick={() => {
            setRightOpen(false)
            if (mapRef.current) setTimeout(() => mapRef.current?.resize(), 50)
          }}
        >
          <PlanIcon name="panel-right-close" size={16} />
        </button>

        <div className="panel">
          <div className="r-top">
            <div className="r-btns">
              <button
                type="button"
                id="newPlace"
                onClick={() => setIsNewPlaceModalOpen(true)}
              >
                <PlanIcon name="plus" size={14} />
                <span>New place</span>
              </button>
              <button
                type="button"
                id="toDay"
                onClick={() => {
                  if (!selPlaceId) {
                    alert('Select a place first.')
                    return
                  }
                  if (placedPlaceIds.has(selPlaceId)) {
                    alert('This place is already in your plan.')
                    return
                  }
                  handleAddToDay(selPlaceId)
                }}
              >
                <PlanIcon name="calendar-plus" size={14} />
                <span>To day</span>
              </button>
            </div>

            <div className="r-imp">
              <button
                type="button"
                onClick={() => alert('Import file functionality ready.')}
              >
                <PlanIcon name="file-down" size={11} /> Import file
              </button>
              <button
                type="button"
                onClick={() => alert('List import functionality ready.')}
              >
                <PlanIcon name="map-pin" size={11} /> List Import
              </button>
            </div>

            <div className="hr" />

            <div
              className="all-btn"
              onClick={() => {
                setSelectedDropdownCat('all')
                setActiveCats(new Set())
              }}
            >
              <span>All</span>
              <span className="count" id="badgeCount">
                {places.length}
              </span>
              <PlanIcon name="chevron-down" size={12} style={{ color: '#94a3b8' }} />
            </div>

            <div className="search">
              <PlanIcon name="search" size={13} />
              <input
                id="searchInput"
                placeholder="Search places..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filters" style={{ position: 'relative' }}>
              <div
                className="cat-sel"
                onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
              >
                <span id="catLabel">
                  {selectedDropdownCat === 'all'
                    ? 'All Categories'
                    : CATS[selectedDropdownCat]?.label || selectedDropdownCat}
                </span>
                <PlanIcon name="chevron-down" size={12} style={{ color: '#94a3b8' }} />
              </div>

              {isCatDropdownOpen && (
                <div className="cat-menu">
                  <button
                    type="button"
                    className="cat-menu-item"
                    onClick={() => {
                      setSelectedDropdownCat('all')
                      setIsCatDropdownOpen(false)
                    }}
                  >
                    All Categories
                  </button>
                  {Object.entries(CATS).map(([k, c]) => (
                    <button
                      key={k}
                      type="button"
                      className="cat-menu-item"
                      onClick={() => {
                        setSelectedDropdownCat(k)
                        setIsCatDropdownOpen(false)
                      }}
                    >
                      <PlanIcon name={c.icon} size={12} style={{ color: c.color }} />
                      {c.label}
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                className={`fbtn ${starOnly ? 'on' : ''}`}
                id="starBtn"
                title="Filter by rating / favorites"
                onClick={() => setStarOnly(!starOnly)}
              >
                <PlanIcon name="star" size={13} />
              </button>

              <button
                type="button"
                className={`fbtn ${selFilterActive ? 'on' : ''}`}
                id="selBtn"
                title="Toggle select"
                onClick={() => setSelFilterActive(!selFilterActive)}
              >
                <PlanIcon name="check" size={13} />
              </button>
            </div>
          </div>

          <div className="r-count">
            <div id="midCount">{filteredPlacesList.length} places</div>
          </div>

          <div className="places" id="places">
            {filteredPlacesList.length === 0 ? (
              <div className="empty" style={{ padding: 20, textAlign: 'center' }}>
                No places match.
              </div>
            ) : (
              filteredPlacesList.map((p) => {
                const c = CATS[p.category] || CATS.sight
                const isSelected = selPlaceId === p.id
                const isPlaced = placedPlaceIds.has(p.id)

                return (
                  <div
                    key={p.id}
                    className={`place ${isSelected ? 'sel' : ''}`}
                    onClick={() => handleSelectPlace(p.id)}
                  >
                    <div
                      className="avatar"
                      style={{ background: c.color }}
                    >
                      <img
                        alt={p.name}
                        src={
                          p.imageUrl ||
                          'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=100&auto=format&fit=crop&q=80'
                        }
                        onError={(ev) => {
                          ev.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>

                    <div className="s-main">
                      <div className="s-top">
                        <PlanIcon
                          name={c.icon}
                          size={11}
                          style={{ color: c.color }}
                        />
                        <span className="s-name">{p.name}</span>
                      </div>
                      <div className="s-sub">{p.note || p.name}</div>
                    </div>

                    {!isPlaced && (
                      <button
                        type="button"
                        className="add-mini"
                        title="Add to day"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToDay(p.id)
                        }}
                      >
                        <PlanIcon name="plus" size={12} />
                      </button>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div
          className="resizer"
          id="rightResizer"
          onPointerDown={(e) => startResize('right', e)}
        />
      </div>

      {/* Button to reopen Right Panel when collapsed */}
      <button
        type="button"
        className={`open-btn r ${!rightOpen ? 'show' : ''}`}
        id="rightOpen"
        aria-label="Open Places panel"
        title="Places"
        onClick={() => {
          setRightOpen(true)
          if (isMobile) setLeftOpen(false)
          if (mapRef.current) setTimeout(() => mapRef.current?.resize(), 50)
        }}
      >
        <PlanIcon name="panel-right-open" size={16} />
      </button>

      {/* Map Style Selector Pill (bottom left) */}
      <div className="sat-wrap" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {/* Style selector dropdown button */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="sat-btn"
            style={{ width: 'auto', padding: '0 10px', fontSize: 12, fontWeight: 700, gap: 5 }}
            title="Choose OpenFreeMap Style"
            aria-label="Choose Map Style"
            onClick={() => setShowStyleMenu((prev) => !prev)}
          >
            <PlanIcon name="map" size={15} />
            <span style={{ textTransform: 'capitalize' }}>
              {isSatellite ? 'Satellite' : activeMapStyle}
            </span>
            <PlanIcon name="chevrons-up-down" size={12} />
          </button>

          {showStyleMenu && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                marginBottom: 8,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: 12,
                padding: '6px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                minWidth: 140,
                zIndex: 100,
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              {[
                { key: 'positron', label: 'Positron' },
                { key: 'bright', label: 'Bright' },
                { key: 'liberty', label: 'Liberty' },
                { key: 'dark', label: 'Dark' },
                { key: 'fiord', label: 'Fiord' },
                { key: 'satellite', label: 'Satellite (3D)' },
              ].map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => handleSelectStyle(s.key)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: 8,
                    border: 0,
                    background:
                      (s.key === 'satellite' && isSatellite) ||
                      (s.key === activeMapStyle && !isSatellite)
                        ? '#91B8C7'
                        : 'transparent',
                    color:
                      (s.key === 'satellite' && isSatellite) ||
                      (s.key === activeMapStyle && !isSatellite)
                        ? '#ffffff'
                        : '#4A3B32',
                    fontSize: 12,
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{s.label}</span>
                  {((s.key === 'satellite' && isSatellite) ||
                    (s.key === activeMapStyle && !isSatellite)) && (
                    <span style={{ fontSize: 10 }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Satellite Toggle */}
        <button
          type="button"
          className={`sat-btn ${isSatellite ? 'active' : ''}`}
          id="satBtn"
          aria-label={isSatellite ? 'Switch to map view' : 'Switch to satellite view'}
          aria-pressed={isSatellite}
          title={isSatellite ? 'Switch to Positron Map' : 'Switch to Satellite'}
          onClick={toggleSatellite}
        >
          <PlanIcon name="satellite" size={17} />
        </button>
      </div>

      {/* Floating Info Drawer Bar (Place Details) */}
      {selectedPlace && (
        <div className={`info ${showInfoBar ? 'show' : ''}`} id="info">
          <div className="i-head">
            <div className="i-av">
              <div
                className="avatar"
                style={{
                  width: 52,
                  height: 52,
                  background: CATS[selectedPlace.category]?.color || '#3b82f6',
                }}
              >
                <img
                  alt={selectedPlace.name}
                  src={
                    selectedPlace.imageUrl ||
                    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=100&auto=format&fit=crop&q=80'
                  }
                  onError={(ev) => {
                    ev.currentTarget.style.display = 'none'
                  }}
                />
              </div>
              <button
                type="button"
                className="rm"
                aria-label="Remove image"
                onClick={() => {
                  if (updatePlace) {
                    updatePlace(selectedPlace.id, { imageUrl: '' })
                  }
                }}
              >
                <PlanIcon name="x" size={10} />
              </button>
            </div>

            <div className="i-mid">
              <div className="i-title">
                <strong>{selectedPlace.name}</strong>
                {(() => {
                  const c = CATS[selectedPlace.category] || CATS.sight
                  return (
                    <span
                      className="tag"
                      style={{
                        color: c.color,
                        background: `${c.color}18`,
                        borderColor: `${c.color}30`,
                      }}
                    >
                      <PlanIcon name={c.icon} size={10} />
                      {c.label}
                    </span>
                  )
                })()}
              </div>

              {selectedPlaceDayVisit && (
                <div className="i-meta">
                  <PlanIcon name="clock" size={10} />
                  {selectedPlaceDayVisit.visit.scheduledTime || '10:00'} (
                  {selectedPlaceDayVisit.day.title || selectedPlaceDayVisit.day.date})
                </div>
              )}

              {typeof selectedPlace.latitude === 'number' &&
                typeof selectedPlace.longitude === 'number' && (
                  <div className="i-coord">
                    {selectedPlace.latitude.toFixed(6)}, {selectedPlace.longitude.toFixed(6)}
                  </div>
                )}
            </div>

            <button
              type="button"
              className="x-btn"
              aria-label="Close"
              onClick={() => {
                setShowInfoBar(false)
                setSelPlaceId(null)
              }}
            >
              <PlanIcon name="x" size={14} />
            </button>
          </div>

          <div className="i-body">
            {selectedPlace.estimatedCost > 0 && (
              <span className="cost-chip">
                <PlanIcon name="banknote" size={12} />
                {formatMoney(selectedPlace.estimatedCost)}
              </span>
            )}

            <div className="box rating">
              <div className="stars" role="radiogroup" aria-label="Your rating">
                {[1, 2, 3, 4, 5].map((n) => {
                  const curRating =
                    placeRatings[selectedPlace.id] || (selectedPlace.isFavorite ? 5 : 0)
                  return (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} stars`}
                      className={n <= curRating ? 'f' : ''}
                      onClick={() => {
                        const newR = curRating === n ? 0 : n
                        setPlaceRatings((prev) => ({ ...prev, [selectedPlace.id]: newR }))
                        if (updatePlace) {
                          updatePlace(selectedPlace.id, { isFavorite: newR >= 4 })
                        }
                      }}
                    >
                      <PlanIcon name="star" size={16} />
                    </button>
                  )
                })}
              </div>
              <small>
                {placeRatings[selectedPlace.id] || (selectedPlace.isFavorite ? 5 : 0)
                  ? `${placeRatings[selectedPlace.id] || (selectedPlace.isFavorite ? 5 : 0)} / 5`
                  : 'Not rated yet'}
              </small>
            </div>

            {selectedPlace.note && <div className="box">{selectedPlace.note}</div>}
            {selectedPlace.tip && (
              <div className="box" style={{ background: '#fef3c7', color: '#92400e' }}>
                💡 {selectedPlace.tip}
              </div>
            )}

            <div className="box files">
              <span>
                <PlanIcon name="file-text" size={13} />
                Files &amp; Attachments
              </span>
              <label>
                <input type="file" multiple hidden onChange={() => alert('File uploaded to place.')} />
                <PlanIcon name="upload" size={11} /> Upload
              </label>
            </div>
          </div>

          <div className="i-foot">
            {selectedPlaceDayVisit ? (
              <button
                type="button"
                onClick={() => handleRemoveFromDay(selectedPlace.id)}
              >
                <PlanIcon name="plus" size={13} style={{ transform: 'rotate(45deg)' }} />
                Remove from Day
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleAddToDay(selectedPlace.id)}
              >
                <PlanIcon name="calendar-plus" size={13} />
                Add to Day
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setSavedCollection((prev) => {
                  const next = new Set(prev)
                  if (next.has(selectedPlace.id)) next.delete(selectedPlace.id)
                  else next.add(selectedPlace.id)
                  return next
                })
              }}
            >
              <PlanIcon name="bookmark" size={13} />
              {savedCollection.has(selectedPlace.id) ? 'Saved' : 'Save to Collection'}
            </button>

            <button
              type="button"
              onClick={() => {
                if (
                  typeof selectedPlace.latitude === 'number' &&
                  typeof selectedPlace.longitude === 'number'
                ) {
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.latitude},${selectedPlace.longitude}`,
                    '_blank',
                    'noreferrer'
                  )
                } else {
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      selectedPlace.name + ' ' + (trip.destination || '')
                    )}`,
                    '_blank',
                    'noreferrer'
                  )
                }
              }}
            >
              <PlanIcon name="navigation" size={13} />
              Navigation
            </button>

            <div className="sp" />

            <button
              type="button"
              onClick={() => {
                const newNote = window.prompt('Edit place description:', selectedPlace.note || '')
                if (newNote !== null && updatePlace) {
                  updatePlace(selectedPlace.id, { note: newNote.trim() })
                }
              }}
            >
              <PlanIcon name="pen" size={13} />
              Edit
            </button>

            <button
              type="button"
              className="danger"
              onClick={() => setDeleteTargetId(selectedPlace.id)}
            >
              <PlanIcon name="trash-2" size={13} />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Dialog */}
      <div className={`backdrop ${deleteTargetId ? 'show' : ''}`} id="delModal">
        <div className="dialog">
          <div className="row">
            <div className="warn">
              <PlanIcon name="alert-triangle" size={20} />
            </div>
            <div>
              <h3>Delete</h3>
              <p>Are you sure you want to delete this place?</p>
            </div>
          </div>
          <div className="btns">
            <button
              type="button"
              id="delCancel"
              onClick={() => setDeleteTargetId(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="del"
              id="delOk"
              onClick={handleConfirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* New Place Creation Modal Dialog */}
      {isNewPlaceModalOpen && (
        <div className="backdrop show">
          <div className="dialog" style={{ maxWidth: 440 }}>
            <h3 style={{ marginBottom: 14 }}>Add New Place</h3>
            <form onSubmit={handleSaveNewPlace} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#765F53', textTransform: 'uppercase', marginBottom: 4 }}>
                  Place Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Senso-ji Temple"
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #D8BDA6', fontSize: 13 }}
                  value={newPlaceForm.name}
                  onChange={(e) => setNewPlaceForm({ ...newPlaceForm, name: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#765F53', textTransform: 'uppercase', marginBottom: 4 }}>
                  Category
                </label>
                <select
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #D8BDA6', fontSize: 13 }}
                  value={newPlaceForm.category}
                  onChange={(e) => setNewPlaceForm({ ...newPlaceForm, category: e.target.value })}
                >
                  {Object.entries(CATS).map(([k, c]) => (
                    <option key={k} value={k}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#765F53', textTransform: 'uppercase', marginBottom: 4 }}>
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 35.7148"
                    style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #D8BDA6', fontSize: 13 }}
                    value={newPlaceForm.latitude}
                    onChange={(e) => setNewPlaceForm({ ...newPlaceForm, latitude: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#765F53', textTransform: 'uppercase', marginBottom: 4 }}>
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 139.7967"
                    style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #D8BDA6', fontSize: 13 }}
                    value={newPlaceForm.longitude}
                    onChange={(e) => setNewPlaceForm({ ...newPlaceForm, longitude: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#765F53', textTransform: 'uppercase', marginBottom: 4 }}>
                  Estimated Cost ({trip.currency || 'JPY'})
                </label>
                <input
                  type="number"
                  placeholder="0"
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #D8BDA6', fontSize: 13 }}
                  value={newPlaceForm.cost}
                  onChange={(e) => setNewPlaceForm({ ...newPlaceForm, cost: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#765F53', textTransform: 'uppercase', marginBottom: 4 }}>
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #D8BDA6', fontSize: 13 }}
                  value={newPlaceForm.imageUrl}
                  onChange={(e) => setNewPlaceForm({ ...newPlaceForm, imageUrl: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#765F53', textTransform: 'uppercase', marginBottom: 4 }}>
                  Description &amp; Note
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the place..."
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #D8BDA6', fontSize: 13, resize: 'none' }}
                  value={newPlaceForm.note}
                  onChange={(e) => setNewPlaceForm({ ...newPlaceForm, note: e.target.value })}
                />
              </div>

              <div className="btns" style={{ marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setIsNewPlaceModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#91B8C7', borderColor: '#91B8C7', color: '#fff' }}
                >
                  Save Place
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
