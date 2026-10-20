import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Trash2, MapPin, Sparkles, User, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatINR } from '../../utils/formatters';
import {
  selectAttachedServices,
  removeServiceFromItinerary,
  selectItineraryServicesTotal
} from '../../store/servicesSlice';
import { useToast } from '../../context/ToastContext';
import './ItineraryServicesSection.css';

export default function ItineraryServicesSection({ tripBudget = 25000 }) {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const attachedServices = useSelector(selectAttachedServices);
  const servicesTotal = useSelector(selectItineraryServicesTotal);

  const handleRemove = (serviceId, title) => {
    dispatch(removeServiceFromItinerary(serviceId));
    showToast(`Removed "${title}" from itinerary`, 'info');
  };

  const budgetPct = tripBudget > 0 ? Math.round((servicesTotal / tripBudget) * 100) : 0;

  return (
    <div className="itinerary-services-section">
      <div className="itinerary-services-header">
        <div className="itinerary-header-left">
          <div className="itinerary-tag-pill">
            <Sparkles size={13} />
            <span>LOCAL SERVICES INCLUDED</span>
          </div>
          <h3 className="itinerary-services-title">Scheduled Local Guide Services</h3>
          <p className="itinerary-services-sub">
            These verified experiences are integrated into your trip timeline and counted toward your total budget.
          </p>
        </div>

        {attachedServices.length > 0 && (
          <div className="itinerary-services-total-pill">
            <span className="total-pill-label">Services Subtotal:</span>
            <strong className="total-pill-amt tabular-nums">{formatINR(servicesTotal)}</strong>
            <span className="total-pill-pct">({budgetPct}% of trip budget)</span>
          </div>
        )}
      </div>

      {attachedServices.length === 0 ? (
        <div className="itinerary-services-empty">
          <p>No local guide services scheduled yet.</p>
          <Link to="/services" className="itinerary-explore-link">
            Explore and attach local services &rarr;
          </Link>
        </div>
      ) : (
        <div className="itinerary-services-grid">
          {attachedServices.map((item) => (
            <div key={`${item.serviceId}-${item.day}`} className="itinerary-service-card">
              <div className="itinerary-day-badge">
                <span>DAY</span>
                <strong>{item.day || 1}</strong>
              </div>

              <div className="itinerary-card-info">
                <h4 className="itinerary-card-title">{item.title}</h4>
                <div className="itinerary-card-meta">
                  <span className="meta-guide">
                    <User size={13} /> Guide: <strong>{item.guideName}</strong>
                  </span>
                  {item.date && (
                    <span className="meta-date tabular-nums">
                      <Calendar size={13} /> {item.date}
                    </span>
                  )}
                  <span className="meta-party tabular-nums">
                    Party of {item.partySize || 2}
                  </span>
                </div>
              </div>

              <div className="itinerary-card-pricing tabular-nums">
                <span className="itinerary-price-val">{formatINR(item.total || item.price)}</span>
                <button
                  type="button"
                  className="itinerary-remove-btn"
                  onClick={() => handleRemove(item.serviceId, item.title)}
                  title="Remove service from itinerary"
                  aria-label="Remove"
                >
                  <Trash2 size={14} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
