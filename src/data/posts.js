/**
 * WanderWise Field Notes — Community Seed Data
 * 20 authentic, highly specific travel reviews across Shimla, Jaipur, Tokyo, Dubai, and Chandigarh.
 * Includes honest negative reviews, realistic prices in ₹, gate/queue details, and threaded comments.
 */

export const INITIAL_POSTS = [
  {
    id: 'post-1',
    city: 'Shimla',
    placeName: 'Kalka-Shimla Toy Train (Shivalik Deluxe Express)',
    category: 'Transport',
    rating: 4.5,
    title: 'Book train 52451 via IRCTC exactly 30 days ahead; skip tourist taxis at Kalka',
    review: 'Took train 52451 (05:45 departure from Kalka). The 5-hour ride through 102 tunnels is stunning, but here is what blogs never tell you: only coaches C1 and C2 have panoramic right-hand valley windows going uphill. If you miss booking on IRCTC, private taxi drivers outside Kalka station will quote ₹3,800 to ₹4,500; the standard prepaid Himachal Tourism counter inside platform 1 charges ₹2,200. Pack woolens inside your carry-on because Dharampur station at 08:00 drops to 11°C even in April.',
    author: {
      id: 'auth-1',
      name: 'Vikramaditya Chauhan',
      badge: 'Local Guide',
      isGuide: true,
      avatar: '/images/guide-portrait.jpg'
    },
    monthVisited: '2026-03',
    createdAt: '2026-03-20T10:15:00Z',
    travelerType: 'Solo',
    budgetLevel: '₹',
    daysSpent: 3,
    helpfulCount: 42,
    tips: [
      'Sit on the right side when ascending from Kalka to Shimla',
      'Tea stop at Barog station lasts exactly 10 minutes—don’t wander off',
      'Pre-book the government prepaid taxi counter inside the platform'
    ],
    comments: [
      {
        id: 'c-1',
        author: 'Neha R.',
        avatar: '',
        text: 'Can confirm! Followed your tip for coach C1 seat 14 last week, best views of Barog valley.',
        createdAt: '2026-03-24T14:20:00Z'
      },
      {
        id: 'c-2',
        author: 'Vikramaditya Chauhan',
        isGuide: true,
        text: 'Glad it helped! Remember the return down to Kalka flips the view to the left side.',
        createdAt: '2026-03-25T08:10:00Z'
      }
    ]
  },
  {
    id: 'post-2',
    city: 'Jaipur',
    placeName: 'Amer Fort & Ganesh Pol Entrance',
    category: 'Scams to avoid',
    rating: 2.5,
    title: 'Skip the elephant line and aggressive guides at Suraj Pol; take the back road',
    review: 'Amer Fort itself is remarkable, but the arrival experience at 10:00 AM was chaotic. Unlicensed guides wearing laminate fake badges corner you claiming the ticket counters inside are closed for private VIPs—this is 100% false. Walk straight up through Suraj Pol to the ASI ticket booth where the composite ticket (₹300 Indian / ₹1000 foreigner, covers 5 monuments) takes under 4 minutes. Also avoid the elephant rides: the line moves at a crawl, prices exceed ₹1,100 per pair, and animal welfare is concerning. Hire an official Rajasthan Tourism guide inside courtyard 2 for ₹400 fixed.',
    author: {
      id: 'auth-2',
      name: 'Pooja Sundaram',
      badge: 'Verified Visitor',
      avatar: ''
    },
    monthVisited: '2026-01',
    createdAt: '2026-02-04T12:00:00Z',
    travelerType: 'Couple',
    budgetLevel: '₹₹',
    daysSpent: 4,
    helpfulCount: 68,
    tips: [
      'Buy the composite monument pass at the main gate for ₹300',
      'Audio guides are available at courtyard 1 for ₹200 with ID deposit',
      'Arrive before 08:45 AM before Jaipur tour buses pull into the lot'
    ],
    comments: [
      {
        id: 'c-3',
        author: 'Devendra S.',
        text: 'Those fake guides almost got me in 2025. Thanks for calling this out so specifically.',
        createdAt: '2026-02-10T16:35:00Z'
      }
    ]
  },
  {
    id: 'post-3',
    city: 'Tokyo',
    placeName: 'Yanaka Ginza & Asakura Museum of Sculpture',
    category: 'Hidden spots',
    rating: 5.0,
    title: 'The quietest afternoon in Tokyo: wooden machiya and 100-yen croquettes',
    review: 'If Shibuya and Shinjuku give you sensory overload, take the Yamanote Line to Nippori Station and walk west down the Yuyake Dandan stairs into Yanaka. It survived the wartime bombings, so the street grid still reflects old Edo. Stopped at Niku no Suzuki for their hot minced beef croquette (menchi-katsu, ₹140 / 250 JPY) and visited the Asakura Museum of Sculpture (₹320 entry, shoe removal mandatory). The courtyard koi pond reflecting black cedar pillars is completely silent. Zero tour groups, all local retirees and neighborhood cats.',
    author: {
      id: 'auth-3',
      name: 'Kenji & Tanvi',
      badge: 'Verified Visitor',
      avatar: ''
    },
    monthVisited: '2025-11',
    createdAt: '2025-11-28T09:40:00Z',
    travelerType: 'Couple',
    budgetLevel: '₹₹',
    daysSpent: 6,
    helpfulCount: 51,
    tips: [
      'Most artisan craft shops close on Mondays and Tuesdays',
      'Carry coins or 1000-yen notes; small vendors do not take credit cards',
      'Take the West exit from Nippori Station, not the East bus terminal'
    ],
    comments: []
  },
  {
    id: 'post-4',
    city: 'Chandigarh',
    placeName: 'Le Corbusier Capitol Complex & High Court',
    category: 'Culture',
    rating: 4.8,
    title: 'You need an advance security pass for Sector 1; walk-ins will be turned back',
    review: 'Do not just take an auto to the High Court expecting to wander around. Because the Punjab & Haryana Secretariat and High Court are active high-security government facilities, you must obtain a visitor token from the Tourist Information Centre in Sector 19 or book the official guided slot online 24 hours prior. Tours run at 10:00, 12:00, and 15:00. The guide walks you through the Assembly hall with Corbusier’s hyperbolic cooling tower and the iconic Open Hand monument. Fee is ₹100. Bring original government ID.',
    author: {
      id: 'auth-4',
      name: 'Harmanjit Singh',
      badge: 'Local Guide',
      isGuide: true,
      avatar: '/images/guide-portrait.jpg'
    },
    monthVisited: '2026-02',
    createdAt: '2026-02-18T15:20:00Z',
    travelerType: 'Solo',
    budgetLevel: '₹',
    daysSpent: 2,
    helpfulCount: 39,
    tips: [
      'Carry your passport or Aadhaar card; photos on phones are rejected',
      'The morning 10:00 AM slot has the cleanest light on the concrete facade',
      'Wear comfortable flat shoes; you will walk nearly 3 km across open concrete plazas'
    ],
    comments: [
      {
        id: 'c-4',
        author: 'Arjun K.',
        text: 'This saved our trip. We almost took a cab straight to the gate on Sunday when it is closed.',
        createdAt: '2026-02-22T11:05:00Z'
      }
    ]
  },
  {
    id: 'post-5',
    city: 'Dubai',
    placeName: 'Al Fahidi Historic Neighbourhood & Dubai Creek Abra',
    category: 'Budget tips',
    rating: 4.6,
    title: 'The best ₹25 experience in Dubai: 1 AED boat ride and wind-tower alleys',
    review: 'Everyone talks about the ₹4,500 Burj Khalifa tickets, but the old creek is where Dubai actually feels grounding. Take the Green Metro line to Al Fahidi Station, walk through the coral-stone wind tower buildings, and visit the Dubai Coffee Museum (free entry, ₹220 for traditional Ethiopian roast). At Bur Dubai Abra Station, hand the captain exactly 1 AED (₹23) cash to cross the creek to Deira Old Souk. The breeze on the water at sunset beats any observation deck.',
    author: {
      id: 'auth-5',
      name: 'Zainab Qureshi',
      badge: 'Traveler',
      avatar: ''
    },
    monthVisited: '2025-12',
    createdAt: '2026-01-08T18:30:00Z',
    travelerType: 'Family',
    budgetLevel: '₹',
    daysSpent: 5,
    helpfulCount: 57,
    tips: [
      'Keep exact 1 AED coins ready; boat operators do not change 50 AED notes',
      'Visit between 16:30 and 18:00 when the afternoon heat drops',
      'Download the S’hail app for exact RTA bus and marine departure times'
    ],
    comments: [
      {
        id: 'c-5',
        author: 'Ravi M.',
        text: 'Did this with our kids last December. They enjoyed the wooden boat far more than the mega malls.',
        createdAt: '2026-01-14T19:00:00Z'
      }
    ]
  },
  {
    id: 'post-6',
    city: 'Shimla',
    placeName: 'Jakhu Hill Temple & Monkey Trail',
    category: 'Safety',
    rating: 3.2,
    title: 'Keep glasses and food in your zipped bag; the monkeys are predatory',
    review: 'Jakhu Temple sits at 2,455m with a great panoramic overlook of the Pir Panjal range, but the monkeys near the ropeway summit station have learned to snatch eyeglasses directly off people’s faces to hold them hostage for chickpeas. Take the ropeway cabin from the Ridge (₹550 return); walking the 2.5km steep grade takes 45 minutes on uneven asphalt and leaves children exhausted. If a monkey approaches, do not make eye contact and do not carry plastic grocery bags in hand.',
    author: {
      id: 'auth-6',
      name: 'Deepak Dogra',
      badge: 'Local Guide',
      isGuide: true,
      avatar: ''
    },
    monthVisited: '2025-10',
    createdAt: '2025-10-14T08:15:00Z',
    travelerType: 'Family',
    budgetLevel: '₹₹',
    daysSpent: 3,
    helpfulCount: 84,
    tips: [
      'Take off prescription spectacles and sunglasses before stepping off the cable car',
      'Rent a wooden walking stick at the base for ₹20 as a deterrent',
      'Last ropeway descent leaves at 17:15; walking down in the dark is unsafe'
    ],
    comments: []
  },
  {
    id: 'post-7',
    city: 'Jaipur',
    placeName: 'Laxmi Mishthan Bhandar (LMB) & Johari Bazaar',
    category: 'Food',
    rating: 4.1,
    title: 'Traditional Rajasthani thali is hearty, but order one thali for two people',
    review: 'LMB in Johari Bazaar has been operating since 1954. The Special Rajasthani Royal Thali is priced at ₹850 + taxes. It includes ker sangri, gatte ki subzi, dal baati churma, and ghewar soaked in rabri. Portions are massive—the ghee count will knock you out for the afternoon. If traveling as a couple, order one thali and one side lassi; otherwise half the food goes to waste. The brass service and heritage ambiance are worth the price, but wait times between 13:00 and 14:15 hit 30 minutes.',
    author: {
      id: 'auth-7',
      name: 'Aditi Mathur',
      badge: 'Verified Visitor',
      avatar: ''
    },
    monthVisited: '2025-09',
    createdAt: '2025-09-22T13:45:00Z',
    travelerType: 'Couple',
    budgetLevel: '₹₹',
    daysSpent: 3,
    helpfulCount: 33,
    tips: [
      'Take an e-rickshaw (₹50) from Badi Chopad; car parking in Johari Bazaar is impossible',
      'Pack a box of their dry fruit paneer ghewar for travel home—lasts 48 hours without refrigeration'
    ],
    comments: []
  },
  {
    id: 'post-8',
    city: 'Tokyo',
    placeName: 'Shinjuku Station South Exit & Luggage Lockers',
    category: 'Transport',
    rating: 3.0,
    title: 'Do not bring 28-inch suitcases through Shinjuku at 08:30 AM',
    review: 'Shinjuku handles 3.5 million commuters daily. We made the amateur mistake of navigating the underground passages with two full-sized hard-case bags during morning peak hours. Almost all coin lockers near the JR South Exit were full by 08:15 AM. Use the Ecbo Cloak app to pre-reserve luggage storage at an affiliated cafe for 800 JPY (₹440) per bag, or forward luggage directly from Haneda airport to your hotel via the Yamato Transport desk for ₹1,100 per piece.',
    author: {
      id: 'auth-8',
      name: 'Siddharth V.',
      badge: 'Traveler',
      avatar: ''
    },
    monthVisited: '2024-10',
    createdAt: '2024-11-02T11:20:00Z',
    travelerType: 'Couple',
    budgetLevel: '₹₹₹',
    daysSpent: 7,
    helpfulCount: 92,
    tips: [
      'Forward large luggage via Yamato Black Cat service from the airport',
      'Download the Japan Travel by NAVITIME app to filter train routes with escalators and elevators'
    ],
    comments: [
      {
        id: 'c-6',
        author: 'Emi Tanaka',
        text: 'Local Tokyo resident here: thank you! Large luggage on morning Yamanote trains creates hazardous bottlenecks.',
        createdAt: '2024-11-05T04:12:00Z'
      }
    ]
  },
  {
    id: 'post-9',
    city: 'Dubai',
    placeName: 'Museum of the Future Timed Slots',
    category: 'Culture',
    rating: 3.8,
    title: 'Buy tickets 3 weeks ahead; tickets are NOT sold at the door',
    review: 'Saw at least a dozen tourists turned away at the Sheikh Zayed Road lobby because they assumed they could buy tickets at the concierge. Tickets are ₹3,200 (149 AED) and sell out weeks in advance online. The building architecture and calligraphy exterior are breathtaking. Inside, the Amazon rainforest digital DNA vault in Chapter 3 is the highlight. However, if you have toddlers, the exhibition is heavy on conceptual audio guides and reading; under-5s will get bored after 40 minutes.',
    author: {
      id: 'auth-9',
      name: 'Farhan & Meera',
      badge: 'Verified Visitor',
      avatar: ''
    },
    monthVisited: '2026-02',
    createdAt: '2026-02-25T17:10:00Z',
    travelerType: 'Family',
    budgetLevel: '₹₹₹',
    daysSpent: 4,
    helpfulCount: 47,
    tips: [
      'Take the Red Metro line directly to Emirates Towers Station; linked via air-conditioned footbridge',
      'Book a slot between 11:30 AM and 13:00 PM for the shortest security screening queue'
    ],
    comments: []
  },
  {
    id: 'post-10',
    city: 'Chandigarh',
    placeName: 'Nek Chand Rock Garden',
    category: 'Hidden spots',
    rating: 4.7,
    title: '₹60 ticket for one of the most ingenious recycled art spaces on earth',
    review: 'Nek Chand built this secretly in the forested gorge for 18 years before city authorities discovered it in 1975. Entry is ₹60 for adults and ₹30 for children. The entire maze is constructed from broken ceramic washbasins, electrical fuses, glass bangles, and foundry slag. The low archways force you to bend and walk single-file through canyon courtyards. It opens at 09:00 AM; visit early because the stone courtyards trap heat by 13:00. Combine this with Sukhna Lake, which is just an 8-minute walk from Gate 3.',
    author: {
      id: 'auth-10',
      name: 'Gurpreet Kaur',
      badge: 'Local Guide',
      isGuide: true,
      avatar: ''
    },
    monthVisited: '2026-01',
    createdAt: '2026-01-20T10:00:00Z',
    travelerType: 'Solo',
    budgetLevel: '₹',
    daysSpent: 2,
    helpfulCount: 63,
    tips: [
      'Exit through Phase 3 to walk straight to Sukhna Lake promenade',
      'Not wheelchair accessible due to narrow step tunnels and uneven flagstones',
      'Carry cash for the ticket counter; UPI QR scanner network drops inside the gorge'
    ],
    comments: [
      {
        id: 'c-7',
        author: 'Anita Joshi',
        text: 'The cash tip for UPI failure is critical! Saw people waiting 20 minutes for a cellular signal.',
        createdAt: '2026-01-23T12:15:00Z'
      }
    ]
  },
  {
    id: 'post-11',
    city: 'Shimla',
    placeName: 'The Oberoi Cecil Heritage Verandah',
    category: 'Stay',
    rating: 4.9,
    title: 'Chaura Maidan heritage stay away from the noise of the Ridge',
    review: 'Most hotels on the main Mall Road suffer from loud tour groups and strict luggage porter logistics because vehicles are barred on Mall Road. The Cecil is located in Chaura Maidan, which allows taxi access straight to the porch. Heated wooden floors in winter, roaring wood fireplaces in the lounge, and original 1884 architectural joinery. Afternoon tea on the verandah costs ₹2,200 for non-residents and gives you the exact colonial mountain experience without staying overnight.',
    author: {
      id: 'auth-11',
      name: 'Rohan Talwar',
      badge: 'Verified Visitor',
      avatar: ''
    },
    monthVisited: '2024-12',
    createdAt: '2025-01-05T16:00:00Z',
    travelerType: 'Couple',
    budgetLevel: '₹₹₹',
    daysSpent: 3,
    helpfulCount: 29,
    tips: [
      'Request valley-facing rooms on floors 3 or 4 for unobstructed cedar pine views',
      'The hotel runs a private complimentary shuttle to the Mall Road lift every hour'
    ],
    comments: []
  },
  {
    id: 'post-12',
    city: 'Jaipur',
    placeName: 'Jantar Mantar Stone Observatory',
    category: 'Culture',
    rating: 4.7,
    title: 'Do not walk through without an audio guide; the sundials need decoding',
    review: 'If you walk through Jantar Mantar without context, it looks like an abstract concrete playground. With the official ₹200 audio guide or a licensed ASI guide (₹350), you realize Sawai Jai Singh II built calculating instruments accurate to within 2 seconds of local solar time. The Vrihat Samrat Yantra is 27 meters tall. Ticket is ₹200 (or included in the ₹300 composite pass). Go between 11:30 and 12:30 when the shadow crosses the noon meridian marker on the marble scale.',
    author: {
      id: 'auth-12',
      name: 'Dr. Alok Verma',
      badge: 'Traveler',
      avatar: ''
    },
    monthVisited: '2025-08',
    createdAt: '2025-08-30T14:15:00Z',
    travelerType: 'Solo',
    budgetLevel: '₹',
    daysSpent: 4,
    helpfulCount: 45,
    tips: [
      'Visit at solar noon (around 12:15 PM) to see the instruments in active calculation',
      'Combine with City Palace directly across the courtyard to save transit time'
    ],
    comments: []
  },
  {
    id: 'post-13',
    city: 'Tokyo',
    placeName: 'Tsukiji Outer Market Morning Seafood',
    category: 'Food',
    rating: 4.2,
    title: 'Wholesale market moved to Toyosu, but Tsukiji outer street food is thriving',
    review: 'Many people get confused and think Tsukiji is closed. Only the wholesale tuna auction moved to Toyosu in 2018. The Tsukiji Outer Market remains packed with over 300 street stalls. We paid 150 JPY (₹85) for hot tamagoyaki egg skewers at Yamacho, 1,200 JPY (₹660) for seared fatty tuna nigiri, and 800 JPY for a Hokkaido melon cup. Arrive around 08:30 AM; stalls begin packing up by 13:30. Note that eating while walking is frowned upon in Japan; eat beside the stall bench.',
    author: {
      id: 'auth-13',
      name: 'Maya & Kabir',
      badge: 'Verified Visitor',
      avatar: ''
    },
    monthVisited: '2025-10',
    createdAt: '2025-10-29T10:45:00Z',
    travelerType: 'Friends',
    budgetLevel: '₹₹',
    daysSpent: 5,
    helpfulCount: 38,
    tips: [
      'Take trash back to the stall where you bought food; public trash bins are rare',
      'Most stalls are cash-only; bring small denomination yen notes'
    ],
    comments: []
  },
  {
    id: 'post-14',
    city: 'Dubai',
    placeName: 'Dubai Marina Walk & Tram Network',
    category: 'Safety',
    rating: 4.8,
    title: 'Extremely safe for solo female travelers at midnight; use Dubai Tram',
    review: 'As a solo traveler, safety is my primary filter. Dubai Marina at 23:30 is well-lit, active with families pushing strollers, and monitored by polite community patrol officers. The Dubai Tram loops the entire Marina and connects seamlessly with the Red Metro at DMCC and Sobha Realty stations using the silver Nol transit card (minimum ₹170 / 7.5 AED per journey). Clean, air-conditioned passenger cabins with dedicated women and children sections.',
    author: {
      id: 'auth-14',
      name: 'Zara Fernandes',
      badge: 'Traveler',
      avatar: ''
    },
    monthVisited: '2026-01',
    createdAt: '2026-01-18T22:15:00Z',
    travelerType: 'Solo',
    budgetLevel: '₹₹',
    daysSpent: 4,
    helpfulCount: 76,
    tips: [
      'Always tap in AND tap out at tram platform card readers to avoid a 20 AED fine',
      'Silver Nol cards can be topped up through the nol Pay NFC app on your phone'
    ],
    comments: []
  },
  {
    id: 'post-15',
    city: 'Chandigarh',
    placeName: 'Sector 17 Plaza & Indian Coffee House',
    category: 'Budget tips',
    rating: 4.4,
    title: 'The ₹180 retro lunch in Corbusier’s concrete pedestrian plaza',
    review: 'Sector 17 was designed as the civic heart of the city, completely closed to motor vehicles. While modern malls like Elante have drawn brand shoppers away, Sector 17 remains the best place for an unhurried afternoon. The Indian Coffee House on Bank Square has been run by the workers’ cooperative since the 1960s. Waiters wear traditional starched turbans. Two hot masala dosas, butter toast, and two special hot coffees came to exactly ₹210 total. Cash or UPI accepted.',
    author: {
      id: 'auth-15',
      name: 'Paramjit Bains',
      badge: 'Local Guide',
      isGuide: true,
      avatar: '/images/guide-portrait.jpg'
    },
    monthVisited: '2026-02',
    createdAt: '2026-02-28T14:10:00Z',
    travelerType: 'Friends',
    budgetLevel: '₹',
    daysSpent: 2,
    helpfulCount: 41,
    tips: [
      'Order the mutton cutlet or cold coffee with ice cream',
      'Musical fountain in the center of Sector 17 runs shows at 19:00 on weekends'
    ],
    comments: [
      {
        id: 'c-8',
        author: 'Kunal G.',
        text: 'The cold coffee here is pure nostalgia. Better than overpriced modern cafes.',
        createdAt: '2026-03-02T16:20:00Z'
      }
    ]
  },
  {
    id: 'post-16',
    city: 'Shimla',
    placeName: 'Indian Institute of Advanced Study (Viceregal Lodge)',
    category: 'Culture',
    rating: 4.7,
    title: 'The architectural centerpiece of British India; take the interior heritage tour',
    review: 'Situated 3 km west of the Ridge on Observatory Hill. The Scottish baronial castle made of grey sandstone and Burmese teak is where the partition of India was negotiated. Exterior garden entry is ₹50; the guided interior tour of the council chambers and library is ₹200 for Indians / ₹500 for foreigners. Tours depart every 30 minutes. The grounds feature walnut trees, ancient deodars, and a solar cafe.',
    author: {
      id: 'auth-16',
      name: 'Sunil Negi',
      badge: 'Local Guide',
      isGuide: true,
      avatar: ''
    },
    monthVisited: '2025-06',
    createdAt: '2025-06-18T11:00:00Z',
    travelerType: 'Solo',
    budgetLevel: '₹',
    daysSpent: 3,
    helpfulCount: 35,
    tips: [
      'Photography inside the heritage library and ballroom is strictly prohibited',
      'Take local bus #4 from Old Bus Stand directly to the gate for ₹15 instead of a ₹300 cab'
    ],
    comments: []
  },
  {
    id: 'post-17',
    city: 'Jaipur',
    placeName: 'Nahargarh Fort Sunset Point',
    category: 'Hidden spots',
    rating: 4.3,
    title: 'Watch the Pink City light up at dusk from the Padao open terrace',
    review: 'Perched on the Aravalli hills overlooking the entire geometric grid of Jaipur. Padao restaurant at the fort edge charges an entry fee of ₹200 which includes one complimentary bottled beverage. The view at 18:30 when city streetlamps flicker on is magnificent. Warning on transport: taxis charge a flat ₹1,200 waiting fee from the city because returning cabs are impossible to flag down after dark. Negotiate return round-trip with your driver before heading up.',
    author: {
      id: 'auth-17',
      name: 'Kavita Rathore',
      badge: 'Traveler',
      avatar: ''
    },
    monthVisited: '2024-11',
    createdAt: '2024-11-20T19:30:00Z',
    travelerType: 'Friends',
    budgetLevel: '₹₹',
    daysSpent: 4,
    helpfulCount: 53,
    tips: [
      'Negotiate round-trip taxi with fixed waiting time before starting from MI Road',
      'Wind chill increases significantly after 18:00; carry a light jacket'
    ],
    comments: []
  },
  {
    id: 'post-18',
    city: 'Tokyo',
    placeName: 'Akihabara Retro Gaming & Mandarake Complex',
    category: 'Shopping',
    rating: 3.9,
    title: 'Fun for hobbyists, but check voltage ratings before buying electronics',
    review: 'Mandarake Complex in Sotokanda is an 8-story tower dedicated to vintage toys, manga, and retro video game cartridges. Super Potato on the 3rd floor lets you play old Famicom games on CRT monitors. However: Japan runs on 100V 50/60Hz electricity. If you buy vintage consoles or kitchen appliances, you will need a step-down transformer in India (230V) or you will fry the power board instantly. Passport tax-free exemption (10%) applies at checkout for purchases over 5,500 JPY.',
    author: {
      id: 'auth-18',
      name: 'Rishi Bansal',
      badge: 'Traveler',
      avatar: ''
    },
    monthVisited: '2025-05',
    createdAt: '2025-05-12T15:20:00Z',
    travelerType: 'Solo',
    budgetLevel: '₹₹',
    daysSpent: 5,
    helpfulCount: 44,
    tips: [
      'Always carry your physical passport for instant 10% tax-free deduction',
      'Look for the yellow tax-free counter signs on higher floors'
    ],
    comments: []
  },
  {
    id: 'post-19',
    city: 'Chandigarh',
    placeName: 'Sukhna Lake Morning Walking Track',
    category: 'Safety',
    rating: 4.9,
    title: 'A 3km silence zone in the morning; no honking or hawkers allowed',
    review: 'Sukhna Lake is an artificial reservoir created in 1958 by damming the seasonal Sukhna Choe stream. The 3 km walking promenade is strictly managed by Chandigarh Administration: no cycling on the pedestrian track, no loud amplified music, and zero street vendor harassment along the water. Sunrise around 06:15 offers clear reflections of the Shivalik foothills. Solar boat rentals open at 09:00 for ₹200 (2-seater) and ₹400 (4-seater). Cleanest public promenade in North India.',
    author: {
      id: 'auth-19',
      name: 'Gursimran Dhillon',
      badge: 'Local Guide',
      isGuide: true,
      avatar: '/images/guide-portrait.jpg'
    },
    monthVisited: '2026-03',
    createdAt: '2026-03-10T07:30:00Z',
    travelerType: 'Couple',
    budgetLevel: '₹',
    daysSpent: 2,
    helpfulCount: 50,
    tips: [
      'Morning walkers start at 05:30; parking in the main lot fills up by 06:45',
      'The Garden of Silence at the far end of the lake is the calmest spot for meditation'
    ],
    comments: []
  },
  {
    id: 'post-20',
    city: 'Dubai',
    placeName: 'Dubai Mall & Burj Khalifa Lake Promenade',
    category: 'Budget tips',
    rating: 4.0,
    title: 'Free Dubai Fountain shows every 30 minutes; do not pay for boardwalk tickets',
    review: 'Third-party booking sites will try to sell you a ₹1,800 "boardwalk bridge ticket" to watch the Dubai Fountain. The promenade directly outside Dubai Mall Apple Store balcony or the Souk Al Bahar bridge offers the exact same view completely for free. Shows start at 18:00 and run every 30 minutes until 23:00. If you want a seated view without crowds, book a table on the patio of Abd El Wahab Lebanese restaurant in Souk Al Bahar.',
    author: {
      id: 'auth-20',
      name: 'Tariq Al-Mansoor',
      badge: 'Local Guide',
      isGuide: true,
      avatar: ''
    },
    monthVisited: '2025-11',
    createdAt: '2025-11-15T20:10:00Z',
    travelerType: 'Family',
    budgetLevel: '₹₹',
    daysSpent: 5,
    helpfulCount: 61,
    tips: [
      'Watch from Souk Al Bahar bridge for less crowded perspectives',
      'Fountain song changes every 30 minutes; the evening shows are much better than the two daytime shows'
    ],
    comments: [
      {
        id: 'c-9',
        author: 'Priya N.',
        text: 'The Apple Store balcony recommendation was gold! Elevated view and shaded.',
        createdAt: '2025-11-18T18:40:00Z'
      }
    ]
  }
];

export const CATEGORIES = [
  'Food',
  'Stay',
  'Transport',
  'Safety',
  'Budget tips',
  'Hidden spots',
  'Scams to avoid'
];

export const TRAVELER_TYPES = ['Solo', 'Couple', 'Family', 'Friends'];
export const BUDGET_LEVELS = ['₹', '₹₹', '₹₹₹'];
