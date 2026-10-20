/**
 * WanderWise Pilot Destinations (Deterministic Sample Data)
 * Feasibility parameters, pricing bands, and stops for the 5 pilot cities
 */

export const PILOT_CITIES = [
  {
    id: 'shimla',
    name: 'Shimla',
    country: 'India',
    state: 'Himachal Pradesh',
    headline: 'Colonial ridge walks & mountain toy train',
    typicalDays: '3–4 days',
    daysMin: 2,
    daysMax: 5,
    sampleBudgetMin: 7500,
    dailyCostEst: 2800,
    photo: '/images/hero-shimla-train.jpg',
    tag: 'Mountain Railway & Ridge Walk',
    watchOut: 'Severe vehicle jams on Cart Road on holiday weekends; rely on walking loops and the Mall Road lift.',
    vibeWeights: {
      peaceful: 0.95,
      adventure: 0.65,
      culture: 0.75,
      food: 0.60,
      nightlife: 0.20,
      shopping: 0.55
    },
    groupSuitability: {
      solo: 0.85,
      couple: 0.95,
      friends: 0.80,
      family: 0.75,
      withKids: 0.65
    },
    budgetBand: {
      backpacker: 1800,
      comfortable: 3400,
      premium: 7200
    },
    tags: ['mountains', 'snow', 'heritage', 'walkable', 'scenic', 'quiet', 'vegetarian'],
    sampleStops: [
      {
        id: 'sh-1',
        name: 'Kalka-Shimla Heritage Railway arrival',
        timeWindow: '09:45 – 11:15',
        duration: '1.5 hrs',
        cost: 450,
        category: 'Transport',
        notes: 'Pre-booked Shivalik Deluxe seat; exit directly through Old Timber Gate to avoid taxi touts.'
      },
      {
        id: 'sh-2',
        name: 'The Ridge & Gaiety Theatre Heritage Walk',
        timeWindow: '11:45 – 13:30',
        duration: '1.75 hrs',
        cost: 250,
        category: 'Culture',
        notes: 'Victorian amateur theatre tour; ticket includes balcony archival exhibition.'
      },
      {
        id: 'sh-3',
        name: 'Jakhu Hill Ropeway to Temple',
        timeWindow: '14:30 – 16:30',
        duration: '2 hrs',
        cost: 550,
        category: 'Sightseeing',
        notes: 'Last cabin down operates at 17:15 sharp. Hold on to glasses and phones near monkeys.'
      },
      {
        id: 'sh-4',
        name: 'Cedar Estate Colonial Dining (High Tea)',
        timeWindow: '17:30 – 19:30',
        duration: '2 hrs',
        cost: 2200,
        category: 'Food',
        isPremium: true,
        notes: 'Heritage verandah dining with mountain sunset view. Requires advance booking.'
      }
    ],
    // Budget swap if high tea causes overbudget
    swapStop: {
      id: 'sh-swap',
      name: 'Indian Coffee House (Mall Road heritage booth)',
      timeWindow: '17:30 – 19:00',
      duration: '1.5 hrs',
      cost: 260,
      category: 'Food',
      notes: 'Substituted for high tea to keep budget balanced. Historic 1957 co-op cafe with mutton dosas and filter coffee.'
    }
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    country: 'India',
    state: 'Rajasthan',
    headline: 'Pink stone architecture & astronomical precision',
    typicalDays: '3–4 days',
    daysMin: 2,
    daysMax: 6,
    sampleBudgetMin: 8500,
    dailyCostEst: 3100,
    photo: '/images/city-jaipur.jpg',
    tag: 'Palaces & Heritage Crafts',
    watchOut: 'Fort gates close strictly at 17:00; transit between Amer and the city center takes 45–60 mins in afternoon traffic.',
    vibeWeights: {
      peaceful: 0.40,
      adventure: 0.50,
      culture: 0.98,
      food: 0.90,
      nightlife: 0.45,
      shopping: 0.95
    },
    groupSuitability: {
      solo: 0.80,
      couple: 0.90,
      friends: 0.90,
      family: 0.95,
      withKids: 0.85
    },
    budgetBand: {
      backpacker: 1900,
      comfortable: 3800,
      premium: 8500
    },
    tags: ['heritage', 'culture', 'shopping', 'food', 'architecture', 'vegetarian', 'cheap'],
    sampleStops: [
      {
        id: 'jp-1',
        name: 'Amer Fort Stepwell & Suraj Pol Entry',
        timeWindow: '08:30 – 11:30',
        duration: '3 hrs',
        cost: 500,
        category: 'Culture',
        notes: 'Arrive before 09:00 to beat tourist coach crowds at Ganesh Pol.'
      },
      {
        id: 'jp-2',
        name: 'Panna Meena Ka Kund Photo & Transit',
        timeWindow: '11:45 – 12:45',
        duration: '1 hr',
        cost: 0,
        category: 'Architecture',
        notes: 'Free entry geometric stepwell. Guards do not permit climbing down steps.'
      },
      {
        id: 'jp-3',
        name: 'Laxmi Mishthan Bhandar (LMB) Traditional Thali',
        timeWindow: '13:15 – 14:45',
        duration: '1.5 hrs',
        cost: 850,
        category: 'Food',
        notes: 'Authentic Rajasthani dal baati churma and ghewar in Johari Bazaar.'
      },
      {
        id: 'jp-4',
        name: 'City Palace Royal Grandeur Private Chambers',
        timeWindow: '15:15 – 17:30',
        duration: '2.25 hrs',
        cost: 2500,
        category: 'Culture',
        isPremium: true,
        notes: 'Chhavi Niwas blue room tour with private palace guide.'
      }
    ],
    swapStop: {
      id: 'jp-swap',
      name: 'Jantar Mantar Astronomical Observatory Walk',
      timeWindow: '15:15 – 17:00',
      duration: '1.75 hrs',
      cost: 200,
      category: 'Culture',
      notes: 'Substituted for private chambers. World heritage giant sundial complex.'
    }
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    state: 'Kanto',
    headline: 'Hyper-efficient transit & serene neighborhood alleys',
    typicalDays: '5–7 days',
    daysMin: 4,
    daysMax: 7,
    sampleBudgetMin: 38000,
    dailyCostEst: 8200,
    photo: '/images/city-tokyo.jpg',
    tag: 'Metropolitan Precision',
    watchOut: 'Rush hour commuter trains (08:00–09:15) forbid large suitcases; use Yamato luggage forwarding between stations.',
    vibeWeights: {
      peaceful: 0.55,
      adventure: 0.70,
      culture: 0.90,
      food: 0.98,
      nightlife: 0.92,
      shopping: 0.96
    },
    groupSuitability: {
      solo: 0.98,
      couple: 0.92,
      friends: 0.94,
      family: 0.75,
      withKids: 0.70
    },
    budgetBand: {
      backpacker: 4200,
      comfortable: 8500,
      premium: 21000
    },
    tags: ['walkable', 'food', 'nightlife', 'shopping', 'transit', 'safe', 'modern'],
    sampleStops: [
      {
        id: 'tk-1',
        name: 'Yanaka Ginza Historic Shitamachi Alley Walk',
        timeWindow: '09:30 – 11:30',
        duration: '2 hrs',
        cost: 600,
        category: 'Culture',
        notes: 'Pre-war wooden storefronts, artisan senbei rice crackers and coffee roasters.'
      },
      {
        id: 'tk-2',
        name: 'Ueno Tokyo National Museum (Kuroda Memorial)',
        timeWindow: '12:00 – 14:00',
        duration: '2 hrs',
        cost: 1000,
        category: 'Culture',
        notes: 'English audio guides via QR code. Quiet courtyard garden accessible.'
      },
      {
        id: 'tk-3',
        name: 'Tsukiji Outer Market Tasting Tour',
        timeWindow: '14:30 – 16:00',
        duration: '1.5 hrs',
        cost: 1600,
        category: 'Food',
        notes: 'Fresh tamagoyaki skewers, grilled scallops and matcha soft serve.'
      },
      {
        id: 'tk-4',
        name: 'Omakase Counter Dinner in Roppongi',
        timeWindow: '18:00 – 20:30',
        duration: '2.5 hrs',
        cost: 7500,
        category: 'Food',
        isPremium: true,
        notes: 'Seasonal 10-course seasonal chef tasting. Strict reservation adherence required.'
      }
    ],
    swapStop: {
      id: 'tk-swap',
      name: 'Ramen Street Ichiran Booth Dinner',
      timeWindow: '18:00 – 19:30',
      duration: '1.5 hrs',
      cost: 950,
      category: 'Food',
      notes: 'Substituted for omakase. Classic solo dining booth tonkotsu broth ramen.'
    }
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    state: 'Dubai',
    headline: 'Modernist engineering & desert conservation reserves',
    typicalDays: '4–5 days',
    daysMin: 3,
    daysMax: 6,
    sampleBudgetMin: 32000,
    dailyCostEst: 7600,
    photo: '/images/city-dubai.jpg',
    tag: 'Architecture & Desert',
    watchOut: 'Midday summer heat exceeds 42°C; schedule outdoor activities strictly before 10:30 or after 17:30.',
    vibeWeights: {
      peaceful: 0.35,
      adventure: 0.85,
      culture: 0.50,
      food: 0.88,
      nightlife: 0.88,
      shopping: 0.98
    },
    groupSuitability: {
      solo: 0.70,
      couple: 0.90,
      friends: 0.92,
      family: 0.95,
      withKids: 0.90
    },
    budgetBand: {
      backpacker: 3800,
      comfortable: 7800,
      premium: 19500
    },
    tags: ['modern', 'shopping', 'nightlife', 'luxury', 'architecture', 'kids', 'not crowded'],
    sampleStops: [
      {
        id: 'dx-1',
        name: 'Al Fahidi Historic District & Abra Creek Crossing',
        timeWindow: '09:00 – 11:00',
        duration: '2 hrs',
        cost: 250,
        category: 'Culture',
        notes: 'Traditional 1 AED motorized wooden boat abra across Dubai Creek to Spice Souk.'
      },
      {
        id: 'dx-2',
        name: 'Museum of the Future Interactive Galleries',
        timeWindow: '11:45 – 14:00',
        duration: '2.25 hrs',
        cost: 3200,
        category: 'Architecture',
        notes: 'Timed entry slot strictly enforced; book at least 14 days in advance.'
      },
      {
        id: 'dx-3',
        name: 'Arabian Tea House Courtyard Lunch',
        timeWindow: '14:15 – 15:30',
        duration: '1.25 hrs',
        cost: 1400,
        category: 'Food',
        notes: 'Shaded wind-tower courtyard serving authentic Emirati breakfast platters and mint tea.'
      },
      {
        id: 'dx-4',
        name: 'Private Sunset Falconry & Desert Dune Safari',
        timeWindow: '16:30 – 21:00',
        duration: '4.5 hrs',
        cost: 6500,
        category: 'Adventure',
        isPremium: true,
        notes: 'Conservation reserve access with vintage Land Rovers and stargazing dinner.'
      }
    ],
    swapStop: {
      id: 'dx-swap',
      name: 'Dubai Fountain Boardwalk & Dubai Mall Aquarium Walk',
      timeWindow: '17:00 – 19:30',
      duration: '2.5 hrs',
      cost: 600,
      category: 'Sightseeing',
      notes: 'Substituted for private safari. Evening musical fountain shows with free promenade access.'
    }
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    country: 'India',
    state: 'Punjab / Haryana',
    headline: 'Corbusier modernist grid, open hand & rock sculpture gardens',
    typicalDays: '2–3 days',
    daysMin: 1,
    daysMax: 4,
    sampleBudgetMin: 5500,
    dailyCostEst: 2200,
    photo: '/images/city-chandigarh.jpg',
    tag: 'Modernist Architecture & Parks',
    watchOut: 'Capitol Complex requires visitor security pass at the Tourist Center 24 hours prior; closed on national holidays.',
    vibeWeights: {
      peaceful: 0.90,
      adventure: 0.35,
      culture: 0.85,
      food: 0.80,
      nightlife: 0.50,
      shopping: 0.60
    },
    groupSuitability: {
      solo: 0.85,
      couple: 0.85,
      friends: 0.78,
      family: 0.88,
      withKids: 0.80
    },
    budgetBand: {
      backpacker: 1400,
      comfortable: 2600,
      premium: 5800
    },
    tags: ['walkable', 'architecture', 'quiet', 'green', 'heritage', 'vegetarian', 'cheap'],
    sampleStops: [
      {
        id: 'ch-1',
        name: 'Le Corbusier Capitol Complex Guided Architecture Walk',
        timeWindow: '09:30 – 12:00',
        duration: '2.5 hrs',
        cost: 300,
        category: 'Culture',
        notes: 'UNESCO World Heritage Secretariat, High Court and Open Hand Monument.'
      },
      {
        id: 'ch-2',
        name: 'Nek Chand Rock Garden Mosaic Walk',
        timeWindow: '12:30 – 14:30',
        duration: '2 hrs',
        cost: 60,
        category: 'Art',
        notes: 'Sculptures made completely from industrial and domestic waste and discarded ceramics.'
      },
      {
        id: 'ch-3',
        name: 'Sector 17 Heritage Indian Coffee House & Plaza Walk',
        timeWindow: '15:00 – 16:30',
        duration: '1.5 hrs',
        cost: 240,
        category: 'Food',
        notes: 'Modernist pedestrian plaza walk followed by hot cold coffee and butter toast.'
      },
      {
        id: 'ch-4',
        name: 'Sukhna Lake Sunset Boating & Gourmet Lakeside Lounge',
        timeWindow: '17:00 – 19:30',
        duration: '2.5 hrs',
        cost: 1600,
        category: 'Peaceful',
        isPremium: true,
        notes: 'Solar boat ride followed by craft dinner facing the Shivalik foothills.'
      }
    ],
    swapStop: {
      id: 'ch-swap',
      name: 'Sukhna Lake Promenade Walk & Chai Stalls',
      timeWindow: '17:00 – 18:30',
      duration: '1.5 hrs',
      cost: 120,
      category: 'Peaceful',
      notes: 'Substituted for lounge dinner. Calm public walking track along the wetland reservoir.'
    }
  },
  {
    id: 'goa',
    name: 'Goa',
    country: 'India',
    state: 'Goa',
    headline: 'Portuguese Latin quarter, coastal seafood & sunset tides',
    typicalDays: '3–5 days',
    daysMin: 3,
    daysMax: 6,
    sampleBudgetMin: 11000,
    dailyCostEst: 3200,
    photo: '/images/city-goa.jpg',
    tag: 'Coastal Heritage & Tropical Tides',
    watchOut: 'Local taxi unions enforce high fixed cash fares; rent an electric scooter or pre-book through GoaMiles app.',
    vibeWeights: {
      peaceful: 0.82,
      adventure: 0.75,
      culture: 0.80,
      food: 0.95,
      nightlife: 0.96,
      shopping: 0.70
    },
    groupSuitability: {
      solo: 0.90,
      couple: 0.96,
      friends: 0.98,
      family: 0.75,
      withKids: 0.70
    },
    budgetBand: {
      backpacker: 1600,
      comfortable: 3600,
      premium: 8900
    },
    tags: ['beaches', 'culture', 'food', 'nightlife', 'peaceful', 'scenic', 'cheap'],
    sampleStops: [
      {
        id: 'goa-1',
        name: 'Fontainhas Heritage Quarter Walking Tour',
        timeWindow: '08:30 – 10:30',
        duration: '2 hrs',
        cost: 300,
        category: 'Culture',
        notes: 'Pastel Portuguese villas, azulejo ceramic tiles and traditional bakeries in Panaji.'
      },
      {
        id: 'goa-2',
        name: 'Anjuna Coastal Cliffs & Beach Shack Lunch',
        timeWindow: '12:00 – 14:30',
        duration: '2.5 hrs',
        cost: 850,
        category: 'Food',
        notes: 'Fresh catch kingfish rava fry, poi bread and tender coconut water.'
      },
      {
        id: 'goa-3',
        name: 'Mandovi River Sunset Sailing Catamaran',
        timeWindow: '17:00 – 19:00',
        duration: '2 hrs',
        cost: 1600,
        category: 'Peaceful',
        isPremium: true,
        notes: 'Open-deck cruise towards Aguada lighthouse with live Konkani acoustic music.'
      }
    ],
    swapStop: {
      id: 'goa-swap',
      name: 'Morjim Beach Sandbar Sunset Walk',
      timeWindow: '17:00 – 18:30',
      duration: '1.5 hrs',
      cost: 0,
      category: 'Peaceful',
      notes: 'Substituted for boat cruise. Quiet olive ridley turtle nesting beach promenade.'
    }
  },
  {
    id: 'manali',
    name: 'Manali & Solang',
    country: 'India',
    state: 'Himachal Pradesh',
    headline: 'Snow-dusted pine valleys, glacial passes & deodar trails',
    typicalDays: '3–5 days',
    daysMin: 3,
    daysMax: 6,
    sampleBudgetMin: 9000,
    dailyCostEst: 2700,
    photo: '/images/city-manali.jpg',
    tag: 'Alpine Adventure & High Passes',
    watchOut: 'Rohtang and Solang corridors require green permits; heavy snow can temporarily close the Atal Tunnel south portal.',
    vibeWeights: {
      peaceful: 0.90,
      adventure: 0.98,
      culture: 0.65,
      food: 0.65,
      nightlife: 0.35,
      shopping: 0.50
    },
    groupSuitability: {
      solo: 0.88,
      couple: 0.94,
      friends: 0.96,
      family: 0.78,
      withKids: 0.68
    },
    budgetBand: {
      backpacker: 1500,
      comfortable: 3200,
      premium: 7800
    },
    tags: ['mountains', 'snow', 'adventure', 'scenic', 'quiet', 'cold', 'trekking'],
    sampleStops: [
      {
        id: 'mn-1',
        name: 'Old Manali Wood-Carved Hadimba Temple Forest Walk',
        timeWindow: '09:00 – 11:00',
        duration: '2 hrs',
        cost: 50,
        category: 'Culture',
        notes: 'Centuries-old pagoda shrine enveloped in towering cedar forests.'
      },
      {
        id: 'mn-2',
        name: 'Solang Valley Ropeway & Paragliding Viewpoint',
        timeWindow: '11:45 – 14:45',
        duration: '3 hrs',
        cost: 1800,
        category: 'Adventure',
        notes: 'Panoramic cable car climbing up to 3200m facing the Pir Panjal range.'
      },
      {
        id: 'mn-3',
        name: 'Riverside Trout Cafe & Apple Cider Tasting',
        timeWindow: '18:00 – 20:00',
        duration: '2 hrs',
        cost: 950,
        category: 'Food',
        notes: 'Himalayan wood-fired trout with locally pressed organic Kullu apple cider.'
      }
    ],
    swapStop: {
      id: 'mn-swap',
      name: 'Vashisht Hot Sulphur Springs & Tibetan Momos',
      timeWindow: '17:30 – 19:00',
      duration: '1.5 hrs',
      cost: 150,
      category: 'Peaceful',
      notes: 'Substituted for riverside dining. Natural geothermal baths and steamed momos.'
    }
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    country: 'India',
    state: 'Rajasthan',
    headline: 'White marble lake palaces, Mewar art & rooftop serenity',
    typicalDays: '3–4 days',
    daysMin: 2,
    daysMax: 5,
    sampleBudgetMin: 9500,
    dailyCostEst: 3000,
    photo: '/images/city-udaipur.jpg',
    tag: 'Lakeside Palaces & Mewar Heritage',
    watchOut: 'Old city alleyways leading to Gangaur Ghat are inaccessible to cabs; use walking paths or registered auto-rickshaws.',
    vibeWeights: {
      peaceful: 0.94,
      adventure: 0.40,
      culture: 0.96,
      food: 0.86,
      nightlife: 0.35,
      shopping: 0.92
    },
    groupSuitability: {
      solo: 0.84,
      couple: 0.98,
      friends: 0.82,
      family: 0.90,
      withKids: 0.82
    },
    budgetBand: {
      backpacker: 1700,
      comfortable: 3500,
      premium: 9500
    },
    tags: ['heritage', 'culture', 'peaceful', 'romantic', 'walkable', 'architecture', 'vegetarian'],
    sampleStops: [
      {
        id: 'ud-1',
        name: 'City Palace Complex & Crystal Gallery Walk',
        timeWindow: '09:00 – 12:00',
        duration: '3 hrs',
        cost: 450,
        category: 'Culture',
        notes: 'Granite and marble balconies with panoramic vistas over Lake Pichola.'
      },
      {
        id: 'ud-2',
        name: 'Lake Pichola Solar Boat to Jagmandir Island',
        timeWindow: '15:30 – 17:00',
        duration: '1.5 hrs',
        cost: 650,
        category: 'Peaceful',
        notes: 'Courtyard garden walk at the island palace built in 1620.'
      },
      {
        id: 'ud-3',
        name: 'Ambrai Ghat Candlelight Lakeside Dining',
        timeWindow: '19:30 – 21:30',
        duration: '2 hrs',
        cost: 2100,
        category: 'Food',
        isPremium: true,
        notes: 'Waterfront Mewari dinner looking directly across illuminated palace facades.'
      }
    ],
    swapStop: {
      id: 'ud-swap',
      name: 'Gangaur Ghat Twilight Sitar Performance',
      timeWindow: '18:30 – 19:45',
      duration: '1.25 hrs',
      cost: 100,
      category: 'Culture',
      notes: 'Substituted for palace dining. Public ghat steps with local folk string players.'
    }
  },
  {
    id: 'munnar',
    name: 'Munnar & Backwaters',
    country: 'India',
    state: 'Kerala',
    headline: 'Rolling tea estates, cool mountain mist & calm backwaters',
    typicalDays: '3–5 days',
    daysMin: 3,
    daysMax: 6,
    sampleBudgetMin: 8500,
    dailyCostEst: 2600,
    photo: '/images/city-munnar.jpg',
    tag: 'Emerald Hills & Spice Sanctuaries',
    watchOut: 'Mountain ghat road from Kochi takes 4 hours of winding curves; carry anti-motion sickness remedies if sensitive.',
    vibeWeights: {
      peaceful: 0.98,
      adventure: 0.65,
      culture: 0.70,
      food: 0.85,
      nightlife: 0.15,
      shopping: 0.60
    },
    groupSuitability: {
      solo: 0.85,
      couple: 0.98,
      friends: 0.84,
      family: 0.94,
      withKids: 0.88
    },
    budgetBand: {
      backpacker: 1400,
      comfortable: 2900,
      premium: 7200
    },
    tags: ['nature', 'peaceful', 'green', 'scenic', 'romantic', 'quiet', 'vegetarian', 'cheap'],
    sampleStops: [
      {
        id: 'mu-1',
        name: 'Kolukkumalai Sunrise Organic Tea Trail',
        timeWindow: '06:00 – 09:30',
        duration: '3.5 hrs',
        cost: 950,
        category: 'Peaceful',
        notes: 'World highest elevation tea estate reached via 4x4 mountain jeep track.'
      },
      {
        id: 'mu-2',
        name: 'Eravikulam National Park Nilgiri Tahr Walk',
        timeWindow: '10:30 – 13:00',
        duration: '2.5 hrs',
        cost: 200,
        category: 'Adventure',
        notes: 'Protected high shola grasslands; pre-book forest department electric shuttle.'
      },
      {
        id: 'mu-3',
        name: 'Authentic Kerala Sadhya on Banana Leaf',
        timeWindow: '13:30 – 14:45',
        duration: '1.25 hrs',
        cost: 280,
        category: 'Food',
        notes: 'Traditional 24-dish vegetarian feast with red matta rice, avial, and payasam.'
      }
    ],
    swapStop: {
      id: 'mu-swap',
      name: 'Pothamedu Viewpoint Sunset & Cardamom Chai',
      timeWindow: '17:00 – 18:30',
      duration: '1.5 hrs',
      cost: 60,
      category: 'Peaceful',
      notes: 'Substituted for paid tours. Misty cliffside valley view with fresh spice tea.'
    }
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    state: 'Kansai',
    headline: 'Millennium temples, bamboo groves & quiet stone lanes',
    typicalDays: '4–6 days',
    daysMin: 3,
    daysMax: 7,
    sampleBudgetMin: 36000,
    dailyCostEst: 7800,
    photo: '/images/city-kyoto.jpg',
    tag: 'Zen Gardens & Classical Shrines',
    watchOut: 'Popular bus lines (100 and 206) get packed midday; use the Keihan/Hankyu rail lines and walk historic pedestrian alleys.',
    vibeWeights: {
      peaceful: 0.95,
      adventure: 0.45,
      culture: 0.99,
      food: 0.92,
      nightlife: 0.40,
      shopping: 0.85
    },
    groupSuitability: {
      solo: 0.96,
      couple: 0.97,
      friends: 0.88,
      family: 0.86,
      withKids: 0.80
    },
    budgetBand: {
      backpacker: 3900,
      comfortable: 8200,
      premium: 19500
    },
    tags: ['heritage', 'culture', 'walkable', 'peaceful', 'safe', 'food', 'scenic'],
    sampleStops: [
      {
        id: 'ky-1',
        name: 'Fushimi Inari Torii Gate Early Morning Ascent',
        timeWindow: '07:00 – 09:30',
        duration: '2.5 hrs',
        cost: 0,
        category: 'Culture',
        notes: 'Start before 07:30 to experience the 10,000 vermilion gates in quiet contemplation.'
      },
      {
        id: 'ky-2',
        name: 'Arashiyama Bamboo Grove & Tenryu-ji Zen Garden',
        timeWindow: '10:30 – 13:00',
        duration: '2.5 hrs',
        cost: 500,
        category: 'Peaceful',
        notes: 'UNESCO temple garden featuring 14th-century pond and dry landscape design.'
      },
      {
        id: 'ky-3',
        name: 'Gion Kaiseki Multicourse Dinner Experience',
        timeWindow: '18:30 – 21:00',
        duration: '2.5 hrs',
        cost: 6800,
        category: 'Food',
        isPremium: true,
        notes: 'Traditional seasonal Kyoto banquet featuring yuba tofu and matcha confections.'
      }
    ],
    swapStop: {
      id: 'ky-swap',
      name: 'Nishiki Market Soba & Dashi Omelette',
      timeWindow: '18:00 – 19:30',
      duration: '1.5 hrs',
      cost: 950,
      category: 'Food',
      notes: 'Substituted for kaiseki banquet. Warm hand-rolled buckwheat noodles in food arcade.'
    }
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    state: 'Central Thailand',
    headline: 'River express boats, golden stupas & world street food',
    typicalDays: '3–5 days',
    daysMin: 3,
    daysMax: 6,
    sampleBudgetMin: 18000,
    dailyCostEst: 4200,
    photo: '/images/city-bangkok.jpg',
    tag: 'Street Gastronomy & River Transit',
    watchOut: 'Road traffic crawls during evening rush hour; rely on the Chao Phraya Express Boat and BTS Skytrain.',
    vibeWeights: {
      peaceful: 0.38,
      adventure: 0.78,
      culture: 0.88,
      food: 0.99,
      nightlife: 0.95,
      shopping: 0.98
    },
    groupSuitability: {
      solo: 0.92,
      couple: 0.92,
      friends: 0.98,
      family: 0.82,
      withKids: 0.78
    },
    budgetBand: {
      backpacker: 2200,
      comfortable: 4500,
      premium: 12000
    },
    tags: ['food', 'shopping', 'nightlife', 'culture', 'cheap', 'transit', 'walkable'],
    sampleStops: [
      {
        id: 'bk-1',
        name: 'Wat Pho Reclining Buddha & Massage School',
        timeWindow: '08:30 – 11:00',
        duration: '2.5 hrs',
        cost: 200,
        category: 'Culture',
        notes: 'Birthplace of traditional Thai healing and 46m gold-leaf reclining Buddha.'
      },
      {
        id: 'bk-2',
        name: 'Chao Phraya Public River Hop to Chinatown',
        timeWindow: '15:30 – 17:30',
        duration: '2 hrs',
        cost: 60,
        category: 'Transport',
        notes: 'Scenic breeze along historic river banks passing Wat Arun.'
      },
      {
        id: 'bk-3',
        name: 'Yaowarat Chinatown Night Street Food Crawl',
        timeWindow: '18:30 – 21:00',
        duration: '2.5 hrs',
        cost: 850,
        category: 'Food',
        notes: 'Michelin-bib crab fried rice, toasted buns, and homemade ginger sesame dumplings.'
      }
    ],
    swapStop: {
      id: 'bk-swap',
      name: 'Lumphini Park Lake Walk & Food Stalls',
      timeWindow: '17:30 – 19:00',
      duration: '1.5 hrs',
      cost: 120,
      category: 'Peaceful',
      notes: 'Substituted for bustling market. Shaded green park with friendly monitor lizards.'
    }
  },
  {
    id: 'zurich',
    name: 'Zurich & Lucerne',
    country: 'Switzerland',
    state: 'Central Switzerland',
    headline: 'Alpine cogwheel trains, glacial lakes & medieval bridges',
    typicalDays: '4–7 days',
    daysMin: 4,
    daysMax: 8,
    sampleBudgetMin: 65000,
    dailyCostEst: 14500,
    photo: '/images/city-zurich.jpg',
    tag: 'Alpine Precision & Mountain Rails',
    watchOut: 'Point-to-point rail tickets are costly at ticket windows; obtain a regional Swiss Travel Pass or Saver Day Pass.',
    vibeWeights: {
      peaceful: 0.96,
      adventure: 0.82,
      culture: 0.86,
      food: 0.76,
      nightlife: 0.55,
      shopping: 0.85
    },
    groupSuitability: {
      solo: 0.90,
      couple: 0.96,
      friends: 0.85,
      family: 0.92,
      withKids: 0.88
    },
    budgetBand: {
      backpacker: 7200,
      comfortable: 15500,
      premium: 34000
    },
    tags: ['mountains', 'scenic', 'transit', 'walkable', 'luxury', 'peaceful', 'clean'],
    sampleStops: [
      {
        id: 'zh-1',
        name: 'Lucerne Historic Chapel Bridge & Old Town Walk',
        timeWindow: '09:00 – 11:30',
        duration: '2.5 hrs',
        cost: 0,
        category: 'Culture',
        notes: '14th-century covered wooden bridge adorned with interior historic paintings.'
      },
      {
        id: 'zh-2',
        name: 'Mount Rigi Cogwheel Mountain Railway Ascent',
        timeWindow: '12:00 – 16:00',
        duration: '4 hrs',
        cost: 3800,
        category: 'Adventure',
        notes: 'Oldest mountain railway in Europe climbing high above Lake Lucerne.'
      },
      {
        id: 'zh-3',
        name: 'Lakeside Steamer Cruise & Swiss Fondue Dinner',
        timeWindow: '18:00 – 20:30',
        duration: '2.5 hrs',
        cost: 4200,
        category: 'Food',
        isPremium: true,
        notes: 'Sunset vintage paddle steamer ride with Gruyère cheese fondue and rösti.'
      }
    ],
    swapStop: {
      id: 'zh-swap',
      name: 'Lake Zurich Promenade Walk & Bratwurst at Sternen Grill',
      timeWindow: '18:00 – 19:30',
      duration: '1.5 hrs',
      cost: 950,
      category: 'Food',
      notes: 'Substituted for steamer dining. Famous lakeside St. Galler sausage with crusty Bürli bread.'
    }
  }
];

export const PILOT_CITY_NAMES = PILOT_CITIES.map((c) => c.name);

