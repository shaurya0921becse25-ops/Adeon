export const initialBookings = [
  {
    id: "HMR-882194",
    serviceId: "guide-trek-1",
    serviceTitle: "Himalayan Trek - 2 Days",
    providerId: "guide-agam",
    providerName: "Agam",
    providerAvatar: "/agam-profile.jpg",
    coverImage: "/himalayan-trek.jpg",
    date: "2026-10-24",
    timeSlot: "06:00 AM",
    guests: 2,
    totalPrice: 9000,
    status: "Confirmed", // Confirmed, Pending, Completed, Cancelled
    instantConfirmation: true,
    traveller: {
      name: "Sarah Johnson",
      email: "sarah.johnson@gmail.com",
      phone: "+91 98765 43210",
      specialRequests: "Vegetarian meals, early check-in if possible."
    },
    paymentMethod: "UPI (Google Pay)",
    createdAt: "2026-10-18T10:14:00.000Z",
    hasReview: false
  },
  {
    id: "HMR-882195",
    serviceId: "cook-1",
    serviceTitle: "Authentic Himachali Dham Feast Workshop in Mashobra Orchard",
    providerId: "p1",
    providerName: "Sunil Verma",
    providerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
    date: "2026-10-28",
    timeSlot: "10:30 AM",
    guests: 2,
    totalPrice: 3700,
    status: "Confirmed",
    instantConfirmation: true,
    traveller: {
      name: "Sarah Johnson",
      email: "sarah.johnson@gmail.com",
      phone: "+91 98765 43210",
      specialRequests: "One vegetarian guest with mild spice preference"
    },
    paymentMethod: "UPI (Google Pay)",
    createdAt: "2026-10-18T10:14:00.000Z",
    hasReview: false
  },
  {
    id: "HMR-714022",
    serviceId: "heri-1",
    serviceTitle: "Shimla Heritage Walk: The Ridge, Christ Church & Gaiety Theatre",
    providerId: "p2",
    providerName: "Dr. Arvind Thakur",
    providerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80",
    date: "2026-10-12",
    timeSlot: "09:30 AM",
    guests: 2,
    totalPrice: 1700,
    status: "Completed",
    instantConfirmation: true,
    traveller: {
      name: "Aarav Sen",
      email: "aarav.sen@example.com",
      phone: "+91 98201 44512"
    },
    paymentMethod: "Credit Card (Visa ending in 4242)",
    createdAt: "2026-10-08T14:20:00.000Z",
    hasReview: true
  },
  {
    id: "HMR-593018",
    serviceId: "safari-1",
    serviceTitle: "Kufri & Himalayan Nature Park 4x4 Wildlife & Yak Trail Safari",
    providerId: "p10",
    providerName: "Himalayan Ridge 4x4 Safaris",
    providerAvatar: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    date: "2026-09-28",
    timeSlot: "08:00 AM",
    guests: 3,
    totalPrice: 3200,
    status: "Cancelled",
    instantConfirmation: true,
    traveller: {
      name: "Aarav Sen",
      email: "aarav.sen@example.com",
      phone: "+91 98201 44512"
    },
    paymentMethod: "UPI (PhonePe)",
    createdAt: "2026-09-20T09:00:00.000Z",
    cancellationReason: "Flight delayed due to weather in Delhi",
    hasReview: false
  }
];
