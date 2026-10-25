import destinationsMeta from '../../data/destinations.json'
import { SHIMLA_PLACES } from './places/shimla.js'
import { JAIPUR_PLACES } from './places/jaipur.js'
import { JAPAN_PLACES } from './places/japan.js'
import { DUBAI_PLACES } from './places/dubai.js'
import { chandigarhPlaces } from './places/chandigarh.js'

const normalizePlaces = (places) =>
  places.map((p) => ({
    ...p,
    image: p.image || p.imageUrl,
    imageUrl: p.imageUrl || p.image,
    note: p.note || p.description,
  }))

export const DESTINATIONS = {
  shimla: {
    ...destinationsMeta.shimla,
    places: normalizePlaces(SHIMLA_PLACES),
  },
  jaipur: {
    ...destinationsMeta.jaipur,
    places: normalizePlaces(JAIPUR_PLACES),
  },
  japan: {
    ...destinationsMeta.japan,
    places: normalizePlaces(JAPAN_PLACES),
  },
  dubai: {
    ...destinationsMeta.dubai,
    places: normalizePlaces(DUBAI_PLACES),
  },
  chandigarh: {
    ...destinationsMeta.chandigarh,
    places: normalizePlaces(chandigarhPlaces),
  },
}

export const DESTINATION_LIST = Object.values(DESTINATIONS)

export function getDestinationById(id) {
  if (!id) return DESTINATIONS.japan
  const key = String(id).toLowerCase().trim()
  if (key.includes('shimla')) return DESTINATIONS.shimla
  if (key.includes('jaipur')) return DESTINATIONS.jaipur
  if (key.includes('dubai')) return DESTINATIONS.dubai
  if (key.includes('chandigarh')) return DESTINATIONS.chandigarh
  if (key.includes('japan') || key.includes('tokyo') || key.includes('kyoto')) return DESTINATIONS.japan
  return DESTINATIONS[key] || DESTINATIONS.japan
}
