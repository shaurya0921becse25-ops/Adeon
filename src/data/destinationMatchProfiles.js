/**
 * Per-destination match dimensions for Trip Match scoring (demo data).
 */

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function seasonFit(winter, summer, monsoon, spring) {
  return {
    winter: { ...winter },
    summer: { ...summer },
    monsoon: { ...monsoon },
    spring: { ...spring },
    flexible: { avg: 0.85 },
  };
}

function monthScores(values) {
  const out = {};
  MONTHS.forEach((m, i) => {
    out[m] = values[i] ?? 0.7;
  });
  return out;
}

/** @type {Record<string, object>} */
export const DESTINATION_MATCH_PROFILES = {
  shimla: {
    vibes: { beaches: 0.1, mountains: 1, heritage: 0.75, food: 0.55, city_lights: 0.15, nature: 0.85, spiritual: 0.6, adventure: 0.7 },
    season: seasonFit(monthScores([0.9, 0.85, 0.7, 0.65, 0.55, 0.4, 0.35, 0.4, 0.55, 0.75, 0.85, 0.95]), monthScores([0.35, 0.4, 0.55, 0.65, 0.7, 0.75, 0.7, 0.65, 0.6, 0.5, 0.4, 0.35]), monthScores([0.5, 0.55, 0.6, 0.55, 0.5, 0.45, 0.75, 0.8, 0.7, 0.45, 0.4, 0.5]), monthScores([0.7, 0.75, 0.8, 0.85, 0.75, 0.5, 0.45, 0.5, 0.65, 0.8, 0.85, 0.8])),
    climate: { cool: 1, mild: 0.85, warm: 0.45, hot: 0.2, any: 0.8 },
    crew: { solo: 0.85, couple: 0.95, friends: 0.8, family: 0.75, family_kids: 0.65, older: 0.7 },
    pace: { slow: 0.95, balanced: 0.85, packed: 0.55 },
    crowds: { quiet: 0.75, lively: 0.45, any: 0.7 },
    mustHaves: { walkable: 0.9, transit: 0.5, vegetarian: 0.85, kid_friendly: 0.6, solo_women: 0.8, limited_walking: 0.55, snow: 0.85, beaches: 0.05 },
    reach: { weekend: 0.7, india: 1, abroad: 0.15, anywhere: 0.5 },
  },
  manali: {
    vibes: { beaches: 0, mountains: 1, heritage: 0.3, food: 0.5, city_lights: 0.1, nature: 0.9, spiritual: 0.45, adventure: 1 },
    season: seasonFit(monthScores([0.85, 0.8, 0.55, 0.45, 0.35, 0.25, 0.3, 0.35, 0.5, 0.7, 0.8, 0.9]), monthScores([0.3, 0.35, 0.5, 0.6, 0.65, 0.7, 0.75, 0.7, 0.55, 0.4, 0.3, 0.25]), monthScores([0.45, 0.5, 0.55, 0.5, 0.45, 0.7, 0.85, 0.8, 0.65, 0.4, 0.35, 0.4]), monthScores([0.55, 0.6, 0.7, 0.75, 0.6, 0.35, 0.3, 0.35, 0.55, 0.75, 0.8, 0.7])),
    climate: { cool: 1, mild: 0.7, warm: 0.35, hot: 0.15, any: 0.75 },
    crew: { solo: 0.9, couple: 0.85, friends: 1, family: 0.7, family_kids: 0.55, older: 0.5 },
    pace: { slow: 0.7, balanced: 0.85, packed: 0.95 },
    crowds: { quiet: 0.65, lively: 0.55, any: 0.7 },
    mustHaves: { walkable: 0.55, transit: 0.35, vegetarian: 0.8, kid_friendly: 0.5, solo_women: 0.75, limited_walking: 0.4, snow: 0.95, beaches: 0 },
    reach: { weekend: 0.65, india: 1, abroad: 0.1, anywhere: 0.45 },
  },
  jaipur: {
    vibes: { beaches: 0, mountains: 0.15, heritage: 1, food: 0.95, city_lights: 0.5, nature: 0.35, spiritual: 0.65, adventure: 0.45 },
    season: seasonFit(monthScores([0.85, 0.9, 0.85, 0.7, 0.45, 0.3, 0.25, 0.3, 0.45, 0.75, 0.85, 0.85]), monthScores([0.25, 0.3, 0.45, 0.55, 0.65, 0.55, 0.35, 0.35, 0.45, 0.55, 0.4, 0.3]), monthScores([0.35, 0.4, 0.45, 0.4, 0.55, 0.75, 0.85, 0.8, 0.7, 0.45, 0.35, 0.35]), monthScores([0.75, 0.8, 0.85, 0.9, 0.75, 0.45, 0.35, 0.4, 0.65, 0.85, 0.9, 0.85])),
    climate: { cool: 0.75, mild: 0.85, warm: 0.7, hot: 0.45, any: 0.8 },
    crew: { solo: 0.8, couple: 0.9, friends: 0.9, family: 0.95, family_kids: 0.85, older: 0.75 },
    pace: { slow: 0.7, balanced: 0.9, packed: 0.75 },
    crowds: { quiet: 0.4, lively: 0.85, any: 0.75 },
    mustHaves: { walkable: 0.65, transit: 0.55, vegetarian: 0.95, kid_friendly: 0.85, solo_women: 0.7, limited_walking: 0.6, snow: 0, beaches: 0 },
    reach: { weekend: 0.55, india: 1, abroad: 0.2, anywhere: 0.55 },
  },
  udaipur: {
    vibes: { beaches: 0, mountains: 0.2, heritage: 1, food: 0.85, city_lights: 0.35, nature: 0.55, spiritual: 0.7, adventure: 0.35 },
    season: seasonFit(monthScores([0.9, 0.9, 0.85, 0.75, 0.5, 0.35, 0.3, 0.35, 0.5, 0.8, 0.9, 0.9]), monthScores([0.3, 0.35, 0.5, 0.6, 0.65, 0.5, 0.35, 0.35, 0.45, 0.55, 0.4, 0.3]), monthScores([0.4, 0.45, 0.5, 0.45, 0.55, 0.7, 0.8, 0.75, 0.65, 0.45, 0.35, 0.4]), monthScores([0.8, 0.85, 0.9, 0.9, 0.8, 0.55, 0.4, 0.45, 0.65, 0.85, 0.9, 0.85])),
    climate: { cool: 0.7, mild: 0.9, warm: 0.75, hot: 0.5, any: 0.85 },
    crew: { solo: 0.85, couple: 1, friends: 0.75, family: 0.9, family_kids: 0.8, older: 0.85 },
    pace: { slow: 1, balanced: 0.85, packed: 0.5 },
    crowds: { quiet: 0.7, lively: 0.5, any: 0.75 },
    mustHaves: { walkable: 0.75, transit: 0.45, vegetarian: 0.9, kid_friendly: 0.8, solo_women: 0.85, limited_walking: 0.7, snow: 0, beaches: 0 },
    reach: { weekend: 0.5, india: 1, abroad: 0.15, anywhere: 0.5 },
  },
  goa: {
    vibes: { beaches: 1, mountains: 0.1, heritage: 0.65, food: 0.9, city_lights: 0.55, nature: 0.6, spiritual: 0.4, adventure: 0.75 },
    season: seasonFit(monthScores([0.95, 0.95, 0.9, 0.85, 0.6, 0.25, 0.2, 0.25, 0.45, 0.85, 0.95, 0.95]), monthScores([0.35, 0.4, 0.55, 0.65, 0.75, 0.85, 0.8, 0.75, 0.7, 0.6, 0.45, 0.35]), monthScores([0.2, 0.25, 0.3, 0.35, 0.55, 0.95, 1, 0.95, 0.85, 0.45, 0.25, 0.2]), monthScores([0.85, 0.9, 0.9, 0.85, 0.7, 0.35, 0.25, 0.3, 0.55, 0.85, 0.9, 0.9])),
    climate: { cool: 0.35, mild: 0.65, warm: 0.95, hot: 0.85, any: 0.8 },
    crew: { solo: 0.9, couple: 0.95, friends: 1, family: 0.8, family_kids: 0.75, older: 0.65 },
    pace: { slow: 0.95, balanced: 0.85, packed: 0.7 },
    crowds: { quiet: 0.45, lively: 0.95, any: 0.85 },
    mustHaves: { walkable: 0.55, transit: 0.45, vegetarian: 0.75, kid_friendly: 0.7, solo_women: 0.75, limited_walking: 0.65, snow: 0, beaches: 1 },
    reach: { weekend: 0.75, india: 1, abroad: 0.25, anywhere: 0.6 },
  },
  tokyo: {
    vibes: { beaches: 0.25, mountains: 0.35, heritage: 0.75, food: 1, city_lights: 1, nature: 0.45, spiritual: 0.55, adventure: 0.65 },
    season: seasonFit(monthScores([0.55, 0.6, 0.75, 0.9, 0.85, 0.7, 0.65, 0.75, 0.85, 0.9, 0.75, 0.6]), monthScores([0.45, 0.5, 0.65, 0.75, 0.8, 0.85, 0.9, 0.9, 0.8, 0.65, 0.5, 0.45]), monthScores([0.6, 0.65, 0.7, 0.75, 0.7, 0.85, 0.8, 0.75, 0.85, 0.7, 0.6, 0.55]), monthScores([0.7, 0.75, 0.85, 0.95, 0.9, 0.75, 0.7, 0.75, 0.85, 0.95, 0.85, 0.7])),
    climate: { cool: 0.65, mild: 0.85, warm: 0.75, hot: 0.55, any: 0.85 },
    crew: { solo: 1, couple: 0.9, friends: 0.95, family: 0.85, family_kids: 0.8, older: 0.75 },
    pace: { slow: 0.55, balanced: 0.85, packed: 0.95 },
    crowds: { quiet: 0.35, lively: 1, any: 0.8 },
    mustHaves: { walkable: 0.85, transit: 1, vegetarian: 0.65, kid_friendly: 0.85, solo_women: 0.95, limited_walking: 0.9, snow: 0.35, beaches: 0.2 },
    reach: { weekend: 0.05, india: 0.35, abroad: 1, anywhere: 0.9 },
  },
  dubai: {
    vibes: { beaches: 0.85, mountains: 0.1, heritage: 0.45, food: 0.8, city_lights: 1, nature: 0.35, spiritual: 0.35, adventure: 0.75 },
    season: seasonFit(monthScores([0.95, 0.95, 0.9, 0.85, 0.65, 0.35, 0.25, 0.3, 0.45, 0.75, 0.9, 0.95]), monthScores([0.25, 0.3, 0.45, 0.55, 0.65, 0.75, 0.7, 0.65, 0.55, 0.45, 0.35, 0.3]), monthScores([0.15, 0.2, 0.25, 0.3, 0.35, 0.45, 0.55, 0.5, 0.35, 0.25, 0.2, 0.2]), monthScores([0.85, 0.9, 0.9, 0.85, 0.75, 0.55, 0.4, 0.45, 0.65, 0.85, 0.9, 0.9])),
    climate: { cool: 0.55, mild: 0.75, warm: 0.85, hot: 0.95, any: 0.75 },
    crew: { solo: 0.85, couple: 0.9, friends: 0.9, family: 1, family_kids: 0.95, older: 0.8 },
    pace: { slow: 0.6, balanced: 0.85, packed: 0.9 },
    crowds: { quiet: 0.4, lively: 0.9, any: 0.8 },
    mustHaves: { walkable: 0.55, transit: 0.75, vegetarian: 0.7, kid_friendly: 0.95, solo_women: 0.85, limited_walking: 0.95, snow: 0, beaches: 0.85 },
    reach: { weekend: 0.1, india: 0.55, abroad: 1, anywhere: 0.85 },
  },
  chandigarh: {
    vibes: { beaches: 0, mountains: 0.35, heritage: 0.55, food: 0.8, city_lights: 0.55, nature: 0.75, spiritual: 0.45, adventure: 0.35 },
    season: seasonFit(monthScores([0.7, 0.75, 0.8, 0.85, 0.75, 0.45, 0.4, 0.45, 0.65, 0.85, 0.8, 0.7]), monthScores([0.35, 0.4, 0.55, 0.65, 0.75, 0.85, 0.8, 0.75, 0.65, 0.5, 0.4, 0.35]), monthScores([0.55, 0.6, 0.65, 0.6, 0.55, 0.5, 0.75, 0.8, 0.7, 0.55, 0.5, 0.55]), monthScores([0.75, 0.8, 0.85, 0.9, 0.85, 0.65, 0.55, 0.6, 0.75, 0.85, 0.8, 0.75])),
    climate: { cool: 0.7, mild: 0.9, warm: 0.75, hot: 0.55, any: 0.85 },
    crew: { solo: 0.8, couple: 0.85, friends: 0.85, family: 1, family_kids: 0.9, older: 0.85 },
    pace: { slow: 0.9, balanced: 0.85, packed: 0.55 },
    crowds: { quiet: 0.75, lively: 0.5, any: 0.8 },
    mustHaves: { walkable: 0.85, transit: 0.65, vegetarian: 0.9, kid_friendly: 0.9, solo_women: 0.85, limited_walking: 0.8, snow: 0.15, beaches: 0 },
    reach: { weekend: 0.85, india: 1, abroad: 0.1, anywhere: 0.5 },
  },
  munnar: {
    vibes: { beaches: 0.05, mountains: 0.95, heritage: 0.25, food: 0.65, city_lights: 0.05, nature: 1, spiritual: 0.55, adventure: 0.65 },
    season: seasonFit(monthScores([0.75, 0.8, 0.85, 0.8, 0.65, 0.35, 0.3, 0.35, 0.45, 0.7, 0.8, 0.75]), monthScores([0.35, 0.4, 0.5, 0.55, 0.6, 0.55, 0.45, 0.45, 0.5, 0.45, 0.4, 0.35]), monthScores([0.55, 0.6, 0.65, 0.6, 0.55, 0.85, 0.95, 0.9, 0.75, 0.45, 0.4, 0.5]), monthScores([0.7, 0.75, 0.8, 0.85, 0.75, 0.45, 0.35, 0.4, 0.6, 0.8, 0.85, 0.8])),
    climate: { cool: 0.85, mild: 0.95, warm: 0.55, hot: 0.25, any: 0.8 },
    crew: { solo: 0.85, couple: 1, friends: 0.75, family: 0.85, family_kids: 0.7, older: 0.8 },
    pace: { slow: 1, balanced: 0.8, packed: 0.45 },
    crowds: { quiet: 0.85, lively: 0.35, any: 0.75 },
    mustHaves: { walkable: 0.5, transit: 0.35, vegetarian: 0.85, kid_friendly: 0.65, solo_women: 0.8, limited_walking: 0.55, snow: 0, beaches: 0.05 },
    reach: { weekend: 0.45, india: 1, abroad: 0.1, anywhere: 0.45 },
  },
  kyoto: {
    vibes: { beaches: 0, mountains: 0.45, heritage: 1, food: 0.9, city_lights: 0.55, nature: 0.75, spiritual: 0.95, adventure: 0.4 },
    season: seasonFit(monthScores([0.45, 0.5, 0.75, 0.95, 0.85, 0.55, 0.5, 0.55, 0.75, 0.9, 0.85, 0.5]), monthScores([0.55, 0.6, 0.7, 0.75, 0.7, 0.65, 0.75, 0.8, 0.7, 0.6, 0.5, 0.45]), monthScores([0.65, 0.7, 0.75, 0.7, 0.65, 0.85, 0.8, 0.75, 0.85, 0.65, 0.55, 0.6]), monthScores([0.75, 0.8, 0.95, 1, 0.95, 0.65, 0.55, 0.6, 0.85, 0.95, 0.9, 0.7])),
    climate: { cool: 0.75, mild: 0.9, warm: 0.7, hot: 0.45, any: 0.85 },
    crew: { solo: 0.95, couple: 1, friends: 0.8, family: 0.85, family_kids: 0.75, older: 0.85 },
    pace: { slow: 0.95, balanced: 0.85, packed: 0.6 },
    crowds: { quiet: 0.65, lively: 0.55, any: 0.75 },
    mustHaves: { walkable: 0.8, transit: 0.9, vegetarian: 0.6, kid_friendly: 0.75, solo_women: 0.9, limited_walking: 0.75, snow: 0.25, beaches: 0 },
    reach: { weekend: 0.05, india: 0.3, abroad: 1, anywhere: 0.85 },
  },
  bangkok: {
    vibes: { beaches: 0.65, mountains: 0.05, heritage: 0.85, food: 1, city_lights: 0.95, nature: 0.45, spiritual: 0.7, adventure: 0.7 },
    season: seasonFit(monthScores([0.95, 0.95, 0.9, 0.85, 0.65, 0.35, 0.3, 0.35, 0.45, 0.75, 0.9, 0.95]), monthScores([0.35, 0.4, 0.45, 0.5, 0.55, 0.65, 0.7, 0.65, 0.55, 0.45, 0.4, 0.35]), monthScores([0.25, 0.3, 0.35, 0.45, 0.65, 0.85, 0.9, 0.85, 0.75, 0.55, 0.35, 0.25]), monthScores([0.85, 0.9, 0.85, 0.8, 0.7, 0.45, 0.35, 0.4, 0.55, 0.75, 0.85, 0.9])),
    climate: { cool: 0.35, mild: 0.65, warm: 0.9, hot: 0.85, any: 0.8 },
    crew: { solo: 0.95, couple: 0.85, friends: 1, family: 0.75, family_kids: 0.65, older: 0.6 },
    pace: { slow: 0.5, balanced: 0.85, packed: 0.95 },
    crowds: { quiet: 0.3, lively: 1, any: 0.85 },
    mustHaves: { walkable: 0.65, transit: 0.85, vegetarian: 0.55, kid_friendly: 0.6, solo_women: 0.75, limited_walking: 0.7, snow: 0, beaches: 0.6 },
    reach: { weekend: 0.05, india: 0.45, abroad: 1, anywhere: 0.85 },
  },
  zurich: {
    vibes: { beaches: 0, mountains: 1, heritage: 0.75, food: 0.8, city_lights: 0.65, nature: 0.85, spiritual: 0.45, adventure: 0.85 },
    season: seasonFit(monthScores([0.75, 0.7, 0.65, 0.75, 0.85, 0.9, 0.95, 0.9, 0.85, 0.8, 0.65, 0.7]), monthScores([0.85, 0.9, 0.85, 0.8, 0.75, 0.8, 0.85, 0.85, 0.75, 0.65, 0.55, 0.6]), monthScores([0.7, 0.75, 0.8, 0.75, 0.7, 0.75, 0.7, 0.65, 0.7, 0.65, 0.6, 0.65]), monthScores([0.7, 0.75, 0.85, 0.95, 0.95, 0.85, 0.8, 0.85, 0.9, 0.85, 0.7, 0.65])),
    climate: { cool: 0.9, mild: 0.85, warm: 0.65, hot: 0.35, any: 0.8 },
    crew: { solo: 0.85, couple: 0.95, friends: 0.85, family: 0.9, family_kids: 0.8, older: 0.9 },
    pace: { slow: 0.85, balanced: 0.9, packed: 0.75 },
    crowds: { quiet: 0.7, lively: 0.55, any: 0.75 },
    mustHaves: { walkable: 0.9, transit: 1, vegetarian: 0.7, kid_friendly: 0.85, solo_women: 0.9, limited_walking: 0.85, snow: 0.75, beaches: 0 },
    reach: { weekend: 0.05, india: 0.25, abroad: 1, anywhere: 0.85 },
  },
};

export const VIBE_OPTIONS = [
  { id: 'beaches', label: 'beaches and water', hint: 'coastlines, bays, and slow seaside days' },
  { id: 'mountains', label: 'mountains and snow', hint: 'peaks, passes, and crisp air' },
  { id: 'heritage', label: 'heritage and old cities', hint: 'forts, lanes, and layered history' },
  { id: 'food', label: 'food and markets', hint: 'street stalls, spice, and local tables' },
  { id: 'city_lights', label: 'city lights and nightlife', hint: 'neon, late bites, and urban energy' },
  { id: 'nature', label: 'nature and wildlife', hint: 'trails, tea hills, and quiet green' },
  { id: 'spiritual', label: 'quiet and spiritual', hint: 'temples, ghats, and reflective pace' },
  { id: 'adventure', label: 'adventure sports', hint: 'trekking, slopes, and active days' },
];

export const TRIP_MATCH_STEPS = [
  'vibe',
  'crew',
  'season',
  'climate',
  'pace',
  'crowds',
  'mustHaves',
  'reach',
  'result',
];
