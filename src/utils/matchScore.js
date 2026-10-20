import { PILOT_CITIES } from '../data/destinations';
import { DESTINATION_MATCH_PROFILES } from '../data/destinationMatchProfiles';

const WEIGHTS = {
  vibe: 25,
  scenery: 20,
  season: 10,
  climate: 10,
  crew: 15,
  pace: 10,
  mustHaves: 10,
};

const DIMENSION_LABELS = {
  vibe: 'travel mood',
  scenery: 'scenery',
  season: 'season',
  climate: 'climate comfort',
  crew: "who's coming",
  pace: 'pace',
  mustHaves: 'must-haves',
};

function avg(arr) {
  if (!arr || !arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/** Map quiz scenery options to profile attributes */
function sceneryScore(profile, answers) {
  const scenery = answers.scenery || '';
  if (!scenery) return 0.75;

  switch (scenery) {
    case 'mountains':
      return Math.max(profile.vibes?.mountains ?? 0.3, profile.mustHaves?.snow ? 0.9 : 0.4);
    case 'heritage':
      return Math.max(profile.vibes?.heritage ?? 0.3, profile.vibes?.spiritual ?? 0.3);
    case 'beaches':
      return profile.vibes?.beaches ?? 0.3;
    case 'neon_city':
      return profile.vibes?.city_lights ?? 0.3;
    case 'tranquil_lakes':
      return Math.max(profile.vibes?.nature ?? 0.3, profile.vibes?.peaceful ?? (profile.pace?.slow ? 0.8 : 0.5));
    default:
      return 0.7;
  }
}

/** Map quiz vibe / mood options to profile attributes */
function vibeScore(profile, answers) {
  let vibes = answers.vibe;
  if (!vibes) return 0.7;
  if (typeof vibes === 'string') {
    vibes = [vibes];
  }
  if (!Array.isArray(vibes) || vibes.length === 0) return 0.7;

  const scores = vibes.map((v) => {
    // Map quiz vibe IDs to profile keys
    if (v === 'slow') return (profile.pace?.slow ?? 0.8) * 0.7 + (profile.vibes?.nature ?? 0.7) * 0.3;
    if (v === 'thrill') return (profile.vibes?.adventure ?? 0.7) * 0.7 + (profile.pace?.packed ?? 0.7) * 0.3;
    if (v === 'foodie') return profile.vibes?.food ?? 0.7;
    if (v === 'culture') return (profile.vibes?.heritage ?? 0.7) * 0.6 + (profile.vibes?.spiritual ?? 0.6) * 0.4;
    return profile.vibes?.[v] ?? 0.6;
  });

  return avg(scores);
}

/** Map quiz companion / travelers option to profile attributes */
function crewScore(profile, answers) {
  const crewKey = answers.travelers || answers.crew || 'solo';
  const mapped = crewKey === 'family' ? 'family' : crewKey;
  return profile.crew?.[mapped] ?? profile.crew?.solo ?? 0.75;
}

/** Map signature moment to bonus affinity */
function momentBonus(cityId, moment) {
  if (!moment) return 0;
  const bonuses = {
    snow_chai: ['shimla', 'manali'],
    sunset_boat: ['udaipur', 'goa', 'chandigarh'],
    night_ramen: ['tokyo', 'bangkok'],
    palace_twilight: ['jaipur', 'udaipur'],
    alpine_train: ['shimla', 'tokyo', 'zurich'],
  };
  const list = bonuses[moment];
  if (list && list.includes(cityId)) return 6;
  return 0;
}

function seasonScore(profile, answers) {
  const { season = 'flexible', seasonMonth } = answers;
  if (season === 'flexible') {
    return profile.season?.flexible?.avg ?? 0.85;
  }
  const bucket = profile.season?.[season];
  if (!bucket) return 0.7;
  if (seasonMonth && bucket[seasonMonth] != null) return bucket[seasonMonth];
  const vals = Object.values(bucket).filter((v) => typeof v === 'number');
  return avg(vals);
}

function mustHaveScore(profile, answers) {
  const needs = Array.isArray(answers.mustHaves) ? answers.mustHaves : [];
  if (!needs.length) return { score: 0.85, flags: [] };
  const scores = needs.map((n) => ({ id: n, val: profile.mustHaves?.[n] ?? 0.4 }));
  const flags = scores.filter((s) => s.val < 0.45).map((s) => s.id);
  const raw = avg(scores.map((s) => s.val));
  const capped = flags.length ? Math.min(raw, 0.55) : raw;
  return { score: capped, flags };
}

export function scoreDestination(city, answers = {}) {
  const profile = DESTINATION_MATCH_PROFILES[city.id] || {
    vibes: { mountains: 0.7, nature: 0.7, food: 0.7, heritage: 0.7 },
    climate: { any: 0.8 },
    crew: { solo: 0.8, couple: 0.8, friends: 0.8, family: 0.8 },
    pace: { slow: 0.8, balanced: 0.8, packed: 0.7 },
    crowds: { any: 0.75 },
    mustHaves: {},
    reach: { anywhere: 0.8 },
  };

  const vibeVal = vibeScore(profile, answers);
  const sceneryVal = sceneryScore(profile, answers);
  const seasonVal = seasonScore(profile, answers);
  const climateVal = profile.climate?.[answers.climate || 'any'] ?? 0.75;
  const crewVal = crewScore(profile, answers);
  const paceVal = profile.pace?.[answers.pace || 'balanced'] ?? 0.75;
  const { score: mustVal, flags } = mustHaveScore(profile, answers);

  const breakdown = {
    vibe: { weight: WEIGHTS.vibe, raw: vibeVal, weighted: vibeVal * WEIGHTS.vibe },
    scenery: { weight: WEIGHTS.scenery, raw: sceneryVal, weighted: sceneryVal * WEIGHTS.scenery },
    season: { weight: WEIGHTS.season, raw: seasonVal, weighted: seasonVal * WEIGHTS.season },
    climate: { weight: WEIGHTS.climate, raw: climateVal, weighted: climateVal * WEIGHTS.climate },
    crew: { weight: WEIGHTS.crew, raw: crewVal, weighted: crewVal * WEIGHTS.crew },
    pace: { weight: WEIGHTS.pace, raw: paceVal, weighted: paceVal * WEIGHTS.pace },
    mustHaves: { weight: WEIGHTS.mustHaves, raw: mustVal, weighted: mustVal * WEIGHTS.mustHaves },
  };

  let totalRaw = Object.values(breakdown).reduce((s, b) => s + b.weighted, 0);
  // Add signature moment bonus
  totalRaw += momentBonus(city.id, answers.moment);

  const total = Math.min(99, Math.max(48, Math.round(totalRaw)));
  const whyFit = buildWhyFit(city, breakdown, answers);
  const watchOut = flags.length
    ? `Flagged preferences: ${flags.join(', ').replace(/_/g, ' ')}. ${city.watchOut || ''}`
    : city.watchOut || 'Peak dates can feel busy — plan transport windows early.';

  return { total, breakdown, flags, whyFit, watchOut };
}

function buildWhyFit(city, breakdown, answers) {
  const top = Object.entries(breakdown)
    .sort((a, b) => b[1].raw - a[1].raw)
    .slice(0, 2)
    .map(([k]) => DIMENSION_LABELS[k] || k);

  const sceneryName = answers.scenery ? answers.scenery.replace('_', ' ') : 'chosen landscape';
  return `Strong fit for ${sceneryName} & exceptional compatibility on ${top.join(' and ')}.`;
}

export function calculateMatchScores(answers = {}, limit = 5) {
  const scored = PILOT_CITIES.map((city) => {
    const result = scoreDestination(city, answers);
    return {
      // Direct access properties for components (Chatbot, CompareModal, etc.)
      id: city.id,
      name: city.name,
      country: city.country,
      state: city.state || '',
      headline: city.headline,
      photo: city.photo,
      city, // Preserves nested structure
      matchPercentage: result.total,
      breakdown: result.breakdown,
      flags: result.flags,
      whyFit: result.whyFit,
      whyThisFits: result.whyFit,
      watchOut: result.watchOut,
      typicalDays: city.typicalDays || `${city.daysMin}–${city.daysMax} days`,
      costBand: `from ${formatBand(city.sampleBudgetMin)} / trip · ~${formatBand(city.dailyCostEst)}/day`,
      dailyCostEst: city.dailyCostEst,
      sampleBudgetMin: city.sampleBudgetMin,
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);

  // Filter if region or budget filter specified in answers
  let filtered = scored;
  if (answers.filterRegion && answers.filterRegion !== 'all') {
    filtered = filtered.filter((item) => {
      if (answers.filterRegion === 'india') return item.country === 'India';
      if (answers.filterRegion === 'international') return item.country !== 'India';
      return true;
    });
  }

  if (answers.filterBudget && answers.filterBudget !== 'all') {
    filtered = filtered.filter((item) => {
      if (answers.filterBudget === 'budget') return item.sampleBudgetMin <= 10000;
      if (answers.filterBudget === 'comfort') return item.sampleBudgetMin > 10000 && item.sampleBudgetMin <= 25000;
      if (answers.filterBudget === 'premium') return item.sampleBudgetMin > 25000;
      return true;
    });
  }

  return limit === 'all' ? filtered : filtered.slice(0, limit);
}

function formatBand(n) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

/** Lightweight teaser scoring for homepage pebbles */
export function teaserMatches(vibeId, limit = 3) {
  return calculateMatchScores(
    {
      scenery: vibeId === 'adventure' ? 'mountains' : vibeId === 'food' ? 'neon_city' : 'heritage',
      vibe: [vibeId],
      season: 'flexible',
      climate: 'any',
      travelers: 'solo',
      pace: 'balanced',
      mustHaves: [],
    },
    limit
  );
}
