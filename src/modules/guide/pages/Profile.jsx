import { useState } from "react";
import { CheckCircle2, Clock, Phone, Mail, MapPin, Award, Shield, Save } from "lucide-react";
import Card from "../ui/card";
import { useApp } from "../data/AppContext";

export default function Profile() {
  const { profile, setProfile, showToast } = useApp();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });

  const setField = (key, value) => setFormData(p => ({ ...p, [key]: value }));

  const handleSave = () => {
    setProfile(formData);
    setEditing(false);
    showToast("Profile information saved successfully!");
  };

  return (
    <>
      <h1 className="page-title">Host Profile & Verification</h1>
      <p className="page-sub">Keep your host details and credentials current for incoming adventurers.</p>

      <div className="grid grid-main" style={{ gridTemplateColumns: "2fr 1fr" }}>
        {/* Profile card */}
        <Card>
          <div className="profile-top">
            <img src={formData.avatar || "/agam-profile.jpg"} alt={formData.name} className="avatar-lg" style={{ objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <div className="flex items-center gap-2">
                <p className="profile-name">{formData.name}</p>
                <span className="badge badge-confirmed">
                  <Shield size={12} /> Verified Pro Guide
                </span>
              </div>
              <p className="profile-role">{formData.role}</p>
            </div>
            {editing ? (
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={handleSave}>
                  <Save size={14} /> Save Changes
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => { setFormData(profile); setEditing(false); }}>
                  Cancel
                </button>
              </div>
            ) : (
              <button className="btn btn-outline" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>

          <h3 className="card-title" style={{ marginTop: 20 }}>About the Host</h3>
          {editing ? (
            <div className="field">
              <label>Bio & Background</label>
              <textarea
                className="textarea"
                rows={4}
                style={{ width: "100%" }}
                value={formData.bio}
                onChange={e => setField("bio", e.target.value)}
              />
            </div>
          ) : (
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-secondary)" }}>{profile.bio}</p>
          )}

          <h3 className="card-title section-gap">Host Information</h3>
          {editing ? (
            <>
              <div className="field">
                <label>Display Name</label>
                <input className="input" value={formData.name} onChange={e => setField("name", e.target.value)} />
              </div>
              <div className="field">
                <label>Professional Title</label>
                <input className="input" value={formData.role} onChange={e => setField("role", e.target.value)} />
              </div>
              <div className="field">
                <label>Phone Number</label>
                <input className="input" value={formData.phone} onChange={e => setField("phone", e.target.value)} />
              </div>
              <div className="field">
                <label>Email Address</label>
                <input className="input" value={formData.email} onChange={e => setField("email", e.target.value)} />
              </div>
              <div className="field">
                <label>Base Location</label>
                <input className="input" value={formData.location} onChange={e => setField("location", e.target.value)} />
              </div>
            </>
          ) : (
            <div className="info-list">
              <div className="row-actions" style={{ alignItems: "center", gap: 10 }}>
                <Phone size={16} color="var(--brand)" /><span className="info-value">{profile.phone}</span>
              </div>
              <div className="row-actions" style={{ alignItems: "center", gap: 10 }}>
                <Mail size={16} color="var(--brand)" /><span className="info-value">{profile.email}</span>
              </div>
              <div className="row-actions" style={{ alignItems: "center", gap: 10 }}>
                <MapPin size={16} color="var(--brand)" /><span className="info-value">{profile.location}</span>
              </div>
            </div>
          )}
        </Card>

        {/* Verification card */}
        <Card>
          <h3 className="card-title">Verification Badges</h3>
          <div className="check-item"><CheckCircle2 size={18} /> Government ID Verified</div>
          <div className="check-item"><CheckCircle2 size={18} /> Himachal Guide License</div>
          <div className="check-item pending"><Clock size={18} /> Utility Bill Proof (Under review)</div>

          <div className="verified-banner" style={{ marginTop: 20 }}>
            Your guide profile is 85% certified. You are eligible for direct bookings and instant guest payouts.
          </div>
        </Card>
      </div>
    </>
  );
}