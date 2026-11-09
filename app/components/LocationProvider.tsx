"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { LocationKey } from "../lib/site";

const KEY = "gymnest-location";
type Ctx = { location: LocationKey | null; setLocation: (l: LocationKey) => void };
const LocationContext = createContext<Ctx>({ location: null, setLocation: () => {} });

/** Remembers which gym (Nampa or Eagle) the family picked, across pages and visits. */
export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLoc] = useState<LocationKey | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === "nampa" || saved === "eagle") setLoc(saved);
    } catch {
      // storage blocked: just don't remember
    }
  }, []);

  const setLocation = useCallback((l: LocationKey) => {
    setLoc(l);
    try {
      window.localStorage.setItem(KEY, l);
    } catch {
      // ignore
    }
  }, []);

  return <LocationContext.Provider value={{ location, setLocation }}>{children}</LocationContext.Provider>;
}

export const useLocation = () => useContext(LocationContext);

/** Drop into a location page so the header switch shows that gym. */
export function SetLocation({ location }: { location: LocationKey }) {
  const { location: current, setLocation } = useLocation();
  useEffect(() => {
    if (current !== location) setLocation(location);
  }, [current, location, setLocation]);
  return null;
}
