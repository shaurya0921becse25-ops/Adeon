import React from 'react';
import DashboardStub from './DashboardStub';
import ItineraryServicesSection from '../components/services/ItineraryServicesSection';
import { useTripContext } from '../context/TripContext';

/**
 * /itinerary route
 * Integrates the teammate's Itinerary Dashboard with the scheduled services section.
 */
export default function ItineraryPage() {
  const { budget } = useTripContext();

  return (
    <div className="itinerary-page-wrap">
      <DashboardStub />
      <div className="container" style={{ marginTop: '-40px', paddingBottom: '60px' }}>
        <ItineraryServicesSection tripBudget={budget || 25000} />
      </div>
    </div>
  );
}
