import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Users, Check, X, Eye } from "lucide-react";
import Tabs from "../ui/tabs";
import Card from "../ui/card";
import Badge from "../ui/badge";
import { useApp } from "../data/AppContext";

const TABS = ["Incoming", "Confirmed", "Completed", "Cancelled"];

export default function Bookings() {
  const { bookings, updateBookingStatus } = useApp();
  const [tab, setTab] = useState("Incoming");

  const visible = bookings.filter((b) => b.status === tab);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <h1 className="page-title">Bookings Management</h1>
          <p className="page-sub">Review incoming requests and manage verified departures.</p>
        </div>
        <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
          {visible.length} {tab.toLowerCase()} booking{visible.length === 1 ? "" : "s"}
        </span>
      </div>

      <Tabs tabs={TABS} value={tab} onChange={setTab} />

      <div className="bookings-list" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {visible.length === 0 && (
          <Card>
            <div style={{ padding: "44px 0", textAlign: "center" }}>
              <p className="empty" style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--ink-secondary)" }}>
                No {tab.toLowerCase()} bookings found.
              </p>
              <p style={{ color: "var(--ink-muted)", fontSize: 13 }}>
                When travelers book or update requests in this category, they will show up here automatically.
              </p>
            </div>
          </Card>
        )}

        {visible.map((b) => (
          <div className="booking-card-row" key={b.id}>
            <div className="booking-thumb-container">
              <img
                src={b.image || "/himalayan-trek.jpg"}
                alt={b.service}
                className="booking-thumb-img"
                onError={(e) => { e.currentTarget.src = "/himalayan-trek.jpg"; }}
              />
              <span className="booking-id-tag">#{b.id}</span>
            </div>

            <div className="booking-details-content">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <h3 className="booking-service-title">{b.service}</h3>
                <span className="booking-price-badge">₹{b.amount.toLocaleString("en-IN")}</span>
              </div>

              <div className="booking-meta-line">
                <span className="booking-traveler-name">
                  <strong>{b.traveler}</strong>
                </span>
                <span className="meta-separator">·</span>
                <span className="booking-meta-item">
                  <Users size={14} /> {b.travelers} traveler{b.travelers > 1 ? "s" : ""}
                </span>
                <span className="meta-separator">·</span>
                <span className="booking-meta-item">
                  <CalendarDays size={14} /> {b.date} at {b.time}
                </span>
              </div>

              {b.requests && (
                <div className="booking-request-note">
                  <span className="note-label">Traveler Note:</span> "{b.requests}"
                </div>
              )}

              <div className="booking-card-footer">
                <Link
                  to={`/guide/bookings/${b.id}`}
                  className="link-btn-pill"
                >
                  <Eye size={13} /> View Full Traveler Dossier
                </Link>

                <div className="booking-action-buttons">
                  {b.status === "Incoming" ? (
                    <>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => updateBookingStatus(b.id, "Confirmed")}
                      >
                        <Check size={14} /> Accept Request
                      </button>
                      <button
                        className="btn btn-outline btn-sm btn-decline-custom"
                        onClick={() => updateBookingStatus(b.id, "Cancelled")}
                      >
                        <X size={14} /> Decline
                      </button>
                    </>
                  ) : b.status === "Confirmed" ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Badge status={b.status} />
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => updateBookingStatus(b.id, "Completed")}
                      >
                        Mark Trip Done
                      </button>
                    </div>
                  ) : (
                    <Badge status={b.status} />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}