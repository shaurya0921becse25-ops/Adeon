export const categories = [
  {
    id: "cooking",
    name: "Cooking Classes",
    slug: "cooking-classes",
    iconName: "UtensilsCrossed",
    description: "Hands-on culinary workshops, traditional Dham feasts & wood-fired recipes",
    badge: "Food & Heritage"
  },
  {
    id: "heritage",
    name: "Heritage Guides",
    slug: "heritage-guides",
    iconName: "Landmark",
    description: "Colonial walking trails, architectural insights & historic secrets",
    badge: "Architecture"
  },
  {
    id: "safari",
    name: "Safari",
    slug: "safari",
    iconName: "Compass",
    description: "Wildlife sanctuary 4x4 trails, dense cedar jungle drives & viewpoints",
    badge: "Adventure"
  },
  {
    id: "cultural",
    name: "Cultural Guides",
    slug: "cultural-guides",
    iconName: "Sparkles",
    description: "Pahari village folklore, Kinnauri craft masterclasses & monastery tours",
    badge: "Local Living"
  },
  {
    id: "trekking",
    name: "Trekking & Hiking",
    slug: "trekking-hiking",
    iconName: "Mountain",
    description: "Pine forest summits, ridge scrambles & panoramic Himalayan lookouts",
    badge: "Outdoors"
  },
  {
    id: "food",
    name: "Food & Culture",
    slug: "food-culture",
    iconName: "Coffee",
    description: "Street food crawls, orchard picnics & authentic mountain chai strolls",
    badge: "Tasting"
  },
  {
    id: "rentals",
    name: "Vehicle Rentals",
    slug: "vehicle-rentals",
    iconName: "Car",
    description: "Royal Enfield motorcycles, mountain SUVs with drivers & family vans",
    badge: "Mobility"
  }
];

export const getCategoryById = (id) => categories.find((c) => c.id === id || c.name === id);
