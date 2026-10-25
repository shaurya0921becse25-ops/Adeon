import React, { useState, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  SlidersHorizontal,
  Grid,
  List,
  X,
  MapPin,
  RotateCcw
} from "lucide-react";
import { getDestinationById } from "../data/destinations";
import { categories } from "../data/categories";
import { shimlaServices } from "../data/services";
import { ServiceCard } from "../components/service/ServiceCard";
import { Button, Drawer, Skeleton } from "../components/ui";
import { ComingSoon } from "./ComingSoon";
import "./Destination.css";

export const Destination = () => {
  const { city } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const destination = getDestinationById(city);

  if (!destination || destination.comingSoon || destination.id !== "shimla") {
    return <ComingSoon />;
  }

  // Layout state: Grid or List
  const [layoutMode, setLayoutMode] = useState("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Category filter synced to URL query params
  const categoryParam = searchParams.getAll("category");

  const triggerLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 150);
  };

  const toggleCategory = (catId) => {
    triggerLoading();
    const newParams = new URLSearchParams(searchParams);
    const currentList = newParams.getAll("category");
    newParams.delete("category");

    if (currentList.includes(catId)) {
      currentList.filter((c) => c !== catId).forEach((c) => newParams.append("category", c));
    } else {
      [...currentList, catId].forEach((c) => newParams.append("category", c));
    }
    setSearchParams(newParams);
  };

  const selectOnlyCategory = (catId) => {
    triggerLoading();
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("category");
    if (catId) {
      newParams.set("category", catId);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    triggerLoading();
    setSearchParams(new URLSearchParams());
  };

  // Filter ONLY by Category
  const filteredServices = useMemo(() => {
    return shimlaServices.filter((service) => {
      if (categoryParam.length > 0) {
        return categoryParam.includes(service.categoryId);
      }
      return true;
    });
  }, [categoryParam]);

  // Sidebar Filter Form Component (Category only)
  const renderFilterSidebar = () => {
    return (
      <div className="filter-sidebar-content">
        <div className="filter-group">
          <h4 className="filter-title">Filter by Category</h4>
          <div className="filter-options-list">
            {categories.map((cat) => {
              const isChecked = categoryParam.includes(cat.id);
              const count = shimlaServices.filter((s) => s.categoryId === cat.id).length;
              return (
                <label key={cat.id} className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(cat.id)}
                  />
                  <span className="checkbox-text">{cat.name}</span>
                  <span className="filter-count">({count})</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="destination-page">
      {/* 1. Destination Banner with Facts */}
      <section className="destination-banner">
        <div className="banner-bg-img" style={{ backgroundImage: `url(${destination.coverImage})` }} />
        <div className="banner-overlay" />
        <div className="container banner-container">
          <span className="banner-badge">{destination.badge}</span>
          <h1 className="banner-title font-heading">{destination.name} Experiences</h1>
          <p className="banner-tagline">{destination.tagline}</p>

          <div className="banner-facts-row">
            {destination.quickFacts.map((fact, idx) => (
              <div key={idx} className="fact-pill">
                <span className="fact-label">{fact.label}:</span>
                <span className="fact-value">{fact.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container main-layout-container">
        {/* Top Control Bar */}
        <div className="destination-top-bar">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              className="btn btn-secondary btn-sm mobile-filter-btn"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <SlidersHorizontal size={16} />
              <span>Categories</span>
            </button>

            <span className="results-count-text">
              Showing <strong>{filteredServices.length}</strong> experiences in {destination.name}
            </span>
          </div>

          <div className="top-bar-right-controls">
            {/* Grid / List Layout Toggle */}
            <div className="layout-toggle-group">
              <button
                type="button"
                className={`layout-btn ${layoutMode === "grid" ? "active" : ""}`}
                onClick={() => setLayoutMode("grid")}
                aria-label="Grid layout"
              >
                <Grid size={18} />
              </button>
              <button
                type="button"
                className={`layout-btn ${layoutMode === "list" ? "active" : ""}`}
                onClick={() => setLayoutMode("list")}
                aria-label="List layout"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {categoryParam.length > 0 && (
          <div className="active-filters-strip">
            <span className="text-xs text-taupe-soft">Selected Category:</span>
            {categoryParam.map((catId) => (
              <span key={catId} className="active-pill">
                {categories.find((c) => c.id === catId)?.name || catId}
                <X size={12} onClick={() => toggleCategory(catId)} />
              </span>
            ))}
            <button type="button" className="clear-all-pill-btn" onClick={clearAllFilters}>
              Show All
            </button>
          </div>
        )}

        {/* 2-Column Layout: Sidebar (Category Only) + Service Cards */}
        <div className="destination-body-grid">
          {/* Desktop Left Sidebar */}
          <aside className="destination-sidebar">
            <div className="sidebar-sticky-box">
              <div className="flex items-center justify-between sidebar-header">
                <span className="font-semibold text-taupe-deep flex items-center gap-2">
                  <SlidersHorizontal size={16} /> Categories
                </span>
                {categoryParam.length > 0 && (
                  <button type="button" className="text-xs text-aegean-deep" onClick={clearAllFilters}>
                    Clear
                  </button>
                )}
              </div>
              {renderFilterSidebar()}
            </div>
          </aside>

          {/* Results Grid / List */}
          <main className="destination-results-col">
            {isLoading ? (
              <div className="services-grid">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="card" style={{ padding: 14 }}>
                    <Skeleton height="180px" />
                    <Skeleton height="24px" width="70%" style={{ marginTop: 14 }} />
                    <Skeleton height="16px" width="90%" style={{ marginTop: 8 }} />
                    <Skeleton height="36px" style={{ marginTop: 14 }} />
                  </div>
                ))}
              </div>
            ) : filteredServices.length > 0 ? (
              <div className={layoutMode === "grid" ? "services-grid" : "services-list-container"}>
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} layout={layoutMode} />
                ))}
              </div>
            ) : (
              <div className="empty-results-box text-center">
                <MapPin size={48} className="text-taupe-muted" style={{ margin: "0 auto 16px" }} />
                <h3 className="font-heading" style={{ marginBottom: 8 }}>
                  No experiences found
                </h3>
                <Button variant="secondary" onClick={clearAllFilters}>
                  <RotateCcw size={16} />
                  <span>Show All Categories</span>
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Categories Bottom-Sheet Drawer */}
      <Drawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="Filter by Category"
      >
        <div style={{ paddingBottom: 24 }}>
          {renderFilterSidebar()}
          <div style={{ marginTop: 24 }}>
            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={() => setIsMobileFilterOpen(false)}
            >
              Show {filteredServices.length} Results
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
