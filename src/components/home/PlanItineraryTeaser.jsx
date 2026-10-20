import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Map, Clock, ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import './PlanItineraryTeaser.css';

const FEATURES = [
  {
    icon: <Calendar size={22} strokeWidth={1.5} />,
    title: 'Day-by-Day Planner',
    desc: 'Build structured itineraries with opening-hour checks, transit gaps, and budget splits — all in one view.',
  },
  {
    icon: <Map size={22} strokeWidth={1.5} />,
    title: 'Smart Route Preview',
    desc: 'Visualise your route across stops and instantly see when a day is over-packed before you travel.',
  },
  {
    icon: <Clock size={22} strokeWidth={1.5} />,
    title: 'Time & Budget Aware',
    desc: 'Every activity is checked against realistic time windows and honest budget bands per destination.',
  },
];

export default function PlanItineraryTeaser() {
  const navigate = useNavigate();

  return (
    <section className="pit-teaser section" aria-label="Plan your itinerary" id="plan-itinerary">
      <div className="container">
        <div className="pit-teaser__header">
          <p className="abeon-caption">itinerary planner</p>
          <h2 className="pit-teaser__title">Plan your perfect trip</h2>
          <p className="pit-teaser__sub">
            Our itinerary planner brings together time, distance, budget, and local guide insights so every day flows naturally.
          </p>
        </div>

        <div className="pit-teaser__cards">
          {FEATURES.map((f) => (
            <div key={f.title} className="pit-teaser__card">
              <div className="pit-teaser__card-icon" aria-hidden="true">{f.icon}</div>
              <h3 className="pit-teaser__card-title">{f.title}</h3>
              <p className="pit-teaser__card-desc">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="pit-teaser__cta">
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight size={17} />}
            onClick={() => navigate('/itinerary')}
            id="pit-open-planner-btn"
          >
            Open Itinerary Planner
          </Button>
        </div>
      </div>
    </section>
  );
}
