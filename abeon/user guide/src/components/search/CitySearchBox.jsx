import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Sparkles, Clock } from "lucide-react";
import { searchCities, getRecentSearches, saveRecentSearch } from "../../utils/citySearch";
import { destinations } from "../../data/destinations";
import "./CitySearchBox.css";

export const CitySearchBox = ({
  initialCity = "",
  initialQuery = "",
  variant = "hero", // hero | compact | header
  onSelectCity,
  placeholder = "Search destination (e.g. Shimla, Manali...)"
}) => {
  const navigate = useNavigate();
  const [cityInput, setCityInput] = useState(initialCity);
  const [activityInput, setActivityInput] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentList, setRecentList] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setRecentList(getRecentSearches());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setCityInput(val);
    setIsOpen(true);
    const results = searchCities(val);
    setSuggestions(results);
  };

  const handleSelect = (cityObj) => {
    setCityInput(cityObj.name);
    setIsOpen(false);
    saveRecentSearch(cityObj.name);

    if (onSelectCity) {
      onSelectCity(cityObj);
    } else {
      const targetPath = `/destination/${cityObj.id.toLowerCase()}${
        activityInput ? `?q=${encodeURIComponent(activityInput)}` : ""
      }`;
      navigate(targetPath);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!cityInput.trim()) {
      // Default to Shimla if empty
      navigate(`/destination/shimla${activityInput ? `?q=${encodeURIComponent(activityInput)}` : ""}`);
      return;
    }

    const matched = destinations.find(
      (d) => d.name.toLowerCase() === cityInput.trim().toLowerCase() || d.id === cityInput.trim().toLowerCase()
    );

    if (matched) {
      handleSelect(matched);
    } else {
      // Search a city not in list -> redirect to not-found / coming-soon state
      saveRecentSearch(cityInput.trim());
      navigate(`/destination/${encodeURIComponent(cityInput.trim().toLowerCase())}${
        activityInput ? `?q=${encodeURIComponent(activityInput)}` : ""
      }`);
    }
  };

  return (
    <div className={`city-search-wrapper ${variant}`} ref={wrapperRef}>
      <form onSubmit={handleSearchSubmit} className="search-form-row">
        {/* City Input with Autocomplete */}
        <div className="search-field-group city-field">
          <label className="search-field-label">
            <MapPin size={16} className="text-aegean-deep" />
            <span>Destination</span>
          </label>
          <input
            type="text"
            className="search-text-input"
            value={cityInput}
            onChange={handleInputChange}
            onFocus={() => {
              setIsOpen(true);
              setSuggestions(searchCities(cityInput));
            }}
            placeholder={placeholder}
            aria-label="City search"
            autoComplete="off"
          />
        </div>

        {/* What do you want to do (Hero variant only) */}
        {variant === "hero" && (
          <div className="search-field-group activity-field">
            <label className="search-field-label">
              <Sparkles size={16} className="text-aegean-deep" />
              <span>What do you want to do?</span>
            </label>
            <input
              type="text"
              className="search-text-input"
              value={activityInput}
              onChange={(e) => setActivityInput(e.target.value)}
              placeholder="e.g. Cooking, Heritage, Trekking, Safari..."
              aria-label="Experience or activity keyword"
            />
          </div>
        )}

        <button type="submit" className="search-submit-btn" aria-label="Search experiences">
          <Search size={20} />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};
