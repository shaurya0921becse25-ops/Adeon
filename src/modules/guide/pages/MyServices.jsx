import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Trash2, Eye, Edit3, MapPin } from "lucide-react";
import Tabs from "../ui/tabs";
import Card from "../ui/card";
import Badge from "../ui/badge";
import { useApp } from "../data/AppContext";

export default function MyServices() {
  const { services, deleteService, showToast, selectedService } = useApp();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [tab, setTab] = useState("All");
  const [q, setQ] = useState(initialQuery);
  const [previewService, setPreviewService] = useState(null);

  const list = services.filter((s) =>
    (tab === "All" || s.status === tab) &&
    s.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="page-title">My Experiences & Services</h1>
          <p className="page-sub">Create, edit, and curate your offerings for travelers.</p>
        </div>
        <Link to="/services/new" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
          <Plus size={16} /> Add New Experience
        </Link>
      </div>

      <input
        className="input"
        style={{ width: "100%", marginBottom: 16 }}
        placeholder="Search experiences by title or category..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <Tabs tabs={["All", "Active", "Draft", "Expired"]} value={tab} onChange={setTab} />

      <div className="services-showcase-grid">
        {list.map((s) => {
          const isSelected =
            selectedService &&
            (String(s.id) === String(selectedService.id) || s.title === selectedService.title);

          return (
            <Card
              key={s.id}
              className="service-card-item"
              style={
                isSelected
                  ? {
                      borderColor: "#2563eb",
                      boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.3)"
                    }
                  : {}
              }
            >
              <div className="service-card-thumb">
                <img src={s.image} alt={s.title} />
                <div className="service-card-badges">
                  <Badge status={s.status} />
                  <span className="category-pill">{s.category}</span>
                  {isSelected && (
                    <span
                      style={{
                        background: "#2563eb",
                        color: "#fff",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 10,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4
                      }}
                    >
                      Selected in User Guide
                    </span>
                  )}
                </div>
              </div>
              <div className="service-card-content">
              <h3 className="service-card-title">{s.title}</h3>
              <p className="service-card-meta">
                Available spots: <strong>{s.spots} travelers</strong>
              </p>
              <div className="service-card-footer">
                <div className="price-tag">
                  <span className="price-currency">₹</span>
                  <span className="price-num">{s.price.toLocaleString("en-IN")}</span>
                  <span className="price-unit">/{s.unit}</span>
                </div>
                <div className="card-actions" style={{ display: "flex", gap: 6 }}>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setPreviewService(s)}
                    title="Preview Traveler View"
                  >
                    <Eye size={13} /> Preview
                  </button>
                  <Link
                    to="/services/new"
                    state={{ edit: s }}
                    className="btn btn-outline btn-sm"
                    title="Edit Service"
                  >
                    <Edit3 size={13} />
                  </Link>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: "var(--danger)" }}
                    onClick={() => {
                      if (window.confirm(`Delete listing "${s.title}"?`)) {
                        deleteService(s.id);
                      }
                    }}
                    title="Delete Listing"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>

      {list.length === 0 && (
        <Card>
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p className="empty" style={{ fontSize: 16, marginBottom: 8 }}>
              No experiences found matching your filters.
            </p>
            <Link to="/services/new" className="btn btn-primary" style={{ marginTop: 12 }}>
              Create Your First Service
            </Link>
          </div>
        </Card>
      )}

      {/* Modal Preview */}
      {previewService && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            display: "grid",
            placeItems: "center",
            zIndex: 10000,
            padding: 20,
          }}
          onClick={() => setPreviewService(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 20,
              maxWidth: 580,
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: "relative", height: 240 }}>
              <img src={previewService.image} alt={previewService.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button
                onClick={() => setPreviewService(null)}
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: 24 }}>
              <span className="category-label">{previewService.category}</span>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: "var(--ink)" }}>{previewService.title}</h2>
              <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 13, color: "var(--muted)" }}>
                <span>Group Size: Up to {previewService.spots} people</span>
                <span>Pricing: ₹{previewService.price.toLocaleString("en-IN")}/{previewService.unit}</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-secondary)", marginTop: 16 }}>
                Embark on this verified Himalayan expedition led by certified local experts. Includes safety briefings, local lore, and authentic cultural immersion.
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24, gap: 10 }}>
                <button className="btn btn-outline" onClick={() => setPreviewService(null)}>Close Preview</button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    showToast("Simulated traveler booking flow!");
                    setPreviewService(null);
                  }}
                >
                  Book as Traveler (Preview)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}