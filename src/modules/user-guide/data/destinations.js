export const destinations = [
  {
    id: "shimla",
    name: "Shimla",
    state: "Himachal Pradesh",
    tagline: "Queen of the Hills, Himalayan pine forests & colonial heritage",
    description: "Nestled in the foothills of the Himalayas, Shimla blends timeless British colonial architecture, traditional Pahari village culture, and apple orchards with panoramic Himalayan peak trails.",
    altitude: "2,276 m",
    bestSeason: "March to June (Breezy & clear) & Dec to Feb (Snowfall)",
    temperature: "10°C to 24°C (Summer) | -2°C to 12°C (Winter)",
    quickFacts: [
      { label: "Altitude", value: "2,276 m" },
      { label: "Best Season", value: "Oct – June" },
      { label: "Ideal Trip", value: "3 – 5 Days" },
      { label: "Vibe", value: "Pahari Heritage & Pine Trails" }
    ],
    coverImage: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1600&q=80",
    comingSoon: false,
    badge: "Active Destination",
    serviceCount: 32
  },
  {
    id: "manali",
    name: "Manali",
    state: "Himachal Pradesh",
    tagline: "High-altitude adventures, Beas river rapids and Old Manali cafes",
    comingSoon: true,
    coverImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "dharamshala",
    name: "Dharamshala",
    state: "Himachal Pradesh",
    tagline: "Tibetan spirituality, monasteries, and cedar-scented trails",
    comingSoon: true,
    coverImage: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "kasol",
    name: "Kasol",
    state: "Himachal Pradesh",
    tagline: "Parvati Valley soul, riverside cafes, and mystical pine woods",
    comingSoon: true,
    coverImage: "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "delhi",
    name: "Delhi",
    state: "National Capital",
    tagline: "Mughal monuments, heritage bazaars, and contemporary art",
    comingSoon: true,
    coverImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    tagline: "Pink sandstone palaces, block printing, and royal courtyards",
    comingSoon: true,
    coverImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "goa",
    name: "Goa",
    state: "Goa",
    tagline: "Portuguese villas, spice plantations, and golden sunset coasts",
    comingSoon: true,
    coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "rishikesh",
    name: "Rishikesh",
    state: "Uttarakhand",
    tagline: "Ganga riverside aartis, yoga ashrams, and foothills rafting",
    comingSoon: true,
    coverImage: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "udaipur",
    name: "Udaipur",
    state: "Rajasthan",
    tagline: "City of lakes, marble balconies, and sunset boat journeys",
    comingSoon: true,
    coverImage: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    tagline: "Ancient ghats, dawn boat rides, and living traditions",
    comingSoon: true,
    coverImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    tagline: "Victorian Gothic architecture, seaside promenades, and buzzing bazaars",
    comingSoon: true,
    coverImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "leh",
    name: "Leh",
    state: "Ladakh",
    tagline: "High mountain passes, Buddhist gompas, and moonland vistas",
    comingSoon: true,
    coverImage: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80"
  }
];

export const getDestinationById = (cityId) => {
  if (!cityId) return null;
  const normalized = cityId.toLowerCase().trim();
  return destinations.find((d) => d.id === normalized || d.name.toLowerCase() === normalized) || null;
};
