import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectPendingPlan } from '../store/tripSlice';

const TripContext = createContext(null);
const LS = 'abeon_trip_context_v1';

export function TripProvider({ children }) {
  const pending = useSelector(selectPendingPlan);
  const [ctx, setCtx] = useState(() => {
    try {
      const saved = localStorage.getItem(LS);
      if (saved) return JSON.parse(saved);
    } catch {
      /* ignore */
    }
    return {
      city: pending.city || 'Shimla',
      date: new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10),
      partySize: 2,
      budget: pending.budget || 25000,
    };
  });

  useEffect(() => {
    if (pending.city) {
      setCtx((c) => ({ ...c, city: pending.city, budget: pending.budget ?? c.budget }));
    }
  }, [pending.city, pending.budget]);

  useEffect(() => {
    localStorage.setItem(LS, JSON.stringify(ctx));
  }, [ctx]);

  const value = useMemo(
    () => ({
      ...ctx,
      setTripContext: (patch) => setCtx((c) => ({ ...c, ...patch })),
    }),
    [ctx]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTripContext() {
  const v = useContext(TripContext);
  if (!v) throw new Error('useTripContext requires TripProvider');
  return v;
}
