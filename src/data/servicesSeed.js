/**
 * WanderWise Services Seed Catalog
 * 36 realistic local services across 12 destinations.
 * Data Contract:
 * - guide: { id, name, city, languages[], bio, photo, rating, reviewCount, responseTime, verified }
 * - service: { id, guideId, title, type, city, priceMode ('person'|'group'), price, capacityMin, capacityMax, duration, inclusions[], availability[] }
 * - review: { id, serviceId, author, rating, text, date, helpful, tags[] }
 * - thread: { id, guideId, messages[] }
 * - booking: { id, serviceId, date, partySize, notes, status ('requested'|'accepted'|'declined'|'completed'), total, createdAt }
 */

export const CITY_PHOTOS = {
  Shimla: '/images/hero-shimla-train.jpg',
  Manali: '/images/city-manali.jpg',
  Jaipur: '/images/city-jaipur.jpg',
  Udaipur: '/images/city-udaipur.jpg',
  Goa: '/images/city-goa.jpg',
  Tokyo: '/images/city-tokyo.jpg',
  Dubai: '/images/city-dubai.jpg',
  Chandigarh: '/images/city-chandigarh.jpg',
  Munnar: '/images/city-munnar.jpg',
  Kyoto: '/images/city-kyoto.jpg',
  Bangkok: '/images/city-bangkok.jpg',
  Zurich: '/images/city-zurich.jpg',
};

export const CITIES = [
  'Shimla', 'Manali', 'Jaipur', 'Udaipur', 'Goa', 'Tokyo',
  'Dubai', 'Chandigarh', 'Munnar', 'Kyoto', 'Bangkok', 'Zurich'
];

export const SERVICE_TYPES = [
  'Walking tour',
  'Food walk',
  'Driver day',
  'Photographer',
  'Trek leader',
  'Stay host'
];

function generateDates(offsetDays = 1, count = 12) {
  const dates = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + offsetDays + i * 2);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export function buildSeedCatalog() {
  const guides = [
    // 1. Shimla
    {
      id: 'g-shimla-1',
      name: 'Rohan Verma',
      city: 'Shimla',
      languages: ['English', 'Hindi', 'Pahari'],
      bio: 'Lifelong Shimla local and conservationist. Specializes in Gaiety Theatre archives, Cart Road shortcut staircases, and deodar ridge paths.',
      photo: '/images/guide-portrait.jpg',
      rating: 4.9,
      reviewCount: 7,
      responseTime: '< 1h',
      verified: true
    },
    {
      id: 'g-shimla-2',
      name: 'Sunita Sharma',
      city: 'Shimla',
      languages: ['English', 'Hindi'],
      bio: 'Certified Himalayan trekker and botany enthusiast leading ridge trails and summer hill walks around Jakhu and Mashobra.',
      photo: CITY_PHOTOS.Shimla,
      rating: 4.8,
      reviewCount: 5,
      responseTime: '< 2h',
      verified: true
    },
    {
      id: 'g-shimla-3',
      name: 'Vipin Dogra',
      city: 'Shimla',
      languages: ['English', 'Hindi', 'Punjabi'],
      bio: 'Heritage homestay custodian and mountain driver with 14 years navigating Cart Road traffic and Mashobra forest lanes.',
      photo: CITY_PHOTOS.Shimla,
      rating: 4.7,
      reviewCount: 4,
      responseTime: '< 3h',
      verified: false
    },

    // 2. Manali
    {
      id: 'g-manali-1',
      name: 'Karma Negi',
      city: 'Manali',
      languages: ['English', 'Hindi', 'Tibetan'],
      bio: 'Licensed mountaineering instructor for Beas Kund and Hampta Pass acclimation day hikes. Honest weather advisory.',
      photo: CITY_PHOTOS.Manali,
      rating: 4.9,
      reviewCount: 8,
      responseTime: '< 1h',
      verified: true
    },
    {
      id: 'g-manali-2',
      name: 'Rishi Thakur',
      city: 'Manali',
      languages: ['English', 'Hindi'],
      bio: 'Experienced Solang & Rohtang corridor driver who prioritizes mountain pass timings to evade tourist choke points.',
      photo: CITY_PHOTOS.Manali,
      rating: 4.8,
      reviewCount: 6,
      responseTime: '< 2h',
      verified: true
    },
    {
      id: 'g-manali-3',
      name: 'Devika Sen',
      city: 'Manali',
      languages: ['English', 'Hindi', 'Bengali'],
      bio: 'Travel photographer documenting cedar mist, Old Manali stone houses, and candid mountain portraits.',
      photo: CITY_PHOTOS.Manali,
      rating: 4.7,
      reviewCount: 4,
      responseTime: '< 4h',
      verified: false
    },

    // 3. Jaipur
    {
      id: 'g-jaipur-1',
      name: 'Gajendra Rathore',
      city: 'Jaipur',
      languages: ['English', 'Hindi', 'Marwari'],
      bio: 'Seventh-generation Pink City resident leading sunrise walks through Chandpole bazaars and artisan havelis.',
      photo: CITY_PHOTOS.Jaipur,
      rating: 4.9,
      reviewCount: 8,
      responseTime: '< 1h',
      verified: true
    },
    {
      id: 'g-jaipur-2',
      name: 'Pooja Khandelwal',
      city: 'Jaipur',
      languages: ['English', 'Hindi'],
      bio: 'Culinary writer and street-food archivist. Curates Kachori, Ghewar, and Pandit Kulfi tasting walks through walled city corners.',
      photo: CITY_PHOTOS.Jaipur,
      rating: 4.9,
      reviewCount: 7,
      responseTime: '< 2h',
      verified: true
    },
    {
      id: 'g-jaipur-3',
      name: 'Sameer Sheikh',
      city: 'Jaipur',
      languages: ['English', 'Hindi', 'Urdu'],
      bio: 'Street and architectural photographer specializing in Amber Fort twilight angles, stepwells, and block-print artisans.',
      photo: CITY_PHOTOS.Jaipur,
      rating: 4.8,
      reviewCount: 5,
      responseTime: '< 3h',
      verified: false
    },

    // 4. Udaipur
    {
      id: 'g-udaipur-1',
      name: 'Bhawani Singh',
      city: 'Udaipur',
      languages: ['English', 'Hindi', 'Mewari'],
      bio: 'Lake Pichola heritage walk curator and ghat preservation volunteer. Deep expertise in Mewar royal history.',
      photo: CITY_PHOTOS.Udaipur,
      rating: 4.9,
      reviewCount: 6,
      responseTime: '< 1h',
      verified: true
    },
    {
      id: 'g-udaipur-2',
      name: 'Kavita Dave',
      city: 'Udaipur',
      languages: ['English', 'Hindi', 'Gujarati'],
      bio: 'Old city boutique stay host and rooftop sunset curator overlooking Lake Fatehsagar and Monsoon Palace.',
      photo: CITY_PHOTOS.Udaipur,
      rating: 4.8,
      reviewCount: 5,
      responseTime: '< 2h',
      verified: true
    },
    {
      id: 'g-udaipur-3',
      name: 'Manish Chouhan',
      city: 'Udaipur',
      languages: ['English', 'Hindi'],
      bio: 'Chauffeur and day tour specialist covering Kumbhalgarh fort and Ranakpur marble temples with comfortable air-conditioned cars.',
      photo: CITY_PHOTOS.Udaipur,
      rating: 4.7,
      reviewCount: 4,
      responseTime: '< 3h',
      verified: false
    },

    // 5. Goa
    {
      id: 'g-goa-1',
      name: 'Savio Fernandes',
      city: 'Goa',
      languages: ['English', 'Konkani', 'Portuguese', 'Hindi'],
      bio: 'Fontainhas heritage architecture walk host and culinary storyteller passionate about Indo-Portuguese heritage.',
      photo: CITY_PHOTOS.Goa,
      rating: 4.9,
      reviewCount: 7,
      responseTime: '< 1h',
      verified: true
    },
    {
      id: 'g-goa-2',
      name: 'Clara Dias',
      city: 'Goa',
      languages: ['English', 'Konkani', 'Hindi'],
      bio: 'South Goa food explorer guiding visits to spice plantations, fisherman toddy stalls, and ancestral wood-fired bakeries.',
      photo: CITY_PHOTOS.Goa,
      rating: 4.8,
      reviewCount: 6,
      responseTime: '< 2h',
      verified: true
    },
    {
      id: 'g-goa-3',
      name: 'Rohan Naik',
      city: 'Goa',
      languages: ['English', 'Konkani', 'Hindi'],
      bio: 'Private coastal driver with AC Innova, navigating offbeat beaches, Divar Island ferry crossings, and chapels.',
      photo: CITY_PHOTOS.Goa,
      rating: 4.7,
      reviewCount: 5,
      responseTime: '< 2h',
      verified: false
    },

    // 6. Tokyo
    {
      id: 'g-tokyo-1',
      name: 'Kenji Takahashi',
      city: 'Tokyo',
      languages: ['English', 'Japanese'],
      bio: 'Yanaka and Asakusa heritage guide. Shares Tokyo historic shitamachi (low city) alleys, tea shops, and temple etiquette.',
      photo: CITY_PHOTOS.Tokyo,
      rating: 4.9,
      reviewCount: 7,
      responseTime: '< 2h',
      verified: true
    },
    {
      id: 'g-tokyo-2',
      name: 'Yuki Moriyama',
      city: 'Tokyo',
      languages: ['English', 'Japanese'],
      bio: 'Tsukiji outer market and Ginza food enthusiast specializing in seasonal sushi, yakitori stalls, and matcha masters.',
      photo: CITY_PHOTOS.Tokyo,
      rating: 4.9,
      reviewCount: 8,
      responseTime: '< 1h',
      verified: true
    },
    {
      id: 'g-tokyo-3',
      name: 'Hana Tanaka',
      city: 'Tokyo',
      languages: ['English', 'Japanese', 'French'],
      bio: 'Neon and street portrait photographer guiding night walks through Shinjuku Omoide Yokocho and Shibuya hidden overlooks.',
      photo: CITY_PHOTOS.Tokyo,
      rating: 4.8,
      reviewCount: 5,
      responseTime: '< 3h',
      verified: false
    },

    // 7. Dubai
    {
      id: 'g-dubai-1',
      name: 'Tariq Al-Mansoor',
      city: 'Dubai',
      languages: ['English', 'Arabic', 'Hindi'],
      bio: 'Al Fahidi historic district and Creek abra boat guide. Focuses on pre-boom pearl diving culture and spice souks.',
      photo: CITY_PHOTOS.Dubai,
      rating: 4.8,
      reviewCount: 6,
      responseTime: '< 1h',
      verified: true
    },
    {
      id: 'g-dubai-2',
      name: 'Zainab Qureshi',
      city: 'Dubai',
      languages: ['English', 'Urdu', 'Arabic'],
      bio: 'Desert sunset safari host and evening astro-camp organizer with honest pacing away from tourist traps.',
      photo: CITY_PHOTOS.Dubai,
      rating: 4.9,
      reviewCount: 6,
      responseTime: '< 2h',
      verified: true
    },
    {
      id: 'g-dubai-3',
      name: 'Adnan Malik',
      city: 'Dubai',
      languages: ['English', 'Hindi', 'Arabic'],
      bio: 'Private chauffeur for Abu Dhabi Louvre and Dubai skyline architectural routes in luxury vehicle.',
      photo: CITY_PHOTOS.Dubai,
      rating: 4.7,
      reviewCount: 4,
      responseTime: '< 2h',
      verified: false
    },

    // 8. Chandigarh
    {
      id: 'g-chd-1',
      name: 'Harpreet Singh Dhillon',
      city: 'Chandigarh',
      languages: ['English', 'Punjabi', 'Hindi'],
      bio: 'Architecture lecturer and Le Corbusier heritage researcher. Guides Capitol Complex, Open Hand, and Sector 17 promenade.',
      photo: CITY_PHOTOS.Chandigarh,
      rating: 4.9,
      reviewCount: 6,
      responseTime: '< 1h',
      verified: true
    },
    {
      id: 'g-chd-2',
      name: 'Gurpreet Kaur',
      city: 'Chandigarh',
      languages: ['English', 'Punjabi', 'Hindi'],
      bio: 'Rock Garden and Sukhna Lake morning photography specialist. Highlights Nek Chand sculptures and migrating birds.',
      photo: CITY_PHOTOS.Chandigarh,
      rating: 4.8,
      reviewCount: 5,
      responseTime: '< 2h',
      verified: true
    },
    {
      id: 'g-chd-3',
      name: 'Jasbir Gill',
      city: 'Chandigarh',
      languages: ['English', 'Punjabi', 'Hindi'],
      bio: 'Day driver covering Pinjore Yadavindra Gardens, Kasauli day excursions, and rural Punjab dhaba trails.',
      photo: CITY_PHOTOS.Chandigarh,
      rating: 4.7,
      reviewCount: 4,
      responseTime: '< 3h',
      verified: false
    },

    // 9. Munnar
    {
      id: 'g-munnar-1',
      name: 'Mathew George',
      city: 'Munnar',
      languages: ['English', 'Malayalam', 'Tamil'],
      bio: 'Tea plantation veteran and Western Ghats bio-reserve trek leader. Expert in Neelakurinji slopes and Anamudi view points.',
      photo: CITY_PHOTOS.Munnar,
      rating: 4.9,
      reviewCount: 7,
      responseTime: '< 1h',
      verified: true
    },
    {
      id: 'g-munnar-2',
      name: 'Anjali Nair',
      city: 'Munnar',
      languages: ['English', 'Malayalam', 'Hindi'],
      bio: 'Eco-plantation estate host. Demonstrates orthodox tea processing, organic spice gardens, and farm-to-table Kerala breakfasts.',
      photo: CITY_PHOTOS.Munnar,
      rating: 4.9,
      reviewCount: 6,
      responseTime: '< 2h',
      verified: true
    },
    {
      id: 'g-munnar-3',
      name: 'Pradeep Kumar',
      city: 'Munnar',
      languages: ['English', 'Tamil', 'Malayalam'],
      bio: 'Top Station dawn photographer and mist chaser. Captures cloud beds and mountain silhouettes in high altitude.',
      photo: CITY_PHOTOS.Munnar,
      rating: 4.8,
      reviewCount: 5,
      responseTime: '< 3h',
      verified: false
    },

    // 10. Kyoto
    {
      id: 'g-kyoto-1',
      name: 'Sora Yamamoto',
      city: 'Kyoto',
      languages: ['English', 'Japanese'],
      bio: 'Historian and traditional garden scholar guiding mindful visits through Gion, Kennin-ji, and Philosopher’s Path.',
      photo: CITY_PHOTOS.Kyoto,
      rating: 4.9,
      reviewCount: 8,
      responseTime: '< 1h',
      verified: true
    },
    {
      id: 'g-kyoto-2',
      name: 'Emi Sato',
      city: 'Kyoto',
      languages: ['English', 'Japanese'],
      bio: 'Kimono street photographer capturing morning light in Arashiyama bamboo groves and Higashiyama preserved alleys.',
      photo: CITY_PHOTOS.Kyoto,
      rating: 4.9,
      reviewCount: 7,
      responseTime: '< 2h',
      verified: true
    },
    {
      id: 'g-kyoto-3',
      name: 'Takeshi Inoue',
      city: 'Kyoto',
      languages: ['English', 'Japanese'],
      bio: 'Machiya townhouse host and Uji green tea ceremony master. Introduces quiet temple gardens outside tourist bus routes.',
      photo: CITY_PHOTOS.Kyoto,
      rating: 4.8,
      reviewCount: 5,
      responseTime: '< 3h',
      verified: false
    },

    // 11. Bangkok
    {
      id: 'g-bkk-1',
      name: 'Somchai Prasert',
      city: 'Bangkok',
      languages: ['English', 'Thai'],
      bio: 'Chao Phraya canal and Chinatown street-food explorer. Takes you to Michelin Bib Gourmand duck stalls and secret shophouses.',
      photo: CITY_PHOTOS.Bangkok,
      rating: 4.9,
      reviewCount: 8,
      responseTime: '< 1h',
      verified: true
    },
    {
      id: 'g-bkk-2',
      name: 'Pimchanok Saelim',
      city: 'Bangkok',
      languages: ['English', 'Thai', 'Mandarin'],
      bio: 'Old City Rattanakosin island temple walker explaining temple murals, amulets, and riverfront architecture with care.',
      photo: CITY_PHOTOS.Bangkok,
      rating: 4.8,
      reviewCount: 6,
      responseTime: '< 2h',
      verified: true
    },
    {
      id: 'g-bkk-3',
      name: 'Niran Chai',
      city: 'Bangkok',
      languages: ['English', 'Thai'],
      bio: 'Ayutthaya ancient capital private driver with air-conditioned minibus and custom sunset temple ruins stops.',
      photo: CITY_PHOTOS.Bangkok,
      rating: 4.7,
      reviewCount: 4,
      responseTime: '< 3h',
      verified: false
    },

    // 12. Zurich
    {
      id: 'g-zurich-1',
      name: 'Lukas Steiner',
      city: 'Zurich',
      languages: ['English', 'German', 'French'],
      bio: 'Swiss architectural historian leading walks across Zurich Altstadt, guild houses, Lindenhof, and Lake promenade.',
      photo: CITY_PHOTOS.Zurich,
      rating: 4.9,
      reviewCount: 7,
      responseTime: '< 1h',
      verified: true
    },
    {
      id: 'g-zurich-2',
      name: 'Maya Keller',
      city: 'Zurich',
      languages: ['English', 'German', 'Italian'],
      bio: 'Uetliberg trail leader and alpine panoramic photographer. Paces scenic ridge walks with honest gear recommendations.',
      photo: CITY_PHOTOS.Zurich,
      rating: 4.9,
      reviewCount: 6,
      responseTime: '< 2h',
      verified: true
    },
    {
      id: 'g-zurich-3',
      name: 'Beat Schneider',
      city: 'Zurich',
      languages: ['English', 'German'],
      bio: 'Private chauffeur for Lucerne, Rhine Falls, and Heidiland day excursions in premium Swiss touring coach.',
      photo: CITY_PHOTOS.Zurich,
      rating: 4.8,
      reviewCount: 5,
      responseTime: '< 3h',
      verified: false
    }
  ];

  const services = [
    // Shimla (3 services)
    {
      id: 's-sh-1',
      guideId: 'g-shimla-1',
      title: 'Old Shimla Heritage & British Corridors Walk',
      type: 'Walking tour',
      city: 'Shimla',
      priceMode: 'person',
      price: 1250,
      capacityMin: 1,
      capacityMax: 8,
      duration: '3.5h',
      inclusions: ['Gaiety Theatre balcony entry permit', 'Archival map reprint', 'Heritage tea & bakery stop', 'Shortcut staircase route map'],
      availability: generateDates(1, 14)
    },
    {
      id: 's-sh-2',
      guideId: 'g-shimla-2',
      title: 'Jakhu Peak & Deodar Forest Crest Day Hike',
      type: 'Trek leader',
      city: 'Shimla',
      priceMode: 'person',
      price: 1650,
      capacityMin: 1,
      capacityMax: 6,
      duration: '4.5h',
      inclusions: ['Trekking poles provided', 'Bottled spring water', 'Fresh orchard apple snack', 'High-altitude botanical guide'],
      availability: generateDates(2, 12)
    },
    {
      id: 's-sh-3',
      guideId: 'g-shimla-3',
      title: 'Mashobra Cedar Ridge Private Homestay & Fireplace',
      type: 'Stay host',
      city: 'Shimla',
      priceMode: 'group',
      price: 4800,
      capacityMin: 2,
      capacityMax: 6,
      duration: 'Overnight',
      inclusions: ['Traditional Himachali dinner', 'Firewood hearth evening', 'Sunrise tea over Shivalik ranges', 'Free parking & heater'],
      availability: generateDates(3, 10)
    },

    // Manali (3 services)
    {
      id: 's-mn-1',
      guideId: 'g-manali-1',
      title: 'Beas Kund Base & Mountain Stream Acclimatization Hike',
      type: 'Trek leader',
      city: 'Manali',
      priceMode: 'person',
      price: 2400,
      capacityMin: 1,
      capacityMax: 8,
      duration: '6h',
      inclusions: ['Certified safety kit & pulse oximeter', 'Hot mountain tea in thermos', 'Energy snack pack', 'River crossing support'],
      availability: generateDates(1, 12)
    },
    {
      id: 's-mn-2',
      guideId: 'g-manali-2',
      title: 'Atal Tunnel & Sissu Waterfall Private Day Excursion',
      type: 'Driver day',
      city: 'Manali',
      priceMode: 'group',
      price: 4500,
      capacityMin: 1,
      capacityMax: 6,
      duration: '7h',
      inclusions: ['AC 4x4 vehicle with driver', 'Green cess & toll permits', 'Bottled water', 'Heated cabin for high-altitude return'],
      availability: generateDates(2, 14)
    },
    {
      id: 's-mn-3',
      guideId: 'g-manali-3',
      title: 'Old Manali Apple Orchards & Riverbank Photo Session',
      type: 'Photographer',
      city: 'Manali',
      priceMode: 'group',
      price: 5200,
      capacityMin: 1,
      capacityMax: 4,
      duration: '2.5h',
      inclusions: ['40 color-graded digital portraits', 'Same-day sneak peek gallery', 'Local cedar grove locations', 'High-res cloud download link'],
      availability: generateDates(3, 11)
    },

    // Jaipur (3 services)
    {
      id: 's-jp-1',
      guideId: 'g-jaipur-1',
      title: 'Walled Pink City Bazaars & Havelis Dawn Walk',
      type: 'Walking tour',
      city: 'Jaipur',
      priceMode: 'person',
      price: 950,
      capacityMin: 1,
      capacityMax: 8,
      duration: '3h',
      inclusions: ['Artisan block-printing studio demo', 'Filtered bottled water', 'Temple morning arti access', 'Curated spice market route'],
      availability: generateDates(1, 14)
    },
    {
      id: 's-jp-2',
      guideId: 'g-jaipur-2',
      title: 'Old Johari & Bapu Bazaar Royal Food Walk',
      type: 'Food walk',
      city: 'Jaipur',
      priceMode: 'person',
      price: 1850,
      capacityMin: 1,
      capacityMax: 6,
      duration: '3.5h',
      inclusions: ['7 authentic food tastings (Pyaaz Kachori, Lassi, Ghewar)', 'Sanitized utensils & water', 'Guide culinary commentary', 'Digestive chai tasting'],
      availability: generateDates(2, 13)
    },
    {
      id: 's-jp-3',
      guideId: 'g-jaipur-3',
      title: 'Amber Fort Twilight & Stepwell Golden Hour Portrait Shoot',
      type: 'Photographer',
      city: 'Jaipur',
      priceMode: 'group',
      price: 5800,
      capacityMin: 1,
      capacityMax: 5,
      duration: '3h',
      inclusions: ['50 retouched images', 'Private stepwell access arrangement', 'Traditional umbrella props', 'Next-day delivery'],
      availability: generateDates(1, 10)
    },

    // Udaipur (3 services)
    {
      id: 's-ud-1',
      guideId: 'g-udaipur-1',
      title: 'Lake Pichola Ghats & Gangaur Kund Heritage Walk',
      type: 'Walking tour',
      city: 'Udaipur',
      priceMode: 'person',
      price: 1100,
      capacityMin: 1,
      capacityMax: 8,
      duration: '2.5h',
      inclusions: ['Bagore Ki Haveli museum courtyard access', 'Traditional miniature painter demo', 'Bottled water', 'Historic ghat overview map'],
      availability: generateDates(1, 12)
    },
    {
      id: 's-ud-2',
      guideId: 'g-udaipur-2',
      title: 'Ranakpur Marble Temples & Countryside Chauffeur Day',
      type: 'Driver day',
      city: 'Udaipur',
      priceMode: 'group',
      price: 4900,
      capacityMin: 1,
      capacityMax: 6,
      duration: '8h',
      inclusions: ['AC vehicle with fuel and tolls', 'Temple audio guide arrangement', 'Cold refreshments', 'Flexible photography pauses in Aravali pass'],
      availability: generateDates(2, 14)
    },
    {
      id: 's-ud-3',
      guideId: 'g-udaipur-3',
      title: 'Fatehsagar Lakeview Haveli Courtyard & Sunset Suite',
      type: 'Stay host',
      city: 'Udaipur',
      priceMode: 'group',
      price: 5600,
      capacityMin: 2,
      capacityMax: 4,
      duration: 'Overnight',
      inclusions: ['Rooftop breakfast overlooking lake', 'Evening folk instrument performance', 'Luggage assistance', 'Complimentary afternoon masala chai'],
      availability: generateDates(3, 11)
    },

    // Goa (3 services)
    {
      id: 's-goa-1',
      guideId: 'g-goa-1',
      title: 'Latin Quarter Fontainhas Colors & Portuguese Tile Walk',
      type: 'Walking tour',
      city: 'Goa',
      priceMode: 'person',
      price: 1200,
      capacityMin: 1,
      capacityMax: 8,
      duration: '2.5h',
      inclusions: ['Traditional Goan bakery stop (Poee bread)', 'Heritage azulejo tile shop visit', 'Bottled water', 'Historic neighborhood booklet'],
      availability: generateDates(1, 14)
    },
    {
      id: 's-goa-2',
      guideId: 'g-goa-2',
      title: 'Spice Village Secret Kitchens & Kokum Tasting Walk',
      type: 'Food walk',
      city: 'Goa',
      priceMode: 'person',
      price: 1950,
      capacityMin: 1,
      capacityMax: 6,
      duration: '3.5h',
      inclusions: ['5 coastal tastings including fish/veg thali samples', 'Fresh cashew feni / kokum cooler', 'Spice plantation walk', 'Recipe printouts'],
      availability: generateDates(2, 12)
    },
    {
      id: 's-goa-3',
      guideId: 'g-goa-3',
      title: 'South Goa Hidden Coves & Divar Island Private Chauffeur',
      type: 'Driver day',
      city: 'Goa',
      priceMode: 'group',
      price: 3900,
      capacityMin: 1,
      capacityMax: 6,
      duration: '8h',
      inclusions: ['Spacious AC SUV', 'Ferry crossing tickets', 'Chilled coconut water', 'Secret beach viewpoints without crowds'],
      availability: generateDates(1, 13)
    },

    // Tokyo (3 services)
    {
      id: 's-tk-1',
      guideId: 'g-tokyo-1',
      title: 'Yanaka Old Town Nostalgia & Temple Lane Walking Tour',
      type: 'Walking tour',
      city: 'Tokyo',
      priceMode: 'person',
      price: 3200,
      capacityMin: 1,
      capacityMax: 6,
      duration: '3.5h',
      inclusions: ['Japanese senbei cracker tasting', 'Temple cemetery history guide', 'Matcha tea stop', 'Transit card assistance'],
      availability: generateDates(1, 14)
    },
    {
      id: 's-tk-2',
      guideId: 'g-tokyo-2',
      title: 'Tsukiji Outer Market Morning Fresh Sushi & Dashi Crawl',
      type: 'Food walk',
      city: 'Tokyo',
      priceMode: 'person',
      price: 4500,
      capacityMin: 1,
      capacityMax: 5,
      duration: '3h',
      inclusions: ['Tamagoyaki omelet tasting', 'Premium nigiri sushi trio', 'Kombu dashi broth tasting', 'English seafood glossary'],
      availability: generateDates(2, 12)
    },
    {
      id: 's-tk-3',
      guideId: 'g-tokyo-3',
      title: 'Shinjuku Cyberpunk & Golden Gai Night Portrait Session',
      type: 'Photographer',
      city: 'Tokyo',
      priceMode: 'group',
      price: 7800,
      capacityMin: 1,
      capacityMax: 4,
      duration: '2.5h',
      inclusions: ['35 stylized night neon portraits', 'Prime alley locations with no crowd blockages', 'High-speed cloud delivery', 'Lighting gear included'],
      availability: generateDates(3, 10)
    },

    // Dubai (3 services)
    {
      id: 's-db-1',
      guideId: 'g-dubai-1',
      title: 'Al Fahidi Creek Heritage & Spice Souk Walking Tour',
      type: 'Walking tour',
      city: 'Dubai',
      priceMode: 'person',
      price: 2100,
      capacityMin: 1,
      capacityMax: 8,
      duration: '3h',
      inclusions: ['Abra wooden boat Creek crossing', 'Arabic coffee & Medjool dates', 'Perfume mixing demonstration', 'Souk bargaining guide'],
      availability: generateDates(1, 14)
    },
    {
      id: 's-db-2',
      guideId: 'g-dubai-2',
      title: 'Conservation Desert Dunes Sunset & Bedouin Camp Evening',
      type: 'Stay host',
      city: 'Dubai',
      priceMode: 'group',
      price: 7200,
      capacityMin: 2,
      capacityMax: 6,
      duration: '6h',
      inclusions: ['4x4 desert dune navigation', 'Open-air dune lounge setup', 'Barbecue dinner under stars', 'Telescope stargazing session'],
      availability: generateDates(2, 11)
    },
    {
      id: 's-db-3',
      guideId: 'g-dubai-3',
      title: 'Abu Dhabi Sheikh Zayed Grand Mosque Private Chauffeur',
      type: 'Driver day',
      city: 'Dubai',
      priceMode: 'group',
      price: 6800,
      capacityMin: 1,
      capacityMax: 6,
      duration: '8h',
      inclusions: ['Luxury Mercedes van with Wi-Fi', 'Mosque attire assistance', 'Bottled mineral water', 'Louvre Museum drop and pick'],
      availability: generateDates(1, 13)
    },

    // Chandigarh (3 services)
    {
      id: 's-chd-1',
      guideId: 'g-chd-1',
      title: 'Le Corbusier Capitol Complex & Modernist Architecture Walk',
      type: 'Walking tour',
      city: 'Chandigarh',
      priceMode: 'person',
      price: 1100,
      capacityMin: 1,
      capacityMax: 8,
      duration: '3h',
      inclusions: ['Official Secretariat entry permit', 'Corbusier modular scale diagram booklet', 'Cold lassi stop', 'Sector 17 civic center overview'],
      availability: generateDates(1, 14)
    },
    {
      id: 's-chd-2',
      guideId: 'g-chd-2',
      title: 'Nek Chand Rock Garden Sculptures & Sukhna Lake Shoot',
      type: 'Photographer',
      city: 'Chandigarh',
      priceMode: 'group',
      price: 3600,
      capacityMin: 1,
      capacityMax: 5,
      duration: '2.5h',
      inclusions: ['30 high-res edited photos', 'Rock garden ticket included', 'Sunset lake promenade shoot', 'Digital album download'],
      availability: generateDates(2, 12)
    },
    {
      id: 's-chd-3',
      guideId: 'g-chd-3',
      title: 'Timber Trail & Kasauli Hills Chauffeur Day Trip',
      type: 'Driver day',
      city: 'Chandigarh',
      priceMode: 'group',
      price: 3800,
      capacityMin: 1,
      capacityMax: 6,
      duration: '7h',
      inclusions: ['Clean AC sedan with mountain driver', 'Tolls & border permits', 'Cable car station stop', 'Hillside orchard viewpoints'],
      availability: generateDates(3, 11)
    },

    // Munnar (3 services)
    {
      id: 's-mnr-1',
      guideId: 'g-munnar-1',
      title: 'Chokramudi Ridge & Cloud Valley Day Trek',
      type: 'Trek leader',
      city: 'Munnar',
      priceMode: 'person',
      price: 1800,
      capacityMin: 1,
      capacityMax: 8,
      duration: '5h',
      inclusions: ['Forest department trek permit', 'First-aid kit and walking sticks', 'Spiced tea & Kerala banana chips', 'Biodiversity spotting'],
      availability: generateDates(1, 13)
    },
    {
      id: 's-mnr-2',
      guideId: 'g-munnar-2',
      title: 'Century-Old Tea Estate Bungalow & Planter High Tea',
      type: 'Stay host',
      city: 'Munnar',
      priceMode: 'group',
      price: 4900,
      capacityMin: 2,
      capacityMax: 6,
      duration: 'Overnight',
      inclusions: ['Planter colonial dinner', 'Private tea factory guided walk', 'Fireplace lounge access', 'Fresh estate orthodox tea selection'],
      availability: generateDates(2, 10)
    },
    {
      id: 's-mnr-3',
      guideId: 'g-munnar-3',
      title: 'Cardamom Hills & Village Spice Trail Tasting',
      type: 'Food walk',
      city: 'Munnar',
      priceMode: 'person',
      price: 1400,
      capacityMin: 1,
      capacityMax: 6,
      duration: '3h',
      inclusions: ['Live cinnamon and clove harvesting demo', 'Fresh herbal tea infusions', 'Cardamom farm honey tasting', 'Sample spice pouch'],
      availability: generateDates(3, 12)
    },

    // Kyoto (3 services)
    {
      id: 's-ky-1',
      guideId: 'g-kyoto-1',
      title: 'Gion Teahouse Architecture & Zen Temple Meditation Walk',
      type: 'Walking tour',
      city: 'Kyoto',
      priceMode: 'person',
      price: 3600,
      capacityMin: 1,
      capacityMax: 6,
      duration: '3.5h',
      inclusions: ['Temple zen rock garden entry', 'Geisha culture etiquette guide', 'Matcha and traditional wagashi sweet', 'English pocket guide'],
      availability: generateDates(1, 14)
    },
    {
      id: 's-ky-2',
      guideId: 'g-kyoto-2',
      title: 'Arashiyama Bamboo Forest Sunrise Photography Session',
      type: 'Photographer',
      city: 'Kyoto',
      priceMode: 'group',
      price: 7200,
      capacityMin: 1,
      capacityMax: 4,
      duration: '2.5h',
      inclusions: ['35 magazine-grade portraits before crowds arrive', 'Secret bridge locations over Oi River', 'Fast 48h cloud download', 'Posing direction'],
      availability: generateDates(2, 11)
    },
    {
      id: 's-ky-3',
      guideId: 'g-kyoto-3',
      title: 'Historic Wooden Machiya Townhouse Experience & Tea',
      type: 'Stay host',
      city: 'Kyoto',
      priceMode: 'group',
      price: 8500,
      capacityMin: 2,
      capacityMax: 5,
      duration: 'Overnight',
      inclusions: ['Private tatami room and Japanese garden view', 'Morning cedar wood tub bath', 'Traditional seasonal bento breakfast', 'Calligraphy demo'],
      availability: generateDates(1, 10)
    },

    // Bangkok (3 services)
    {
      id: 's-bkk-1',
      guideId: 'g-bkk-1',
      title: 'Yaowarat Chinatown Midnight Street Food Crawl',
      type: 'Food walk',
      city: 'Bangkok',
      priceMode: 'person',
      price: 1950,
      capacityMin: 1,
      capacityMax: 7,
      duration: '3.5h',
      inclusions: ['6 authentic tastings including toasted buns and rolled noodles', 'Cold herbal chrysanthemum tea', 'Sanitary wet towels', 'Chinatown back-alley history'],
      availability: generateDates(1, 14)
    },
    {
      id: 's-bkk-2',
      guideId: 'g-bkk-2',
      title: 'Wat Arun & Klong Bangkok Yai Longtail Boat & Walk',
      type: 'Walking tour',
      city: 'Bangkok',
      priceMode: 'person',
      price: 2400,
      capacityMin: 1,
      capacityMax: 8,
      duration: '3.5h',
      inclusions: ['Private teak longtail boat ride', 'Wat Arun temple entry permit', 'Cold bottled water & coconut', 'Monastery mural insights'],
      availability: generateDates(2, 12)
    },
    {
      id: 's-bkk-3',
      guideId: 'g-bkk-3',
      title: 'Ayutthaya UNESCO Ruins & Summer Palace Private Minibus',
      type: 'Driver day',
      city: 'Bangkok',
      priceMode: 'group',
      price: 4800,
      capacityMin: 1,
      capacityMax: 6,
      duration: '8h',
      inclusions: ['AC VIP Minibus with driver', 'Expressway tolls and parking', 'Chilled towels & bottled water', 'Temple ruins schedule optimization'],
      availability: generateDates(1, 13)
    },

    // Zurich (3 services)
    {
      id: 's-zh-1',
      guideId: 'g-zurich-1',
      title: 'Zurich Guilds, Lindenhof & Old Town Secret Squares Walk',
      type: 'Walking tour',
      city: 'Zurich',
      priceMode: 'person',
      price: 3800,
      capacityMin: 1,
      capacityMax: 8,
      duration: '3h',
      inclusions: ['Swiss artisan chocolate tasting', 'Historic fountain water lore', 'Grossmünster tower overview', 'Funicular Polybahn ticket'],
      availability: generateDates(1, 14)
    },
    {
      id: 's-zh-2',
      guideId: 'g-zurich-2',
      title: 'Uetliberg Panoramic Ridge Trail & Lake Sunset Shoot',
      type: 'Photographer',
      city: 'Zurich',
      priceMode: 'group',
      price: 8400,
      capacityMin: 1,
      capacityMax: 4,
      duration: '3h',
      inclusions: ['40 high-resolution alpine backdrop portraits', 'Train summit guidance', 'Hot Swiss cider / tea', 'High-res cloud download link'],
      availability: generateDates(2, 10)
    },
    {
      id: 's-zh-3',
      guideId: 'g-zurich-3',
      title: 'Rhine Falls & Medieval Stein am Rhein Chauffeur Day',
      type: 'Driver day',
      city: 'Zurich',
      priceMode: 'group',
      price: 9200,
      capacityMin: 1,
      capacityMax: 6,
      duration: '7.5h',
      inclusions: ['Mercedes van with Swiss guide-driver', 'Highway toll vignettes and fuel', 'Boat approach tickets to the Falls rock', 'Mineral water and Swiss biscuits'],
      availability: generateDates(1, 12)
    }
  ];

  // Build authentic reviews for each service (3-6 reviews per service)
  const reviews = [
    // Reviews for s-sh-1
    {
      id: 'rev-1',
      serviceId: 's-sh-1',
      author: 'Priya Narang',
      rating: 5,
      text: 'Rohan’s deep knowledge of Gaiety Theatre’s Victorian architecture blew us away. His shortcut down to Lakkar Bazaar saved us from the Cart Road jams completely.',
      date: '2025-09-14',
      helpful: 8,
      tags: ['local knowledge', 'on time', 'good value']
    },
    {
      id: 'rev-2',
      serviceId: 's-sh-1',
      author: 'Aditya Sen',
      rating: 5,
      text: 'Honest pacing, zero commercial stops, and great storytelling. Loved the old archival map he brought along. Highly recommended for history buffs.',
      date: '2025-08-29',
      helpful: 4,
      tags: ['local knowledge', 'patient']
    },
    {
      id: 'rev-3',
      serviceId: 's-sh-1',
      author: 'Rachel Green',
      rating: 4,
      text: 'Very atmospheric walk in the morning mist. Some steep stairs, so bring good shoes, but totally worth it.',
      date: '2025-07-18',
      helpful: 3,
      tags: ['on time']
    },
    {
      id: 'rev-4',
      serviceId: 's-sh-1',
      author: 'Karan Mehra',
      rating: 5,
      text: 'The bakery stop was a warm surprise. Rohan really knows every shopkeeper along the Mall.',
      date: '2025-06-11',
      helpful: 2,
      tags: ['good value', 'hidden gems']
    },

    // Reviews for s-sh-2
    {
      id: 'rev-5',
      serviceId: 's-sh-2',
      author: 'Deepak Joshi',
      rating: 5,
      text: 'Sunita guided our group through the deodar ridge trail without any hurry. She kept our party well-paced and gave great tips on altitude breathing.',
      date: '2025-09-02',
      helpful: 6,
      tags: ['patient', 'local knowledge']
    },
    {
      id: 'rev-6',
      serviceId: 's-sh-2',
      author: 'Meera Rao',
      rating: 5,
      text: 'The Jakhu monkeys can be aggressive, but Sunita knew the quiet back trails where no one bothers you. The fresh apples were crisp and sweet!',
      date: '2025-08-15',
      helpful: 5,
      tags: ['on time', 'good value']
    },
    {
      id: 'rev-7',
      serviceId: 's-sh-2',
      author: 'Tanmay Bhatt',
      rating: 4,
      text: 'Challenging climb in the first 45 minutes, but the ridge view over Mashobra is unmatched.',
      date: '2025-07-22',
      helpful: 2,
      tags: ['hidden gems']
    },

    // Reviews for s-sh-3
    {
      id: 'rev-8',
      serviceId: 's-sh-3',
      author: 'Siddharth Roy',
      rating: 5,
      text: 'Staying at Vipin’s cedar cottage felt like living in another century. The wood fireplace and piping hot siddu dinner were unforgettable.',
      date: '2025-09-19',
      helpful: 7,
      tags: ['good value', 'local knowledge']
    },
    {
      id: 'rev-9',
      serviceId: 's-sh-3',
      author: 'Ananya Deshmukh',
      rating: 4,
      text: 'Cozy and very quiet. Great retreat away from Shimla town crowds. The sunrise tea overlooking the valley was pure magic.',
      date: '2025-08-10',
      helpful: 3,
      tags: ['patient']
    },

    // Reviews for s-jp-1 (Jaipur)
    {
      id: 'rev-10',
      serviceId: 's-jp-1',
      author: 'Vikramaditya Rathore',
      rating: 5,
      text: 'Gajendra unlocked doors to 200-year-old havelis that most tourists walk straight past. The morning flower market scents were mesmerizing.',
      date: '2025-09-24',
      helpful: 9,
      tags: ['local knowledge', 'hidden gems']
    },
    {
      id: 'rev-11',
      serviceId: 's-jp-1',
      author: 'Elena Rostova',
      rating: 5,
      text: 'A true gentleman and genuine historian. No commissions, no forced rug shop stops. Pure historical depth.',
      date: '2025-09-01',
      helpful: 6,
      tags: ['on time', 'good value']
    },
    {
      id: 'rev-12',
      serviceId: 's-jp-1',
      author: 'Nikhil Agarwal',
      rating: 4,
      text: 'Starting at 7:00 AM was key because the streets get chaotic later. Well worth waking up early.',
      date: '2025-08-14',
      helpful: 4,
      tags: ['on time']
    },

    // Reviews for s-jp-2
    {
      id: 'rev-13',
      serviceId: 's-jp-2',
      author: 'Arjun Singhania',
      rating: 5,
      text: 'Pooja is the undisputed queen of Jaipur street food. The hing kachori and rabri ghewar tasted like royalty. Zero stomach trouble!',
      date: '2025-10-02',
      helpful: 11,
      tags: ['good value', 'local knowledge', 'hidden gems']
    },
    {
      id: 'rev-14',
      serviceId: 's-jp-2',
      author: 'Claire Bennett',
      rating: 5,
      text: 'She made sure every stall was spotlessly clean and used filtered water. Easily the best food tour I’ve taken in India.',
      date: '2025-09-12',
      helpful: 5,
      tags: ['on time', 'patient']
    },

    // Reviews for s-goa-1
    {
      id: 'rev-15',
      serviceId: 's-goa-1',
      author: 'Nisha Pillai',
      rating: 5,
      text: 'Savio explained the Portuguese architectural influences on the balconies and oyster shell windows with such pride. The poee bread stop was delicious.',
      date: '2025-09-18',
      helpful: 8,
      tags: ['local knowledge', 'good value']
    },
    {
      id: 'rev-16',
      serviceId: 's-goa-1',
      author: 'Markus Weber',
      rating: 5,
      text: 'Fontainhas is picturesque, but Savio’s personal anecdotes transformed it from just Instagram photos into a living culture.',
      date: '2025-08-30',
      helpful: 4,
      tags: ['patient', 'hidden gems']
    },

    // Reviews for s-tk-1 (Tokyo)
    {
      id: 'rev-17',
      serviceId: 's-tk-1',
      author: 'Lucas Vance',
      rating: 5,
      text: 'Kenji showed us a side of Tokyo that felt like the 1960s Showa era. The rice cracker maker was a 4th generation master. Brilliant guide.',
      date: '2025-09-15',
      helpful: 10,
      tags: ['local knowledge', 'hidden gems']
    },
    {
      id: 'rev-18',
      serviceId: 's-tk-1',
      author: 'Sophie Martin',
      rating: 5,
      text: 'Quiet, reflective, and deeply informative about Buddhist temple architecture and neighborhood traditions.',
      date: '2025-08-20',
      helpful: 5,
      tags: ['on time', 'patient']
    },

    // Reviews for s-zh-1 (Zurich)
    {
      id: 'rev-19',
      serviceId: 's-zh-1',
      author: 'Gaurav Kapoor',
      rating: 5,
      text: 'Lukas is a walking encyclopedia of Zurich guild history. The chocolate tasting at the artisan shop alone justified the fee.',
      date: '2025-09-10',
      helpful: 7,
      tags: ['local knowledge', 'good value']
    },
    {
      id: 'rev-20',
      serviceId: 's-zh-1',
      author: 'Hannah Lindqvist',
      rating: 4,
      text: 'Great walk on a crisp autumn morning. The view from Lindenhof terrace over the Limmat was stunning.',
      date: '2025-08-04',
      helpful: 3,
      tags: ['on time']
    }
  ];

  // Initial demo bookings (for testing reviews, statuses, timeline)
  const bookings = [
    {
      id: 'bk-demo-1',
      serviceId: 's-sh-1',
      date: '2025-09-14',
      partySize: 2,
      name: 'Aarav Mehta',
      phone: '+91 98765 43210',
      notes: 'Please meet us near the Gaiety Theatre steps.',
      status: 'completed',
      total: 2500,
      createdAt: '2025-09-10T10:00:00.000Z'
    },
    {
      id: 'bk-demo-2',
      serviceId: 's-jp-2',
      date: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10),
      partySize: 3,
      name: 'Aarav Mehta',
      phone: '+91 98765 43210',
      notes: 'One member has a mild spice preference.',
      status: 'accepted',
      total: 5550,
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      id: 'bk-demo-3',
      serviceId: 's-sh-2',
      date: new Date(Date.now() + 86400000 * 12).toISOString().slice(0, 10),
      partySize: 2,
      name: 'Aarav Mehta',
      phone: '+91 98765 43210',
      notes: 'Hoping for clear views of Shivalik peaks.',
      status: 'requested',
      total: 3300,
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  ];

  // Initial demo message threads
  const threads = [
    {
      id: 'th-g-shimla-1',
      guideId: 'g-shimla-1',
      unread: 1,
      messages: [
        {
          id: 'm-1',
          from: 'traveler',
          text: 'Hi Rohan! We are arriving in Shimla on the toy train around 11:30 AM. Can we start the heritage walk from the station exit?',
          timestamp: new Date(Date.now() - 86400000 * 2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          serviceChip: { id: 's-sh-1', title: 'Old Shimla Heritage & British Corridors Walk' }
        },
        {
          id: 'm-2',
          from: 'guide',
          text: 'Hello Aarav! Yes, absolutely. The station is only 15 minutes walk from Gaiety Theatre via the Timber Gate stairs. I will meet you right at the platform gate with your map!',
          timestamp: new Date(Date.now() - 86400000 * 1).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'm-3',
          from: 'guide',
          text: 'Quick tip: the Cart Road is under repair near the lift this week, so please stick to walking shoes. Looking forward to hosting you!',
          timestamp: new Date(Date.now() - 3600000 * 3).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    },
    {
      id: 'th-g-jaipur-2',
      guideId: 'g-jaipur-2',
      unread: 0,
      messages: [
        {
          id: 'm-4',
          from: 'traveler',
          text: 'Namaste Pooja ji! Is the food walk suitable for someone who prefers mild spices?',
          timestamp: new Date(Date.now() - 86400000 * 3).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          serviceChip: { id: 's-jp-2', title: 'Old Johari & Bapu Bazaar Royal Food Walk' }
        },
        {
          id: 'm-5',
          from: 'guide',
          text: 'Namaste! Yes, absolutely. We sample sweet Ghewar, cooling Kulfi, and mild hing kachori with sweet tamarind chutney. Everything is customizable on the spot!',
          timestamp: new Date(Date.now() - 86400000 * 2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }
  ];

  return {
    guides,
    services,
    reviews,
    bookings,
    threads,
    savedIds: ['s-sh-1', 's-jp-2'],
    compareIds: [],
    attachedServices: [
      {
        serviceId: 's-sh-1',
        day: 1,
        title: 'Old Shimla Heritage & British Corridors Walk',
        guideName: 'Rohan Verma',
        price: 1250,
        partySize: 2,
        total: 2500,
        date: new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10)
      }
    ]
  };
}

export const SEED_CATALOG = buildSeedCatalog();
