import React from 'react';
import Hero from '../components/home/Hero';
import PopularDestinations from '../components/home/PopularDestinations';
import CircleGallery from '../components/home/CircleGallery';
import BottomMiddle from '../components/home/BottomMiddle';
import HomeFooter from '../components/home/HomeFooter';
import './Home.css';

const DESTINATIONS = [
  {
    name: "Santorini Caldera",
    location: "Oia, Greece",
    description: "Whitewashed villages and blue domes overlooking the Aegean Sea.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700&auto=format&fit=crop&q=80",
  },
  {
    name: "Mount Fuji",
    location: "Honshu, Japan",
    description: "Japan's iconic peak framed by quiet lakes and spring blossoms.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=700&auto=format&fit=crop&q=80",
  },
  {
    name: "Amalfi Coast",
    location: "Positano, Italy",
    description: "Pastel villages spill down the cliffs toward the Mediterranean.",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=700&auto=format&fit=crop&q=80",
  },
  {
    name: "Swiss Alps",
    location: "Lauterbrunnen, Switzerland",
    description: "Alpine meadows, dramatic peaks, and cascading waterfalls.",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=700&auto=format&fit=crop&q=80",
  },
  {
    name: "Lake Louise",
    location: "Alberta, Canada",
    description: "Turquoise glacial water surrounded by the Canadian Rockies.",
    image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=700&auto=format&fit=crop&q=80",
  },
  {
    name: "Northern Lights",
    location: "Tromsø, Norway",
    description: "The aurora dances above the Arctic landscape.",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=700&auto=format&fit=crop&q=80",
  },
  {
    name: "Ubud Rice Terraces",
    location: "Bali, Indonesia",
    description: "Emerald rice paddies curve through the tropical highlands.",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=700&auto=format&fit=crop&q=80",
  },
  {
    name: "Taj Mahal",
    location: "Agra, India",
    description: "An ivory marble landmark glowing in the morning light.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=700&auto=format&fit=crop&q=80",
  },
];

export default function Home() {
  return (
    <div className="home-page" id="main-content">
      <Hero />
      <PopularDestinations>
        <CircleGallery
          items={DESTINATIONS}
          itemWidth={190}
          itemHeight={245}
          radiusPercent={25}
          borderRadius={14}
          itemScale={0.82}
          autoSpinSpeed={2}
          throwResistance={0.35}
          enableDrag
        />
      </PopularDestinations>
      <BottomMiddle />
      <HomeFooter />
    </div>
  );
}
