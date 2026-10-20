import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Calendar, IndianRupee, MapPin, ArrowLeft, Bookmark, CheckCircle2 } from 'lucide-react';
import { selectPendingPlan } from '../store/tripSlice';
import { selectSavedPlaces } from '../store/communitySlice';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/formatters';
import TicketCard from '../components/common/TicketCard';
import Button from '../components/common/Button';
import './DashboardStub.css';

export default function DashboardStub() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pendingPlan = useSelector(selectPendingPlan);
  const savedPlaces = useSelector(selectSavedPlaces);
  const { userRole } = useAuth();

  const queryCity = searchParams.get('city') || pendingPlan.city || 'Shimla';
  const queryDays = searchParams.get('days') || pendingPlan.days || 3;
  const queryBudget = searchParams.get('budget') || pendingPlan.budget || 22000;
  const queryRole = searchParams.get('role') || userRole;

  return (
    <main id="main-content" className="dashboard-stub-page">
      <div className="container">
        <div className="stub-header">
          <Link to="/" className="stub-back-link">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            <span>TEAMMATE COMPONENT STUB</span>
          </div>
          <h1 className="stub-title">Itinerary & Planner Dashboard</h1>
          <p className="stub-subtitle">
            This route is reserved for your teammates' Itinerary Engine. All incoming constraints passed from Home, Trip Match, and Field Notes are received and displayed below.
          </p>
        </div>

        <div className="stub-grid">
          {/* Incoming Plan Ticket */}
          <TicketCard
            className="stub-plan-card"
            header={
              <div className="stub-card-header">
                <strong>INCOMING PLAN PAYLOAD</strong>
                <span className="stub-status-pill">Active Parameters</span>
              </div>
            }
            stub={
              <div className="stub-footer">
                <small>Ready for teammate itinerary generator integration</small>
                <Button variant="outline" size="sm" onClick={() => navigate('/trip-match')}>
                  Re-run Trip Match
                </Button>
              </div>
            }
          >
            <div className="stub-payload-details">
              <div className="stub-payload-item">
                <span className="payload-label">Selected Destination:</span>
                <span className="payload-val">
                  <MapPin size={15} className="payload-icon" /> {queryCity}
                </span>
              </div>

              <div className="stub-payload-item">
                <span className="payload-label">Trip Duration:</span>
                <span className="payload-val">
                  <Calendar size={15} className="payload-icon" /> {queryDays} days
                </span>
              </div>

              <div className="stub-payload-item">
                <span className="payload-label">Target Budget:</span>
                <span className="payload-val tabular-nums">
                  <IndianRupee size={15} className="payload-icon" /> {formatINR(queryBudget)}
                </span>
              </div>

              <div className="stub-payload-item">
                <span className="payload-label">Active User Role:</span>
                <span className="payload-val">
                  {queryRole === 'guide' ? 'Local Guide' : 'Traveler'}
                </span>
              </div>

              <div className="stub-payload-item">
                <span className="payload-label">Handoff Source:</span>
                <span className="payload-val">
                  <code>{pendingPlan.source || 'Direct Navigation'}</code>
                </span>
              </div>
            </div>
          </TicketCard>

          {/* Saved Places from Community */}
          <div className="stub-saved-card">
            <div className="stub-saved-header">
              <div className="saved-title-row">
                <Bookmark size={18} />
                <h3>Saved Places from Field Notes</h3>
              </div>
              <span className="saved-count-pill">{savedPlaces.length} places</span>
            </div>

            {savedPlaces.length > 0 ? (
              <div className="stub-saved-list">
                {savedPlaces.map((place) => (
                  <div key={place.id} className="stub-saved-item">
                    <div className="saved-item-info">
                      <strong>{place.placeName}</strong>
                      <small>{place.city} &bull; {place.category}</small>
                      {place.notes && <p className="saved-note-text">"{place.notes}"</p>}
                    </div>
                    <span className="saved-check-icon">
                      <CheckCircle2 size={16} />
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="stub-empty-saved">
                No places saved yet. Go to <Link to="/community">Field Notes</Link> and click "Save to trip" on any review to bookmark sights into this itinerary.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
