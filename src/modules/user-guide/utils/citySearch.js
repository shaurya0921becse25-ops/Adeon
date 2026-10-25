import { destinations } from "../data/destinations";

const RECENT_SEARCHES_KEY = "himora_recent_searches";

export const getRecentSearches = () => {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? JSON.parse(raw) : ["Shimla", "Manali", "Dharamshala"];
  } catch (e) {
    return ["Shimla", "Manali"];
  }
};

export const saveRecentSearch = (cityName) => {
  if (!cityName) return;
  try {
    const existing = getRecentSearches().filter((c) => c.toLowerCase() !== cityName.toLowerCase());
    const updated = [cityName, ...existing].slice(0, 5);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save recent search", e);
  }
};

export const searchCities = (query) => {
  if (!query || !query.trim()) {
    return destinations.slice(0, 6);
  }
  const clean = query.toLowerCase().trim();
  return destinations.filter(
    (d) => d.name.toLowerCase().includes(clean) || d.state.toLowerCase().includes(clean)
  );
};
