import React from 'react';
import { useAuth } from '../context/AuthContext';
import TravelerServicesDashboard from './TravelerServicesDashboard';
import GuideServicesDashboard from './GuideServicesDashboard';

/**
 * Route /services switch:
 * If userRole is 'guide' -> teammate's guide page
 * Otherwise -> Traveler Services Dashboard
 */
export default function ServicesPage() {
  const { userRole } = useAuth();

  if (userRole === 'guide') {
    return <GuideServicesDashboard />;
  }

  return <TravelerServicesDashboard />;
}
