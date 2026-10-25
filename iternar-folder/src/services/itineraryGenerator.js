import { getDestinationById } from '../data/destinations.js';

/**
 * Deterministically generates an itinerary for a destination, duration, and budget.
 */
export function generateItinerary({ destinationId = 'japan', durationDays = 7, budget = null, startDate = null }) {
  const dest = getDestinationById(destinationId);
  const daysCount = Math.max(1, Math.min(14, Number(durationDays) || 7));
  const totalBudget = Number(budget) > 0 ? Number(budget) : dest.defaultBudget;
  const places = dest.places || [];

  const baseDate = startDate ? new Date(startDate) : new Date();

  // 1. Generate Days
  const days = [];
  for (let i = 0; i < daysCount; i++) {
    const curDate = new Date(baseDate);
    curDate.setDate(curDate.getDate() + i);
    const dateStr = curDate.toISOString().split('T')[0];

    days.push({
      id: `day-${i + 1}`,
      dayNumber: i + 1,
      date: dateStr,
      title: getDayTitle(dest.id, i + 1, daysCount),
      summary: `Day ${i + 1} exploring key landmarks and culture in ${dest.name}.`
    });
  }

  // 2. Distribute Places across Days
  const visits = [];
  const assignedPlaces = [...places];

  // Distribute places deterministically across the days
  days.forEach((day, dayIndex) => {
    // Determine how many places for this day
    const placesForDay = getPlacesForDay(assignedPlaces, dayIndex, daysCount);
    
    placesForDay.forEach((place, visitIndex) => {
      const times = getVisitTimes(visitIndex, placesForDay.length);
      visits.push({
        id: `visit-${day.id}-${place.id}-${visitIndex}`,
        dayId: day.id,
        placeId: place.id,
        order: visitIndex + 1,
        startTime: times.start,
        endTime: times.end,
        notes: `Enjoy visiting ${place.name}. Estimated duration: ${place.estimatedDurationMinutes} mins.`,
        cost: place.estimatedCost || 0
      });
    });
  });

  // 3. Generate initial budget breakdown and demo expenses
  const expenses = generateDemoExpenses(dest, totalBudget, daysCount);

  return {
    destination: dest,
    days,
    places,
    visits,
    totalBudget,
    currency: dest.currency,
    currencySymbol: dest.currencySymbol,
    expenses
  };
}

function getDayTitle(destinationId, dayNumber, totalDays) {
  const titles = {
    shimla: [
      'Arrival & The Colonial Ridge Walk',
      'Mall Road Promenade & Christ Church',
      'Jakhoo Temple Summit & Forest Trails',
      'Excursion to Snowy Kufri',
      'Viceregal Lodge & Architectural Heritage',
      'Annandale Meadows & Army Heritage',
      'Local Pine Forests & Farewell'
    ],
    jaipur: [
      'The Walled Pink City & Hawa Mahal',
      'Majestic Amber Fort & Maota Lake',
      'City Palace Royal Heritage & Museum',
      'Astronomical Wonders at Jantar Mantar',
      'Sunset Views from Nahargarh Fort',
      'Jal Mahal Reflections & Albert Hall',
      'Artisan Bazaars & Traditional Dining'
    ],
    japan: [
      'Historic Asakusa & Senso-ji Temple',
      'Tokyo Panorama at Tokyo Skytree',
      'Shibuya Crossing & Urban Energy',
      'Serenity at Meiji Jingu Shrine',
      'Kyoto Torii Path at Fushimi Inari',
      'Wooden Stage Views at Kiyomizu-dera',
      'Arashiyama Bamboo Forest Serenade'
    ],
    dubai: [
      'Downtown Glitz & Burj Khalifa Spire',
      'Dubai Mall & Spectacular Dancing Fountains',
      'Architectural Wonder at Dubai Frame',
      'Futuristic Innovation at Museum of the Future',
      'Old Dubai & Al Fahidi Historical Bastakiya',
      'Dubai Marina Promenade & Cruise',
      'Palm Jumeirah & Coastal Luxury'
    ],
    chandigarh: [
      'Artistic Wonder at Nek Chand’s Rock Garden',
      'Sunset & Serenity at Sukhna Lake',
      'Blooms at Zakir Hussain Rose Garden',
      'Le Corbusier’s UNESCO Capitol Complex',
      'Masterpieces at Govt Museum & Art Gallery',
      'Zen Reflections at Japanese Garden',
      'Leisure Valley Green Trail'
    ]
  };

  const destTitles = titles[destinationId] || titles.japan;
  if (dayNumber <= destTitles.length) {
    return destTitles[dayNumber - 1];
  }
  return `Day ${dayNumber}: Highlights & Free Exploration`;
}

function getPlacesForDay(places, dayIndex, totalDays) {
  if (!places || places.length === 0) return [];

  // When totalDays matches or is close to places.length
  if (totalDays >= places.length) {
    // 1 place per day up to places.length, rest get rotating highlights
    const place = places[dayIndex % places.length];
    return [place];
  }

  // Fewer days than places (e.g. 1 to 4 days) -> multiple places per day
  const placesPerDay = Math.ceil(places.length / totalDays);
  const startIdx = (dayIndex * placesPerDay) % places.length;
  const count = Math.min(placesPerDay, places.length - startIdx);
  const slice = places.slice(startIdx, startIdx + count);
  return slice.length > 0 ? slice : [places[0]];
}

function getVisitTimes(index, total) {
  const slots = [
    { start: '09:30', end: '11:30' },
    { start: '13:00', end: '15:00' },
    { start: '16:00', end: '18:00' },
    { start: '19:00', end: '21:00' }
  ];
  return slots[index % slots.length];
}

function generateDemoExpenses(dest, totalBudget, daysCount) {
  // Budget shares:
  // Transport: 35%, Accommodation: 30%, Food: 18%, Activities: 10%, Shopping/Other: 7%
  const tShare = 0.35;
  const aShare = 0.30;
  const fShare = 0.18;
  const actShare = 0.10;
  const oShare = 0.07;

  const tTotal = Math.round(totalBudget * tShare);
  const aTotal = Math.round(totalBudget * aShare);
  const fTotal = Math.round(totalBudget * fShare);
  const actTotal = Math.round(totalBudget * actShare);
  const oTotal = Math.round(totalBudget * oShare);

  return [
    {
      id: 'exp-1',
      title: 'Flights & Rail Transit',
      category: 'transport',
      amount: tTotal,
      currency: dest.currency,
      date: 'Day 1',
      notes: 'Initial travel tickets and reserved passes',
      isUnfinished: false
    },
    {
      id: 'exp-2',
      title: 'Hotel & Boutique Stays',
      category: 'accommodation',
      amount: aTotal,
      currency: dest.currency,
      date: 'Day 1',
      notes: `Lodging across ${daysCount} nights`,
      isUnfinished: false
    },
    {
      id: 'exp-3',
      title: 'Dining, Cafés & Street Food',
      category: 'food',
      amount: fTotal,
      currency: dest.currency,
      date: 'Daily',
      notes: 'Local culinary tastings and breakfast',
      isUnfinished: false
    },
    {
      id: 'exp-4',
      title: 'Sightseeing & Museum Passes',
      category: 'activities',
      amount: actTotal,
      currency: dest.currency,
      date: 'Day 2',
      notes: 'Entry tickets and guided experiences',
      isUnfinished: false
    },
    {
      id: 'exp-5',
      title: 'Souvenirs & Local Gifts',
      category: 'shopping',
      amount: oTotal,
      currency: dest.currency,
      date: 'Day 3',
      notes: 'Crafts, snacks, and gifts for family',
      isUnfinished: false
    }
  ];
}
