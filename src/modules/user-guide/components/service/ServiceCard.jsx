import React, { useState } from "react";
import { Clock, Users, Zap, ShieldCheck } from "lucide-react";
import { Badge } from "../ui";
import { formatINR } from "../../utils/pricing";
import { getProviderById } from "../../data/providers";
import { ServiceDetailModal } from "./ServiceDetailModal";
import "./ServiceCard.css";

export const ServiceCard = ({ service, layout = "grid" }) => {
  const provider = getProviderById(service.providerId);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className={`service-card ${layout === "list" ? "service-card-list" : ""} lift-on-hover`}
        onClick={() => setModalOpen(true)}
        role="article"
        style={{ cursor: "pointer" }}
      >
        {/* Thumbnail Area */}
        <div className="service-card-media">
          <img
            src={service.coverImage || service.image || "/himalayan-trek.jpg"}
            alt={service.title}
            className="service-card-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/himalayan-trek.jpg";
            }}
          />

          {/* Category Badge overlay */}
          <div className="media-badge-overlay">
            <Badge variant="aegean">{service.category}</Badge>
          </div>

          {/* Provider Mini Avatar */}
          {provider && (
            <div
              className="provider-mini-avatar"
              title={`Hosted by ${provider.name}`}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={provider.avatar || "/agam-profile.jpg"}
                alt={provider.name}
                onError={(e) => {
                  e.currentTarget.src = "/agam-profile.jpg";
                }}
              />
            </div>
          )}
        </div>

        {/* Card Content Area */}
        <div className="service-card-body">
  
          {/* Title */}
          <h3 className="service-card-title">{service.title}</h3>

          {/* Meta Info: Duration, Group Size */}
          <div className="service-card-meta">
            <span className="meta-item">
              <Clock size={14} />
              <span>{service.duration}</span>
            </span>
            <span className="meta-item">
              <Users size={14} />
              <span>{service.groupSize}</span>
            </span>
          </div>

          {/* Trust tags */}
          <div className="service-card-tags">
            {service.freeCancellation && (
              <span className="tag-free-cancel">
                <ShieldCheck size={13} />
                <span>Free cancellation</span>
              </span>
            )}
            {service.instantConfirmation && (
              <span className="tag-instant">
                <Zap size={13} />
                <span>Instant confirmation</span>
              </span>
            )}
          </div>

          {/* Card Footer: Pricing */}
          <div className="service-card-footer">
            <div className="pricing-col">
              <span className="price-from-label">From</span>
              <div className="price-value-row">
                <span className="price-amount">{formatINR(service.price)}</span>
                <span className="price-unit">/{service.priceUnit.replace("per ", "")}</span>
              </div>
            </div>
            <button
              type="button"
              className="card-book-btn"
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(true);
              }}
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Service Detail Popup Modal */}
      <ServiceDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        service={service}
      />
    </>
  );
};
