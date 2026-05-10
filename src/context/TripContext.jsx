import { createContext, useContext, useState, useMemo, useCallback } from "react";

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [currentTripId, setCurrentTripId] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);

  const value = useMemo(() => ({
    currentTripId,
    setCurrentTripId,
    currentTrip,
    setCurrentTrip,
  }), [currentTripId, currentTrip]);

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
}

export function useTripContext() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTripContext must be used within TripProvider");
  return ctx;
}

export default TripContext;
