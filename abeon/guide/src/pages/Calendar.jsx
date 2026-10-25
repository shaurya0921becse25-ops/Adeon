import { useState } from "react";
import { ChevronLeft, ChevronRight, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import Card from "../ui/card";
import { useApp } from "../data/AppContext";

const key = (d, m) => {
  const monthStr = String(m.getMonth() + 1).padStart(2, "0");
  const dayStr = String(d).padStart(2, "0");
  return `${m.getFullYear()}-${monthStr}-${dayStr}`;
};

export default function Calendar() {
  const { calendarStatus, toggleCalendarDay } = useApp();
  const [month, setMonth] = useState(new Date(2026, 9, 1)); // October 2026

  const offset = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
  const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];

  const shift = n => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 className="page-title">Availability Calendar</h1>
          <p className="page-sub">Click on any date to toggle between Open & Blocked. Booked dates are locked.</p>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 13, alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: "#f0f9ff", border: "1px solid #bae6fd" }} /> Available
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: "var(--warn-bg)", border: "1px solid var(--warn)" }} /> Blocked / Rest
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: "var(--brand)", border: "1px solid var(--brand-hover)" }} /> Booked Trip
          </span>
        </div>
      </div>

      <Card>
        <div className="cal-nav">
          <h3 style={{ fontSize: 18, color: "var(--ink)", fontWeight: 800 }}>
            {month.toLocaleString("en", { month: "long", year: "numeric" })}
          </h3>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn btn-outline btn-sm" onClick={() => shift(-1)} title="Previous Month">
              <ChevronLeft size={16} /> Prev
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => shift(1)} title="Next Month">
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="cal-grid" style={{ marginTop: 16 }}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="cal-head" style={{ fontWeight: 700, color: "var(--muted)" }}>
              {d}
            </div>
          ))}
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const dateKey = key(d, month);
            const status = calendarStatus[dateKey] || "available";
            const isBooked = status === "booked";

            return (
              <button
                key={i}
                type="button"
                className={`cal-day ${status}`}
                title={isBooked ? `Day ${d}: Booked trip departure` : `Day ${d}: Click to toggle`}
                onClick={() => toggleCalendarDay(dateKey)}
                style={{
                  cursor: isBooked ? "not-allowed" : "pointer",
                  fontWeight: isBooked ? 800 : 600,
                  position: "relative",
                  transition: "all 0.15s ease",
                }}
              >
                <span>{d}</span>
                {isBooked && (
                  <span style={{ position: "absolute", bottom: 4, fontSize: 9, opacity: 0.9 }}>Trip</span>
                )}
              </button>
            );
          })}
        </div>
      </Card>
    </>
  );
}
