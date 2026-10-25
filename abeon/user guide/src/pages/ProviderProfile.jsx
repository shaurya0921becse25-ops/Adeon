import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Clock, Award, Languages, MapPin, MessageSquare, ArrowLeft } from "lucide-react";
import { getProviderById } from "../data/providers";
import { getServicesByProvider } from "../data/services";
import { subscribeToDataChanges } from "../data/sharedDataBridge";
import { ServiceCard } from "../components/service/ServiceCard";
import { Badge } from "../components/ui";
import { useChat } from "../context/ChatContext";
import "./ProviderProfile.css";

export const ProviderProfile = ({ defaultId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startThreadWithGuide } = useChat();

  const targetId = id || defaultId || "guide-agam";
  const [provider, setProvider] = useState(() => getProviderById(targetId) || getProviderById("guide-agam"));
  const [services, setServices] = useState(() => getServicesByProvider(provider?.id || "guide-agam"));

  useEffect(() => {
    const p = getProviderById(targetId) || getProviderById("guide-agam");
    setProvider(p);
    setServices(getServicesByProvider(p?.id || "guide-agam"));
  }, [targetId]);

  useEffect(() => {
    const unsub = subscribeToDataChanges((type) => {
      if (type === "profile" || type === "services") {
        const p = getProviderById(targetId) || getProviderById("guide-agam");
        setProvider(p);
        setServices(getServicesByProvider(p?.id || "guide-agam"));
      }
    });
    return () => unsub();
  }, [targetId]);

  const handleStartChat = () => {
    if (startThreadWithGuide) {
      startThreadWithGuide(services[0] || null, provider);
    }
    navigate("/chat");
  };

  return (
    <div className="provider-profile-page">
      {/* Top Back Navigation */}
      <div className="container" style={{ paddingTop: "20px", paddingBottom: "12px" }}>
        <button
          type="button"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/trip"))}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 18px",
            borderRadius: "9999px",
            background: "#FFFFFF",
            border: "1.5px solid #91B8C7",
            color: "#2B4E5B",
            fontSize: "0.9rem",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(118, 95, 83, 0.08)",
            cursor: "pointer"
          }}
        >
          <ArrowLeft size={18} />
          <span>Back to Experiences</span>
        </button>
      </div>

      {/* Cover Header */}
      <div className="provider-hero-cover" style={{ backgroundImage: `url(${provider.cover})` }}>
        <div className="cover-overlay" />
      </div>

      <div className="container provider-main-content">
        {/* Profile Card Header */}
        <div className="provider-identity-card">
          <div className="identity-avatar-wrap">
            <img src={provider.avatar} alt={provider.name} className="identity-avatar" />
            {provider.verified && (
              <span className="verified-check-pill" title="Certified and Verified Guide">
                <ShieldCheck size={14} />
              </span>
            )}
          </div>

          <div className="identity-info-col">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="provider-profile-name font-heading">{provider.name}</h1>
              <Badge variant="aegean">
                {provider.type === "business" ? "Certified Business" : "Certified Mountain Guide"}
              </Badge>
            </div>
            <div className="provider-profile-role text-taupe-soft">{provider.role}</div>

            <div className="provider-meta-row">
              <span className="flex items-center gap-1 text-taupe-soft">
                <MapPin size={15} /> {provider.hometown}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-taupe-soft">
                <Clock size={15} /> Replies {provider.responseTime}
              </span>
            </div>

            {/* Badges */}
            <div className="provider-badges-list">
              {provider.badges?.map((b, i) => (
                <span key={i} className="badge badge-outline">
                  <Award size={12} /> {b}
                </span>
              ))}
            </div>

            {/* Action Bar */}
            <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleStartChat}
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <MessageSquare size={16} />
                <span>Chat with {provider.name.split(" ")[0]}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bio and Details */}
        <div className="provider-details-grid">
          <div className="provider-about-col">
            <h3 className="section-title font-heading">About {provider.name.split(" ")[0]}</h3>
            <p className="provider-bio-full">{provider.bio}</p>

            <div className="quick-spec-box">
              <div className="spec-row">
                <span className="spec-title flex items-center gap-2">
                  <Award size={16} className="text-aegean-deep" /> Experience:
                </span>
                <span className="spec-ans font-semibold">{provider.experienceYears} Years guiding in Himachal & Himalayas</span>
              </div>
              <div className="spec-row">
                <span className="spec-title flex items-center gap-2">
                  <Languages size={16} className="text-aegean-deep" /> Languages:
                </span>
                <span className="spec-ans">{provider.languages.join(", ")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Their Services */}
        <section className="provider-services-section">
          <h3 className="section-title font-heading">
            Experiences Hosted by {provider.name.split(" ")[0]} ({services.length})
          </h3>
          <div className="services-grid">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
