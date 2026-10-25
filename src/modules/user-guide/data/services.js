import defaultServices from "./services.json";
import { loadGuideServices } from "./sharedDataBridge";

export const shimlaServices = [
  ...defaultServices,
  // 1. Cooking Classes (2 services)
  {
    id: "cook-1",
    cityId: "shimla",
    title: "Authentic Himachali Dham Feast Workshop in Mashobra Orchard",
    category: "Cooking Classes",
    categoryId: "cooking",
    providerId: "p1",
    price: 1850,
    priceUnit: "per person",
    duration: "4 hours",
    durationCategory: "half_day",
    groupSize: "Max 8 guests",
    maxGuests: 8,
    languages: ["Hindi", "English", "Pahari"],
    difficulty: "Easy",
    rating: 4.97,
    reviewCount: 42,
    freeCancellation: true,
    instantConfirmation: true,
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80"
    ],
    highlights: [
      "Master slow-simmered Madra, Mahni, and Khatta in traditional brass degchis",
      "Cook in an open-air cedar orchard kitchen with Himalayan valley views",
      "Includes a 7-course sit-down traditional leaf-plate banquet"
    ],
    description: "Step into an ancestral orchard in Mashobra to cook Himachal's sacred wedding feast: the Dham. Guided by Chef Sunil, you'll learn the secret ratio of whole spices, yogurt temperings, and the art of cooking without onion or garlic while yielding complex, aromatic flavors.",
    includes: [
      "All organic farm ingredients & heritage spices",
      "Individual cooking station and aprons",
      "Full 7-course sit-down Dham feast with dessert",
      "Printed recipe booklet to take home"
    ],
    excludes: ["Pick-up and drop-off to Mashobra", "Alcoholic beverages"],
    itinerary: [
      { time: "10:30 AM", title: "Welcome & Orchard Herb Walk", desc: "Gather at the stone cottage, sip mountain chai, and pick fresh herbs." },
      { time: "11:15 AM", title: "Spice Blending & Degchi Technique", desc: "Learn slow yogurt curdling, hing roasting, and mustard oil smoke points." },
      { time: "01:00 PM", title: "The Dham Banquet", desc: "Sit cross-legged on woollen mats and enjoy your dishes served on traditional leaf plates." }
    ],
    meetingPoint: "Mashobra Apple Valley Farm gate, 12km from The Mall, Shimla",
    cancellationPolicy: "Free cancellation up to 24 hours before the experience starts.",
    faqs: [
      { q: "Is the food strictly vegetarian?", a: "Yes, traditional Himachali Dham is 100% vegetarian and cooked without onion or garlic." }
    ],
    availableTimeSlots: ["10:30 AM", "03:30 PM"]
  },
  {
    id: "cook-2",
    cityId: "shimla",
    title: "Steamed Mountain Siddu & Stuffed Babru Hands-On Masterclass",
    category: "Cooking Classes",
    categoryId: "cooking",
    providerId: "p3",
    price: 1350,
    priceUnit: "per person",
    duration: "3 hours",
    durationCategory: "half_day",
    groupSize: "Max 6 guests",
    maxGuests: 6,
    languages: ["Hindi", "English"],
    difficulty: "Easy",
    rating: 4.94,
    reviewCount: 31,
    freeCancellation: true,
    instantConfirmation: true,
    coverImage: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80"
    ],
    highlights: [
      "Shape and roll wild-yeast fermented dough for mountain Siddu",
      "Grind roasted poppy seeds, walnuts, and chilies into spicy fillings",
      "Enjoy steaming hot buns with golden Pahari cow ghee and wild honey"
    ],
    description: "Siddu is the ultimate mountain comfort food. Geeta welcomes you into her kitchen to teach the fermentation magic, intricate folding folds, and bamboo steam baths that make fluffy, savoury Siddus and deep-fried Babru breads.",
    includes: ["Cooking lesson & ingredients", "Unlimited hot Siddus with pure ghee", "Wild mountain honey & mint relish"],
    excludes: ["Personal transport"],
    itinerary: [
      { time: "02:00 PM", title: "Dough & Filling Preparation", desc: "Knead fermented wheat dough and hand-pound walnut poppy seed masala." },
      { time: "03:15 PM", title: "Steaming & Frying", desc: "Steam Siddus to golden fluffiness and fry crispy black gram babrus." }
    ],
    meetingPoint: "Heritage Homestay Kitchen, Near Sanjauli Helipad, Shimla",
    cancellationPolicy: "Free cancellation up to 24 hours in advance.",
    faqs: [{ q: "Are vegan options available?", a: "Yes, we can substitute pure ghee with cold-pressed walnut oil." }],
    availableTimeSlots: ["11:00 AM", "03:00 PM"]
  },

  // 2. Heritage Guides (2 services)
  {
    id: "heri-1",
    cityId: "shimla",
    title: "Shimla Heritage Walk: The Ridge, Christ Church & Gaiety Theatre",
    category: "Heritage Guides",
    categoryId: "heritage",
    providerId: "p2",
    price: 850,
    priceUnit: "per person",
    duration: "2.5 hours",
    durationCategory: "half_day",
    groupSize: "Max 12 guests",
    maxGuests: 12,
    languages: ["English", "Hindi"],
    difficulty: "Easy",
    rating: 4.99,
    reviewCount: 96,
    freeCancellation: true,
    instantConfirmation: true,
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80"
    ],
    highlights: [
      "Explore the 1857 neo-Gothic Christ Church with stained-glass window stories",
      "Step inside the Victorian Gothic Gaiety Theatre where Rudyard Kipling performed",
      "Led by acclaimed historian Dr. Arvind Thakur"
    ],
    description: "The classic introduction to Simla's colonial soul. Walk past wooden bandstands, half-timbered Tudor bungalows, and the bustling scandal point while hearing anecdotes of Viceroys, spies, and poets who shaped the British Raj's summer capital.",
    includes: ["Historian guide fees", "Gaiety Theatre entry pass", "Historic postcard set", "Filter coffee/tea stop"],
    excludes: ["Personal purchases"],
    itinerary: [
      { time: "09:30 AM", title: "The Ridge & Christ Church", desc: "Meet under the church tower for an introduction to Shimla's water reservoir history." },
      { time: "10:30 AM", title: "Gaiety Theatre Interior", desc: "Private access into the century-old wooden auditorium." }
    ],
    meetingPoint: "Front steps of Christ Church, The Ridge, Shimla",
    cancellationPolicy: "Free cancellation up to 12 hours before start.",
    faqs: [{ q: "Is the walk wheelchair accessible?", a: "The Ridge and Mall Road are pedestrianized with gentle slopes." }],
    availableTimeSlots: ["09:30 AM", "03:30 PM"]
  },
  {
    id: "heri-2",
    cityId: "shimla",
    title: "Viceregal Lodge & Himachal State Museum In-Depth Architectural Tour",
    category: "Heritage Guides",
    categoryId: "heritage",
    providerId: "p2",
    price: 1200,
    priceUnit: "per person",
    duration: "3.5 hours",
    durationCategory: "half_day",
    groupSize: "Max 10 guests",
    maxGuests: 10,
    languages: ["English", "Hindi"],
    difficulty: "Easy",
    rating: 4.95,
    reviewCount: 48,
    freeCancellation: true,
    instantConfirmation: true,
    coverImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
    ],
    highlights: [
      "Marvel at the Scottish baronial stonework and indoor teak wood craftsmanship",
      "Stand in the room where the historic Simla Conference was debated",
      "Stroll the manicured botanical lawns on Observatory Hill"
    ],
    description: "Perched atop Observatory Hill, the Viceregal Lodge (now IIAS) is the grandest colonial monument in the Himalayas. Discover its early electric wiring, hidden servant stairs, and priceless museum artifacts.",
    includes: ["Entry passes to Lodge & State Museum", "Curated historical narrative", "Herbal tea in lawn cafe"],
    excludes: ["Local shuttle to Observatory Hill"],
    itinerary: [
      { time: "10:00 AM", title: "Lodge Grounds & Exterior", desc: "Understanding the baronial stone masonry." },
      { time: "11:15 AM", title: "Conference Rooms & Library", desc: "Walking through teak rooms lined with rare manuscripts." }
    ],
    meetingPoint: "Main Gate, Indian Institute of Advanced Study, Shimla",
    cancellationPolicy: "Free cancellation up to 24 hours.",
    faqs: [{ q: "Are cameras allowed inside?", a: "Cameras are allowed in the gardens and designated galleries." }],
    availableTimeSlots: ["10:00 AM", "02:00 PM"]
  },

  // 3. Safari (2 services)
  {
    id: "safari-1",
    cityId: "shimla",
    title: "Kufri & Himalayan Nature Park 4x4 Wildlife & Yak Trail Safari",
    category: "Safari",
    categoryId: "safari",
    providerId: "p10",
    price: 3200,
    priceUnit: "per group (up to 4)",
    duration: "5 hours",
    durationCategory: "half_day",
    groupSize: "Max 4 guests per jeep",
    maxGuests: 4,
    languages: ["Hindi", "English"],
    difficulty: "Easy",
    rating: 4.91,
    reviewCount: 46,
    freeCancellation: true,
    instantConfirmation: true,
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80"
    ],
    highlights: [
      "Open-top 4WD climb to 2,720m high alpine ridges",
      "Spot Monal pheasants, barking deer, and Himalayan brown bears",
      "Spectacular 180° views of snowbound Himalayan peaks"
    ],
    description: "Traverse high deodar valleys from Shimla into Kufri in a sturdy 4x4. Explore the Himalayan Nature Park with a trained local wildlife naturalist who helps you identify endangered mountain birds and flora.",
    includes: ["Private 4x4 Thar/Gypsy vehicle with fuel", "Nature Park entry passes", "Binoculars for bird observation", "Hot thermos chai & hill biscuits"],
    excludes: ["Pony rides in Kufri", "Personal meals"],
    itinerary: [
      { time: "08:00 AM", title: "Shimla Hotel Pickup", desc: "Climb through Sanjauli and Dhalli winding mountain bypass." },
      { time: "09:30 AM", title: "Himalayan Nature Park Trails", desc: "Guided fauna walk spotting Monal and musk deer." }
    ],
    meetingPoint: "Shimla hotel pickup or Lift Car Parking on Cart Road",
    cancellationPolicy: "Free cancellation up to 24 hours.",
    faqs: [{ q: "Is the vehicle private?", a: "Yes, the rate covers your private vehicle for up to 4 passengers." }],
    availableTimeSlots: ["08:00 AM", "01:00 PM"]
  },
  {
    id: "safari-2",
    cityId: "shimla",
    title: "Chail Wildlife Sanctuary Deep Forest Jeep Safari & Palace Visit",
    category: "Safari",
    categoryId: "safari",
    providerId: "p10",
    price: 4200,
    priceUnit: "per jeep (up to 5)",
    duration: "7 hours",
    durationCategory: "full_day",
    groupSize: "Max 5 guests",
    maxGuests: 5,
    languages: ["Hindi", "English", "Punjabi"],
    difficulty: "Easy",
    rating: 4.88,
    reviewCount: 39,
    freeCancellation: true,
    instantConfirmation: false,
    coverImage: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"
    ],
    highlights: [
      "Drive along secluded oak and chir pine forest jeep tracks",
      "Lookout for sambhar, goral goat-antelope, and cheer pheasants",
      "Visit the World's highest cricket ground and Chail palace"
    ],
    description: "Escape the tourist hubs and venture south into the pristine sanctuary of Chail. A serene safari combining virgin mountain wilderness with royal Patiala history.",
    includes: ["Full-day private 4x4 with driver", "Forest permits", "Chail Palace garden access", "Picnic lunch pack"],
    excludes: ["Inside palace museum tickets"],
    itinerary: [
      { time: "09:00 AM", title: "Scenic drive via Kandaghat", desc: "Valley route winding past terrace cabbage and garlic farms." },
      { time: "11:00 AM", title: "Forest Sanctuary Jeep Track", desc: "Slow speed wildlife search with binoculars." }
    ],
    meetingPoint: "Shimla Mall Road Lift or Victory Tunnel",
    cancellationPolicy: "Free cancellation up to 48 hours.",
    faqs: [{ q: "What should we wear?", a: "Earth tones (greens, browns) are recommended for forest animal sightings." }],
    availableTimeSlots: ["09:00 AM"]
  },

  // 4. Cultural Guides (2 services)
  {
    id: "cult-1",
    cityId: "shimla",
    title: "Pahari Village Immersion: Kath-Kuni Houses & Mountain Life",
    category: "Cultural Guides",
    categoryId: "cultural",
    providerId: "p5",
    price: 1100,
    priceUnit: "per person",
    duration: "4 hours",
    durationCategory: "half_day",
    groupSize: "Max 8 guests",
    maxGuests: 8,
    languages: ["English", "Hindi", "Pahari"],
    difficulty: "Easy",
    rating: 4.96,
    reviewCount: 45,
    freeCancellation: true,
    instantConfirmation: true,
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80"
    ],
    highlights: [
      "Walk through a quiet, 200-year-old preserved village near Mashobra",
      "Learn how Kath-Kuni stone-and-cedar joints survive seismic tremors",
      "Spin wool on a traditional Takli and try hand-pounding spices"
    ],
    description: "Step away from modern traffic into a timeless Pahari village. Pooja Negi takes you inside local families' carved wooden courtyards, explaining spiritual village deities, seasonal harvest songs, and mountain self-sufficiency.",
    includes: ["Village cultural walk fee", "Mud-chulha tea & roasted corn/walnuts", "Donation to village preservation fund"],
    excludes: ["Transport to trail start"],
    itinerary: [
      { time: "09:30 AM", title: "Village Walk & Deity Temple", desc: "Visiting the local Nag Devta wood-carved shrine." },
      { time: "11:00 AM", title: "Homestead Courtyard Session", desc: "Wool spinning demonstration and storytelling." }
    ],
    meetingPoint: "Mashobra Post Office",
    cancellationPolicy: "Free cancellation up to 24 hours.",
    faqs: [{ q: "Is photography allowed in the village?", a: "Yes, our guide will advise where photography is respectful." }],
    availableTimeSlots: ["09:30 AM", "02:30 PM"]
  },
  {
    id: "cult-2",
    cityId: "shimla",
    title: "Tibetan Monastery, Buddhist Thangka Art & Peace Circuit",
    category: "Cultural Guides",
    categoryId: "cultural",
    providerId: "p5",
    price: 900,
    priceUnit: "per person",
    duration: "3 hours",
    durationCategory: "half_day",
    groupSize: "Max 10 guests",
    maxGuests: 10,
    languages: ["English", "Hindi"],
    difficulty: "Easy",
    rating: 4.93,
    reviewCount: 38,
    freeCancellation: true,
    instantConfirmation: true,
    coverImage: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80"
    ],
    highlights: [
      "Visit Jonang Takten Phuntsok Choeling Tibetan Monastery in Sanjauli",
      "Listen to rhythmic monk chanting and sacred brass horns at prayer time",
      "Understand the iconography of Wheel of Life thangkas with a Buddhist scholar"
    ],
    description: "Shimla has a quiet, dignified Tibetan Buddhist presence. Discover the monastic daily routine, butter-lamp offerings, and ancient wisdom preserved in these Himalayan foothills.",
    includes: ["Guided commentary", "Butter lamp offering", "Tibetan butter tea & sweet rice"],
    excludes: ["Personal taxi to Sanjauli"],
    itinerary: [
      { time: "09:00 AM", title: "Prayer Hall & Chanting", desc: "Witness the morning mantra recitation." },
      { time: "10:30 AM", title: "Thangka Painting Studio", desc: "Observe master artists using ground mineral pigments." }
    ],
    meetingPoint: "Sanjauli Bazaar Footbridge, Shimla",
    cancellationPolicy: "Free cancellation up to 24 hours.",
    faqs: [{ q: "What is the dress code?", a: "Please wear clothing covering shoulders and knees out of respect." }],
    availableTimeSlots: ["09:00 AM", "02:00 PM"]
  },

  // 5. Trekking & Hiking (2 services)
  {
    id: "trek-1",
    cityId: "shimla",
    title: "Shali Tibba Sunrise Ridge Trek: Highest Peak in Shimla Hills",
    category: "Trekking & Hiking",
    categoryId: "trekking",
    providerId: "p4",
    price: 1950,
    priceUnit: "per person",
    duration: "7 hours",
    durationCategory: "full_day",
    groupSize: "Max 8 guests",
    maxGuests: 8,
    languages: ["English", "Hindi"],
    difficulty: "Moderate",
    rating: 4.98,
    reviewCount: 68,
    freeCancellation: true,
    instantConfirmation: true,
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"
    ],
    highlights: [
      "Reach the isolated summit of Shali Tibba at 2,872 meters",
      "360-degree panorama of the Greater Himalayas from Kinnaur to Garhwal",
      "Visit the stone-carved Bhima Kali temple crowning the summit"
    ],
    description: "The crown jewel of Shimla day hikes. Shali Tibba towers alone above the Sutlej valley. A switchback trail climbs steadily through thick forest before opening out into an awe-inspiring summit ridge with snowcapped giants on the horizon.",
    includes: ["Certified mountain guide", "Shimla-trailhead return transport", "Trekking poles & first-aid kit", "Summit picnic brunch with hot soup"],
    excludes: ["Personal trekking boots"],
    itinerary: [
      { time: "05:30 AM", title: "Early Departure from Shimla", desc: "Drive to Khatnol village base via Mashobra." },
      { time: "07:30 AM", title: "Ascent through Pine Forests", desc: "Steady 5km uphill climb with hydration stops." },
      { time: "10:30 AM", title: "Summit View & Temple Visit", desc: "Breathtaking 360-degree view and hot brunch." }
    ],
    meetingPoint: "Shimla Mall Road Lift or Sanjauli Petrol Pump",
    cancellationPolicy: "Free cancellation up to 48 hours.",
    faqs: [{ q: "What fitness level is required?", a: "Moderate fitness required; the trail is 10km return with ~700m elevation gain." }],
    availableTimeSlots: ["05:30 AM"]
  },
  {
    id: "trek-2",
    cityId: "shimla",
    title: "Tara Devi Forest Sanctuary & Ridge Peak Day Hike",
    category: "Trekking & Hiking",
    categoryId: "trekking",
    providerId: "p4",
    price: 850,
    priceUnit: "per person",
    duration: "4 hours",
    durationCategory: "half_day",
    groupSize: "Max 12 guests",
    maxGuests: 12,
    languages: ["Hindi", "English"],
    difficulty: "Easy",
    rating: 4.92,
    reviewCount: 54,
    freeCancellation: true,
    instantConfirmation: true,
    coverImage: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80"
    ],
    highlights: [
      "Walk beneath centuries-old deodars and sweet-scented oak groves",
      "Ascend to the 250-year-old hilltop Tara Devi shrine",
      "Gaze down at the toy train zig-zagging in the valley below"
    ],
    description: "An ideal half-day forest hike suitable for beginners and families. The trail starts near Tara Devi station and meanders up through peaceful oak forests free from road sounds.",
    includes: ["Nature guide fee", "Snack bar and mountain spring water", "Temple parshad offering"],
    excludes: ["Toy train or taxi fare to base"],
    itinerary: [
      { time: "08:30 AM", title: "Trailhead Meet at Shoghi", desc: "Forest safety briefing and walking technique." },
      { time: "11:00 AM", title: "Tara Devi Temple Summit", desc: "Enjoy panoramic views of Shimla amphitheater." }
    ],
    meetingPoint: "Tara Devi Railway Crossing, Kalka-Shimla Highway",
    cancellationPolicy: "Free cancellation up to 24 hours.",
    faqs: [{ q: "Are running shoes fine?", a: "Yes, well-treaded trainers or sports shoes work well." }],
    availableTimeSlots: ["08:30 AM", "02:00 PM"]
  },

  // 6. Food & Culture (2 services)
  {
    id: "food-1",
    cityId: "shimla",
    title: "Mall Road & Lower Bazaar Heritage Street-Food Crawl",
    category: "Food & Culture",
    categoryId: "food",
    providerId: "p6",
    price: 950,
    priceUnit: "per person",
    duration: "2.5 hours",
    durationCategory: "half_day",
    groupSize: "Max 10 guests",
    maxGuests: 10,
    languages: ["Hindi", "English", "Punjabi"],
    difficulty: "Easy",
    rating: 4.97,
    reviewCount: 84,
    freeCancellation: true,
    instantConfirmation: true,
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
    ],
    highlights: [
      "Taste 8 curated street specialties across historic alleys",
      "Try crispy Kurkuri Bhindi, spiced Chana Tikki, and hot Gulab Jamuns",
      "Sip the famous 1930s-style steamed espresso at the Indian Coffee House"
    ],
    description: "Join Vikramjit on an insider's gourmet trail through the bustling labyrinth of Lower Bazaar and Middle Bazaar. Taste your way through generations-old snack shacks that locals fiercely guard.",
    includes: ["8 generous food and beverage tastings", "Bottled water", "Guide commentary"],
    excludes: ["Take-home boxed sweets"],
    itinerary: [
      { time: "04:30 PM", title: "Scandal Point & Sitaram Chhole Bhature", desc: "Legendary fluffy bhaturas with tangy tamarind chutney." },
      { time: "05:30 PM", title: "Lower Bazaar Halwai Lane", desc: "Warm mountain jalebis and spiced milk." }
    ],
    meetingPoint: "Scandal Point Horse Statues, The Mall, Shimla",
    cancellationPolicy: "Free cancellation up to 24 hours.",
    faqs: [{ q: "Is the food hygienic?", a: "Yes, we exclusively patronize vendors with strict filtered water and clean preparation standards." }],
    availableTimeSlots: ["04:30 PM"]
  },
  {
    id: "food-2",
    cityId: "shimla",
    title: "Chadwick Falls Forest Walk with Local Meadow Picnic",
    category: "Food & Culture",
    categoryId: "food",
    providerId: "p7",
    price: 1250,
    priceUnit: "per person",
    duration: "3.5 hours",
    durationCategory: "half_day",
    groupSize: "Max 8 guests",
    maxGuests: 8,
    languages: ["English", "Hindi"],
    difficulty: "Easy",
    rating: 4.91,
    reviewCount: 39,
    freeCancellation: true,
    instantConfirmation: true,
    coverImage: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80"
    ],
    highlights: [
      "Walk beneath ancient Himalayan pines to Shimla's dramatic 86m waterfall",
      "Spread out checkered blankets for a farm-fresh picnic lunch",
      "Taste local mountain cheeses, sourdough bread, and walnut chutneys"
    ],
    description: "Tucked inside the Glen forest, Chadwick Falls tumbles down steep gorge rocks. Enjoy a tranquil pine-scented walk followed by an artisanal hillside picnic featuring organic local produce.",
    includes: ["Nature guide", "Gourmet meadow picnic lunch with cider", "Rambling sticks"],
    excludes: ["Pick-up from Summer Hill"],
    itinerary: [
      { time: "10:30 AM", title: "Glen Forest Canopy Trail", desc: "Descending through shaded mossy pine trails." },
      { time: "12:00 PM", title: "Waterfall View & Meadow Picnic", desc: "Artisanal mountain cheese tasting and fresh bread lunch." }
    ],
    meetingPoint: "Summer Hill Post Office, Shimla",
    cancellationPolicy: "Free cancellation 24h prior.",
    faqs: [{ q: "When does the waterfall flow strongest?", a: "Monsoon and autumn, but the forest is lush year-round." }],
    availableTimeSlots: ["10:30 AM"]
  },

  // 7. Vehicle Rentals (2 services)
  {
    id: "rent-1",
    cityId: "shimla",
    title: "Royal Enfield Himalayan 411cc Mountain Touring Motorcycle",
    category: "Vehicle Rentals",
    categoryId: "rentals",
    providerId: "p11",
    price: 1600,
    priceUnit: "per day",
    duration: "24 Hours / Full Day",
    durationCategory: "full_day",
    groupSize: "Up to 2 riders",
    maxGuests: 2,
    languages: ["Hindi", "English", "Punjabi"],
    difficulty: "Moderate",
    rating: 4.88,
    reviewCount: 72,
    freeCancellation: true,
    instantConfirmation: true,
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80"
    ],
    highlights: [
      "Well-maintained Royal Enfield Himalayan with dual-channel ABS",
      "Equipped with crash guards, saddle stay, and phone mount with USB charger",
      "Two sanitized ISI-certified helmets included free of charge"
    ],
    description: "Conquer Himachal's steep hairpins and gravel tracks with the ultimate adventure motorcycle. Regularly tuned by certified mechanics with fresh engine oil and crisp brakes.",
    includes: ["24-hour bike rental", "Two helmets", "Basic tool kit", "RTO road permit for Himachal Pradesh"],
    excludes: ["Fuel", "Security deposit (₹3,000 refundable)"],
    itinerary: [
      { time: "Day Start", title: "Handover & Inspection", desc: "Document check, odometer recording, and handling test." }
    ],
    meetingPoint: "Victory Tunnel Rental Hub, Circular Road, Shimla",
    cancellationPolicy: "Free cancellation up to 24 hours before pickup.",
    faqs: [
      { q: "What documents are required?", a: "A valid original Indian motorcycle driving licence and government ID." }
    ],
    availableTimeSlots: ["09:00 AM Pickup", "11:00 AM Pickup"]
  },
  {
    id: "rent-2",
    cityId: "shimla",
    title: "Honda Activa 6G Automatic Mountain Scooter (Self-Drive)",
    category: "Vehicle Rentals",
    categoryId: "rentals",
    providerId: "p11",
    price: 800,
    priceUnit: "per day",
    duration: "24 Hours / Full Day",
    durationCategory: "full_day",
    groupSize: "Up to 2 riders",
    maxGuests: 2,
    languages: ["Hindi", "English"],
    difficulty: "Easy",
    rating: 4.82,
    reviewCount: 95,
    freeCancellation: true,
    instantConfirmation: true,
    coverImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80"
    ],
    highlights: [
      "Nimble, fuel-efficient automatic gearless scooter for easy hill parking",
      "Tackle city traffic between Shimla, Chhota Shimla, and Sanjauli",
      "One helmet included, spare helmet available on request"
    ],
    description: "The most convenient way to zip between Shimla’s suburbs, cafes, and viewpoint roads without worrying about narrow car parking spots.",
    includes: ["24-hour scooter rental", "Helmet", "Unlimited kilometers within 50km radius"],
    excludes: ["Fuel", "Refundable deposit ₹1,500"],
    itinerary: [{ time: "Anytime", title: "Keys Handover", desc: "Quick verification and start exploring." }],
    meetingPoint: "Shimla Railway Station Car Park or Victory Tunnel Hub",
    cancellationPolicy: "Free cancellation 24 hours prior.",
    faqs: [{ q: "Can we take it to Kufri?", a: "Yes, easily handles the gentle slope up to Kufri and Mashobra." }],
    availableTimeSlots: ["08:30 AM Pickup", "10:00 AM Pickup"]
  }
];

export const getAllAvailableServices = () => {
  const guideServices = loadGuideServices();
  const guideIds = new Set(guideServices.map((g) => String(g.id)));
  const otherServices = shimlaServices.filter((s) => !guideIds.has(String(s.id)));
  return [...guideServices, ...otherServices];
};

export const getServiceById = (id) => {
  const all = getAllAvailableServices();
  return (
    all.find(
      (s) =>
        String(s.id) === String(id) ||
        String(s.legacyId) === String(id) ||
        (s.title && id && s.title.toLowerCase().includes(String(id).toLowerCase()))
    ) || all[0]
  );
};

export const getServicesByCity = (cityId) => {
  return getAllAvailableServices();
};

export const getServicesByProvider = (providerId) => {
  const all = getAllAvailableServices();
  return all.filter((s) => s.providerId === providerId || (providerId === "guide-agam" && (s.providerId === "guide-agam" || s.guideId === "guide-agam")));
};

