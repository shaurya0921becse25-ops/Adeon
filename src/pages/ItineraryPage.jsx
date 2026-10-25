import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import MainPage from '../modules/itinerary/components/MainPage.jsx';
import TripApp from '../modules/itinerary/components/TripApp.jsx';
import { SeedLoader } from '../itinerary/index.js';

/**
 * Route /itinerary:
 * Connected natively to the itinerary engine from iternar-folder.
 * Shows trip management (MainPage) or full workspace (TripApp)
 * with the unified WanderWise global navbar and footer.
 */
export default function ItineraryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();

  const currentParamTripId = params.tripId || searchParams.get('tripId');
  const isTripRequested = Boolean(currentParamTripId || searchParams.get('view') === 'trip');

  const [activeTripId, setActiveTripId] = useState(() => {
    return currentParamTripId || null;
  });
  const [view, setView] = useState(() => {
    return isTripRequested ? 'trip' : 'main';
  });

  // Keep state in sync with URL params/searchParams
  useEffect(() => {
    const seedId = SeedLoader.ensureInitialSeedLoaded();
    if (currentParamTripId) {
      setActiveTripId(currentParamTripId);
      setView('trip');
    } else if (searchParams.get('view') === 'trip') {
      setActiveTripId(seedId);
      setView('trip');
    } else if (!searchParams.get('view') && !params.tripId) {
      setView('main');
    }
  }, [currentParamTripId, searchParams, params.tripId]);

  const handleNavigateToTrip = (tripId) => {
    const id = tripId || SeedLoader.ensureInitialSeedLoaded();
    setActiveTripId(id);
    setView('trip');
    setSearchParams({ view: 'trip', tripId: id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToMain = () => {
    setView('main');
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="itinerary-connected-page">
      {view === 'main' ? (
        <MainPage onNavigateToTrip={handleNavigateToTrip} />
      ) : (
        <TripApp
          tripId={activeTripId || SeedLoader.ensureInitialSeedLoaded()}
          onNavigateToMain={handleNavigateToMain}
          overviewThenPlan={true}
        />
      )}
    </div>
  );
}
