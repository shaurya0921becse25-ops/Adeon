export const services = [
  { id: 1, title: "Himalayan Trek - 2 Days", category: "Trekking & Hiking", price: 4500, unit: "person", spots: 12, status: "Active", image: "/himalayan-trek.jpg" },
  { id: 2, title: "Local Cooking Class", category: "Food & Culture", price: 1200, unit: "person", spots: 8, status: "Active", image: "/cooking-class.jpg" },
  { id: 3, title: "Jeep Safari - 1 Day", category: "Adventure", price: 8000, unit: "group", spots: 6, status: "Active", image: "/jeep-safari.jpg" },
  { id: 4, title: "City Heritage Walk", category: "Culture & Heritage", price: 800, unit: "person", spots: 15, status: "Draft", image: "/heritage-walk.jpg" },
];

export const bookings = [
  { id: 1, service: "Himalayan Trek - 2 Days", traveler: "Sarah Johnson", email: "sarah.johnson@gmail.com", phone: "+91 98765 43210",
    travelers: 2, date: "Oct 16, 2026", time: "6:00 AM", amount: 9000, status: "Incoming",
    requests: "Vegetarian meals, early check-in if possible.", image: "/himalayan-trek.jpg" },
  { id: 2, service: "Cooking Class", traveler: "Michael Tan", email: "michael.tan@gmail.com", phone: "+91 91234 56780",
    travelers: 1, date: "Oct 20, 2026", time: "11:00 AM", amount: 1200, status: "Incoming",
    requests: "No allergies.", image: "/cooking-class.jpg" },
  { id: 3, service: "Jeep Safari - 1 Day", traveler: "Emma Davis", email: "emma.davis@gmail.com", phone: "+91 99887 76655",
    travelers: 4, date: "Oct 22, 2026", time: "7:30 AM", amount: 8000, status: "Incoming",
    requests: "Need a child seat for one traveler.", image: "/jeep-safari.jpg" },
  { id: 4, service: "City Heritage Walk", traveler: "Rahul Mehta", email: "rahul.m@gmail.com", phone: "+91 90000 11122",
    travelers: 3, date: "Oct 12, 2026", time: "9:00 AM", amount: 2400, status: "Confirmed", requests: "None.", image: "/heritage-walk.jpg" },
  { id: 5, service: "Himalayan Trek - 2 Days", traveler: "Lisa Carter", email: "lisa.c@gmail.com", phone: "+91 98123 45670",
    travelers: 2, date: "Sep 28, 2026", time: "6:00 AM", amount: 9000, status: "Completed", requests: "None.", image: "/himalayan-trek.jpg" },
  { id: 6, service: "Jeep Safari - 1 Day", traveler: "Daniel Kim", email: "daniel.k@gmail.com", phone: "+91 97000 22233",
    travelers: 2, date: "Sep 10, 2026", time: "7:30 AM", amount: 8000, status: "Cancelled", requests: "None.", image: "/jeep-safari.jpg" },
];

export const earnings = [
  { month: "Apr", value: 8000 }, { month: "May", value: 14000 }, { month: "Jun", value: 12000 },
  { month: "Jul", value: 22000 }, { month: "Aug", value: 28000 }, { month: "Sep", value: 35000 },
  { month: "Oct", value: 48320 },
];

export const payouts = [
  { id: 1, date: "Oct 15, 2026", amount: 12000, status: "Completed" },
  { id: 2, date: "Sep 12, 2026", amount: 9500, status: "Completed" },
  { id: 3, date: "Aug 10, 2026", amount: 8300, status: "Completed" },
  { id: 4, date: "Oct 30, 2026", amount: 6000, status: "Pending" },
];

export const reviews = [
  { id: 1, name: "Lisa Carter", date: "Oct 16, 2026", rating: 5,
    text: "Amazing experience! The guide was friendly, knowledgeable and made the trek unforgettable.",
    tags: ["Friendly Host", "Authentic Experience"] },
  { id: 2, name: "Daniel Kim", date: "Sep 28, 2026", rating: 4,
    text: "Great views and good arrangements. Started a bit late though.", tags: ["Good Value"] },
  { id: 3, name: "Priya Nair", date: "Sep 14, 2026", rating: 3,
    text: "Nice trip but the pickup point was confusing.", tags: [] },
  { id: 4, name: "Tom Becker", date: "Aug 30, 2026", rating: 5,
    text: "Best cooking class we have done. Highly recommended!", tags: ["Friendly Host"] },
];

export const ratingBreakdown = [
  { label: "Communication", value: 4.9 },
  { label: "Value for Money", value: 4.7 },
  { label: "Safety", value: 4.8 },
  { label: "Authenticity", value: 4.9 },
  { label: "Punctuality", value: 4.8 },
];