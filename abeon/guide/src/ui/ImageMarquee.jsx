import React from "react";

const travelDestinations = [
  {
    title: "Rohtang & Solang Valleys",
    tag: "High Alpine",
    image: "/himalayan-trek.jpg",
  },
  {
    title: "Himachali Dham Culinary Walk",
    tag: "Indigenous Flavors",
    image: "/cooking-class.jpg",
  },
  {
    title: "Spiti Wilderness Expedition",
    tag: "4x4 Safari",
    image: "/jeep-safari.jpg",
  },
  {
    title: "Old Manali Heritage Trails",
    tag: "Ancient Temples",
    image: "/heritage-walk.jpg",
  },
  {
    title: "Hampta Pass Scenic Ridge",
    tag: "Alpine Pass",
    image: "/hero.jpg",
  },
  {
    title: "Parvati Valley Forest Hike",
    tag: "Pine Woods",
    image: "/sidebar-bg.jpg",
  },
];

export default function ImageMarquee() {
  // Duplicate array for seamless infinite looping
  const items = [...travelDestinations, ...travelDestinations];

  return (
    <div className="marquee-section">
      <div className="marquee-header">
        <span className="marquee-pill">Curated Destination Highlights</span>
        <span className="marquee-sub">
          Showcasing your authentic Himachal trails &amp; adventures
        </span>
      </div>

      <div className="marquee-container" title="Pause on hover">
        <div className="marquee-track">
          {items.map((item, index) => (
            <div className="marquee-item" key={index}>
              <div className="marquee-img-wrap">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="marquee-img"
                />
                <div className="marquee-overlay">
                  <span className="marquee-item-tag">{item.tag}</span>
                  <p className="marquee-item-title">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
