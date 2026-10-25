/**
 * Initial mock data modeled directly from the original adeon_profile.html.
 * Provides the data contracts for profile information, trip history,
 * community comments, and booked services.
 */

export const initialProfileData = {
  name: 'Shourya Jaiswal',
  handle: '@shourya',
  bio: 'Travel. Learn. Build. 🌍',
  quote: '“Collect moments, not things.”',
  avatar:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=85',
  coverPhoto:
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85',
  stats: {
    trips: 12,
    comments: 28,
    services: 4,
  },
}

export const initialTripsData = [
  {
    id: 'trip-1',
    title: 'Santorini, Greece',
    dates: '12 – 18 Aug 2025',
    location: 'Santorini, Greece',
    desc: 'White cliffs, blue domes and the best sunsets I’ve ever seen. Truly magical.',
    image:
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=300&q=80',
    fallbackImage:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=300&q=80',
    alt: 'Santorini coast',
  },
  {
    id: 'trip-2',
    title: 'Ladakh, India',
    dates: '5 – 12 Jun 2025',
    location: 'Leh, India',
    desc: 'High mountains, clear skies and endless roads. An unforgettable experience.',
    image:
      'https://images.unsplash.com/photo-151968 nuevo?auto=format&fit=crop&w=300&q=80',
    fallbackImage:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80',
    alt: 'Mountain lake',
  },
  {
    id: 'trip-3',
    title: 'Prague, Czech Republic',
    dates: '21 – 27 Mar 2025',
    location: 'Prague, Czech Republic',
    desc: 'Beautiful architecture, great food and a perfect mix of history and modern vibes.',
    image:
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=300&q=80',
    fallbackImage:
      'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=300&q=80',
    alt: 'European city',
  },
  {
    id: 'trip-4',
    title: 'Amalfi Coast, Italy',
    dates: '10 – 16 Sep 2024',
    location: 'Amalfi Coast, Italy',
    desc: 'Scenic drives, coastal towns and some of the best food I’ve had.',
    image:
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=300&q=80',
    fallbackImage:
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=300&q=80',
    alt: 'Amalfi coast',
  },
  {
    id: 'trip-5',
    title: 'Rishikesh, India',
    dates: '2 – 5 Nov 2023',
    location: 'Rishikesh, India',
    desc: 'River, mountains, peace. A perfect short getaway.',
    image:
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=300&q=80',
    fallbackImage:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80',
    alt: 'Green mountain valley',
  },
]

export const initialCommentsData = [
  {
    id: 'comm-1',
    community: 'r/TravelIndia',
    time: '3 days ago',
    title: 'Best time to visit Spiti Valley?',
    excerpt:
      'In my experience, June to September is the best time for clear roads and mountain views. Pack layers because evenings can get cold.',
    shortExcerpt: 'In my experience, June to September is the best time...',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'comm-2',
    community: 'r/Backpacking',
    time: '1 week ago',
    title: 'How to plan a 10 day Europe trip on a budget?',
    excerpt:
      'I would suggest focusing on 2–3 countries max, then comparing train passes and staying close to public transport.',
    shortExcerpt: 'I would suggest focusing on 2–3 countries max...',
    image:
      'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'comm-3',
    community: 'r/TravelTips',
    time: '2 weeks ago',
    title: 'Is it safe to travel alone in Japan?',
    excerpt:
      'Yes, it’s generally very safe. Plan your route ahead and keep local transport details handy.',
    shortExcerpt: 'Yes, it’s generally very safe. Just follow basic...',
    image:
      'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'comm-4',
    community: 'r/IndiaTravel',
    time: '3 weeks ago',
    title: 'Hidden gems in Himachal?',
    excerpt:
      'I recently visited Shoja and it was absolutely amazing. Peaceful trails, apple orchards, and not crowded at all.',
    shortExcerpt: 'I recently visited Shoja and it was absolutely amazing...',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'comm-5',
    community: 'r/TravelCommunity',
    time: '1 month ago',
    title: 'Your favourite travel apps?',
    excerpt:
      'I use Google Maps, Rome2Rio and Notion for planning daily schedules and tracking hostel bookings.',
    shortExcerpt: 'I use Google Maps, Rome2Rio and Notion for planning...',
    image:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=120&q=80',
  },
]

export const initialServicesData = [
  {
    id: 'serv-1',
    name: 'Hotel Santorini View',
    type: 'Hotel',
    location: 'Santorini, Greece',
    dates: '12 Aug – 15 Aug 2025',
    status: 'Confirmed',
    image:
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'serv-2',
    name: 'Athens City Tour',
    type: 'Activity',
    location: 'Athens, Greece',
    dates: '16 Aug 2025',
    status: 'Confirmed',
    image:
      'https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'serv-3',
    name: 'Train Ticket – Bernina Express',
    type: 'Transport',
    location: 'Switzerland',
    dates: '22 Jun 2025',
    status: 'Confirmed',
    image:
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'serv-4',
    name: 'Adventure Camp',
    type: 'Activity',
    location: 'Rishikesh, India',
    dates: '3 Nov 2023',
    status: 'Confirmed',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=120&q=80',
  },
]
