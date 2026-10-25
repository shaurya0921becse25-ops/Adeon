import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, Mail, ArrowRight, Bell, Sparkles, Check } from "lucide-react";
import { getDestinationById } from "../data/destinations";
import { useToast } from "../context/ToastContext";
import { Button } from "../components/ui";
import "./ComingSoon.css";

export const ComingSoon = () => {
  const { city } = useParams();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const destination = getDestinationById(city);
  const cityName = destination ? destination.name : city ? city.charAt(0).toUpperCase() + city.slice(1) : "this destination";

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      addToast("Please enter a valid email address.", "warning");
      return;
    }
    setSubmitted(true);
    addToast(`You're on the list! We'll notify you as soon as ${cityName} launches on Himora.`, "success");
  };

  return (
    <div className="coming-soon-page">
      <div className="container">
        <div className="coming-soon-card">
          {/* Illustration badge */}
          <div className="coming-soon-icon-ring">
            <MapPin size={42} className="text-aegean-deep" />
          </div>

          <span className="badge badge-aegean" style={{ marginBottom: 12 }}>
            Destination In Progress
          </span>

          <h1 className="font-heading coming-soon-title">
            We're not in {cityName} yet
          </h1>

          <p className="coming-soon-desc">
            Our curators are currently on the ground in {cityName} vetting local storytellers, alpine guides, and authentic cooking hosts. We maintain strict standards before opening bookings.
          </p>

          {/* Email Notify Box */}
          <div className="notify-box">
            {submitted ? (
              <div className="notify-success flex items-center justify-center gap-2">
                <Check size={20} className="text-success" />
                <span className="font-semibold text-success">
                  Got it! We'll email you the day {cityName} goes live.
                </span>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="notify-form">
                <div className="flex-1 notify-input-wrap">
                  <Mail size={18} className="notify-mail-icon" />
                  <input
                    type="email"
                    className="notify-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for early access"
                    required
                  />
                </div>
                <Button type="submit" variant="primary">
                  <Bell size={16} />
                  <span>Notify Me</span>
                </Button>
              </form>
            )}
          </div>

          {/* Fallback CTA to Shimla */}
          <div className="explore-shimla-callout">
            <div className="callout-content">
              <Sparkles size={20} className="text-aegean-deep" />
              <div>
                <strong>Want to explore the mountains right now?</strong>
                <p>Shimla has 32 handpicked culinary, heritage, trekking, and safari experiences ready to book today.</p>
              </div>
            </div>
            <Link to="/destination/shimla" className="btn btn-secondary">
              <span>Explore Shimla Instead</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
