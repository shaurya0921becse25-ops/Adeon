/**
 * @file foodGuideData.js - Curated authentic food guide datasets for all 5 destinations
 * Data source: data/food_guide.json
 */
import foodGuides from '../../data/food_guide.json'

export const DESTINATION_FOOD_GUIDES = foodGuides

export function getFoodGuideForDestination(destinationName = '') {
  const key = String(destinationName).toLowerCase().trim()
  if (key.includes('shimla')) return DESTINATION_FOOD_GUIDES.shimla
  if (key.includes('jaipur')) return DESTINATION_FOOD_GUIDES.jaipur
  if (key.includes('dubai')) return DESTINATION_FOOD_GUIDES.dubai
  if (key.includes('chandigarh')) return DESTINATION_FOOD_GUIDES.chandigarh
  return DESTINATION_FOOD_GUIDES.japan
}
