import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Trash2, SlidersHorizontal, ArrowRight, Star, Clock } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import {
  selectSavedIds,
  selectServiceRows,
  toggleSaved,
  toggleCompareService,
  selectCompareServiceIds
} from '../../store/servicesSlice';
import Button from '../common/Button';
import './SavedServicesView.css';

export default function SavedServicesView({
  onViewDetail,
  onOpenMessage,
  onRequestBooking,
  onOpenCompare,
  onExploreServices,
  partySize = 2
}) {
  const dispatch = useDispatch();
  const savedIds = useSelector(selectSavedIds);
  const serviceRows = useSelector(selectServiceRows);
  const compareIds = useSelector(selectCompareServiceIds);

  const savedServices = serviceRows.filter((s) => savedIds.includes(s.id));

  return (
    <div className="saved-services-container">
      {savedServices.length === 0 ? (
        <div className="saved-empty-box">
          <Heart size={44} className="saved-empty-icon" />
          <h3 className="empty-title">No saved guides or services yet</h3>
          <p className="empty-sub">
            Save interesting walking tours, heritage hosts, or day drivers by clicking the heart icon while exploring.
          </p>
          <Button variant="primary" size="md" onClick={onExploreServices}>
            Browse verified services
          </Button>
        </div>
      ) : (
        <div className="saved-list-wrap">
          <div className="saved-list-header">
            <div>
              <h3 className="saved-count-heading">
                Saved Services ({savedServices.length})
              </h3>
              <p className="saved-sub">
                Quickly compare options or reach out directly to your bookmarked guides.
              </p>
            </div>

            {compareIds.length >= 2 && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<SlidersHorizontal size={14} />}
                onClick={onOpenCompare}
              >
                Compare ({compareIds.length})
              </Button>
            )}
          </div>

          <div className="saved-cards-list">
            {savedServices.map((svc) => {
              const guide = svc.guide || {};
              const isPerPerson = svc.priceMode === 'person';
              const partyTotal = isPerPerson ? svc.price * partySize : svc.price;
              const isCompared = compareIds.includes(svc.id);

              return (
                <div key={svc.id} className="saved-editorial-card">
                  <div className="saved-arch-col" onClick={() => onViewDetail(svc)}>
                    <img
                      src={guide.photo || '/images/guide-portrait.jpg'}
                      alt={guide.name}
                      className="saved-arch-img"
                    />
                    <span className="saved-demo-tag">demo</span>
                  </div>

                  <div className="saved-info-col">
                    <div className="saved-meta-line">
                      <span className="saved-guide-name">{guide.name}</span>
                      <span className="saved-city-pill">{svc.city}</span>
                      <span className="meta-separator">&bull;</span>
                      <span className="saved-rating">
                        <Star size={12} className="star-filled" fill="currentColor" />
                        <strong>{svc.rating}</strong> ({svc.reviewCount})
                      </span>
                    </div>

                    <h4
                      className="saved-title"
                      onClick={() => onViewDetail(svc)}
                      role="button"
                      tabIndex={0}
                    >
                      {svc.title}
                    </h4>

                    <div className="saved-pricing-line tabular-nums">
                      <span className="saved-base-price">
                        {formatINR(svc.price)}/{isPerPerson ? 'person' : 'group'}
                      </span>
                      <span className="saved-total-price">
                        <strong>{formatINR(partyTotal)}</strong> for {partySize} guests
                      </span>
                    </div>
                  </div>

                  <div className="saved-actions-col">
                    <label className="saved-compare-checkbox">
                      <input
                        type="checkbox"
                        checked={isCompared}
                        onChange={() => dispatch(toggleCompareService(svc.id))}
                      />
                      <span>Compare</span>
                    </label>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onRequestBooking(svc)}
                    >
                      Request booking
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetail(svc)}
                    >
                      View
                    </Button>

                    <button
                      type="button"
                      className="saved-remove-btn"
                      onClick={() => dispatch(toggleSaved(svc.id))}
                      title="Remove from saved"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
