import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "../ui/card";
import Button from "../ui/button";
import { useApp } from "../data/AppContext";

const steps = ["Basic Details", "Pricing & Capacity", "Availability", "Photos & Publish"];

function BasicDetails({ form, set }) {
  return (
    <>
      <div className="field">
        <label>Service Title</label>
        <input
          className="input"
          placeholder="e.g. Hidden Alpine Waterfall Trek & Wild Camping"
          value={form.title}
          onChange={e => set("title", e.target.value)}
        />
      </div>
      <div className="field">
        <label>Category</label>
        <select className="select" value={form.category} onChange={e => set("category", e.target.value)}>
          <option value="">Select Category</option>
          <option>Trekking & Hiking</option>
          <option>Food & Culture</option>
          <option>Adventure & 4x4 Safari</option>
          <option>Culture & Heritage</option>
          <option>Vehicle Rental</option>
        </select>
      </div>
      <div className="field">
        <label>Detailed Experience Description</label>
        <textarea
          className="textarea"
          rows={4}
          placeholder="Describe the adventure, itinerary, altitude, meals provided and what makes this unique..."
          value={form.description}
          onChange={e => set("description", e.target.value)}
        />
      </div>
    </>
  );
}

function PricingFields({ form, set }) {
  return (
    <>
      <div className="field">
        <label>Price per Traveler (INR)</label>
        <input
          className="input"
          type="number"
          placeholder="e.g. 4500"
          value={form.price}
          onChange={e => set("price", Number(e.target.value))}
        />
      </div>
      <div className="field">
        <label>Pricing Unit</label>
        <select className="select" value={form.unit} onChange={e => set("unit", e.target.value)}>
          <option value="person">Per Person</option>
          <option value="group">Per Group</option>
          <option value="day">Per Day</option>
        </select>
      </div>
      <div className="field">
        <label>Maximum Spots per Departure</label>
        <input
          className="input"
          type="number"
          value={form.spots}
          onChange={e => set("spots", Number(e.target.value))}
        />
      </div>
    </>
  );
}

function Photos({ photos, setPhotos }) {
  const inputRef = React.useRef(null);

  const onFiles = (e) => {
    const files = [...e.target.files];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotos((prev) => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
    // reset so same file can be re-picked
    e.target.value = "";
  };

  const remove = (idx) => setPhotos((prev) => prev.filter((_, i) => i !== idx));

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        style={{ display: "none" }}
        onChange={onFiles}
      />
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          border: "2px dashed var(--line)",
          borderRadius: 14,
          padding: "40px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          background: "var(--surface-subtle)",
          transition: "border-color 0.2s, background 0.2s",
          userSelect: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--brand)";
          e.currentTarget.style.background = "var(--brand-light)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--line)";
          e.currentTarget.style.background = "var(--surface-subtle)";
        }}
      >
        <div style={{ fontSize: 38, marginBottom: 10 }}>📸</div>
        <strong style={{ fontSize: 15, color: "var(--ink)" }}>Click to upload photos</strong>
        <p style={{ fontSize: 13, marginTop: 6, color: "var(--muted)", textAlign: "center" }}>
          Select one or more high-resolution images from your device<br />
          <span style={{ fontSize: 12 }}>JPG, PNG, WEBP supported</span>
        </p>
      </div>

      {photos.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 10, fontWeight: 600 }}>
            {photos.length} photo{photos.length > 1 ? "s" : ""} added — hover to remove
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {photos.map((p, idx) => (
              <div
                key={idx}
                style={{ position: "relative", borderRadius: 10, overflow: "hidden", flexShrink: 0 }}
              >
                <img
                  src={p}
                  alt={`Photo ${idx + 1}`}
                  style={{
                    width: 120,
                    height: 88,
                    objectFit: "cover",
                    display: "block",
                    border: "2px solid var(--line)",
                    borderRadius: 10,
                  }}
                />
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.65)",
                    color: "#fff",
                    fontSize: 13,
                    lineHeight: 1,
                    display: "grid",
                    placeItems: "center",
                    border: "none",
                    cursor: "pointer",
                  }}
                  title="Remove photo"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}


export default function AddService() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addService, updateService } = useApp();
  const editTarget = location.state?.edit;

  const [step, setStep] = useState(0);
  const [days, setDays] = useState(["Fri", "Sat", "Sun"]);
  const [form, setForm] = useState({
    title: editTarget?.title || "Hampta Pass High-Altitude Crossing & Stargazing",
    category: editTarget?.category || "Trekking & Hiking",
    description: editTarget?.description || "A dramatic crossover trek between the verdant Kullu valley and the moonscapes of Lahaul & Spiti. Guided by certified mountaineers.",
    price: editTarget?.price || 6500,
    unit: editTarget?.unit || "person",
    spots: editTarget?.spots || 10,
  });
  const [photos, setPhotos] = useState([
    editTarget?.image || "/himalayan-trek.jpg",
    "/cooking-class.jpg",
    "/jeep-safari.jpg",
  ]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleDay = (d) => {
    setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const handlePublish = () => {
    if (editTarget) {
      updateService(editTarget.id, {
        title: form.title,
        category: form.category || "Trekking & Hiking",
        price: Number(form.price) || 3500,
        unit: form.unit || "person",
        spots: Number(form.spots) || 8,
        image: photos[0] || editTarget.image || "/himalayan-trek.jpg",
      });
    } else {
      addService({
        title: form.title,
        category: form.category || "Trekking & Hiking",
        price: Number(form.price) || 3500,
        unit: form.unit || "person",
        spots: Number(form.spots) || 8,
        status: "Active",
        image: photos[0] || "/himalayan-trek.jpg",
      });
    }
    navigate("/services");
  };

  return (
    <>
      <h1 className="page-title">{editTarget ? "Edit Experience" : "Add New Experience"}</h1>
      <p className="page-sub">
        {editTarget
          ? "Update details, pricing, and availability for this experience."
          : "Create an authentic travel listing for prospective mountain adventurers."}
      </p>
      
      <div className="stepper" style={{ marginTop: 16 }}>
        {steps.map((s, i) => (
          <div key={s} className={"step" + (i <= step ? " done" : "")}>
            <span className="step-num">{i + 1}</span>{s}
          </div>
        ))}
      </div>

      <Card>
        {step === 0 && <BasicDetails form={form} set={set} />}
        {step === 1 && <PricingFields form={form} set={set} />}
        {step === 2 && (
          <div style={{ padding: "12px 0" }}>
            <h4 style={{ marginBottom: 8, color: "var(--ink)" }}>Select Operating Days & Departure Slots</h4>
            <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 16 }}>
              Choose which days of the week this experience is operational:
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => {
                const isSelected = days.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    className={`btn ${isSelected ? "btn-primary" : "btn-outline"}`}
                    style={{ minWidth: 64 }}
                    onClick={() => toggleDay(d)}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
            <div className="field">
              <label>Standard Departure Time</label>
              <input className="input" defaultValue="06:30 AM" style={{ maxWidth: 200 }} />
            </div>
          </div>
        )}
        {step === 3 && <Photos photos={photos} setPhotos={setPhotos} />}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--line-light)" }}>
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)}>Continue to Next Step</Button>
          ) : (
            <Button onClick={handlePublish}>Publish Experience Live</Button>
          )}
        </div>
      </Card>
    </>
  );
}