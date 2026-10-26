import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "../ui/card";
import Badge from "../ui/badge";
import { useApp } from "../data/AppContext";

export default function BookingDetails() {
  const { id } = useParams();
  const { bookings, updateBookingStatus } = useApp();
  const booking = bookings.find((b) => String(b.id) === String(id));

  const [msgs, setMsgs] = useState([
    { from: "them", text: "Hi Agam! Looking forward to the trip. Any specific gear recommendations for the trail?" },
    { from: "me", text: "Yes! High-ankle trekking boots, wool socks, and a lightweight rain poncho are essential." },
  ]);
  const [text, setText] = useState("");
  const chatEnd = useRef(null);

  // Scroll chat to the newest message
  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  if (!booking) {
    return (
      <>
        <Link to="/guide/bookings" className="back-link">← Back to bookings</Link>
        <Card><p className="empty">Booking record not found.</p></Card>
      </>
    );
  }

  const send = () => {
    if (!text.trim()) return;
    setMsgs([...msgs, { from: "me", text }]);
    setText("");
  };

  return (
    <>
      <Link to="/guide/bookings" className="back-link">← Back to bookings</Link>

      <Card>
        <div className="detail-header">
          <img
            src={booking.image || "/himalayan-trek.jpg"}
            alt={booking.service}
            className="row-thumb"
            style={{ width: 100, height: 72, objectFit: "cover", borderRadius: 10 }}
            onError={(e) => { e.currentTarget.src = "/himalayan-trek.jpg"; }}
          />
          <div className="row-info">
            <p className="row-title" style={{ fontSize: 18 }}>{booking.service}</p>
            <p className="row-meta">
              ₹{booking.amount.toLocaleString("en-IN")} · {booking.travelers} traveler(s) · Reference ID #{booking.id}
            </p>
          </div>
          <Badge status={booking.status} />
        </div>
      </Card>

      <div className="grid grid-2 mt">
        {/* Left: traveler info */}
        <Card>
          <h3 className="card-title">Traveler Information</h3>
          <div className="info-list">
            <div><p className="info-label">Name</p><p className="info-value">{booking.traveler}</p></div>
            <div><p className="info-label">Email</p><p className="info-value">{booking.email}</p></div>
            <div><p className="info-label">Phone</p><p className="info-value">{booking.phone}</p></div>
            <div><p className="info-label">Scheduled Date & Time</p><p className="info-value">{booking.date}, {booking.time}</p></div>
            <div><p className="info-label">Special Dietary & Health Requests</p><p className="info-value">{booking.requests || "None specified"}</p></div>
            <div><p className="info-label">Total Booking Amount Paid</p><p className="info-value">₹{booking.amount.toLocaleString("en-IN")}</p></div>
          </div>

          {booking.status === "Incoming" && (
            <div className="detail-actions" style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button className="btn btn-primary" onClick={() => updateBookingStatus(booking.id, "Confirmed")}>Accept Request</button>
              <button className="btn btn-outline" onClick={() => updateBookingStatus(booking.id, "Cancelled")}>Decline</button>
            </div>
          )}

          {booking.status === "Confirmed" && (
            <div className="detail-actions" style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button className="btn btn-primary" onClick={() => updateBookingStatus(booking.id, "Completed")}>Mark Departure Completed</button>
              <button className="btn btn-outline" onClick={() => updateBookingStatus(booking.id, "Cancelled")}>Cancel Reservation</button>
            </div>
          )}
        </Card>

        {/* Right: chat */}
        <Card>
          <h3 className="card-title">Chat with {booking.traveler.split(" ")[0]}</h3>
          <div className="chat">
            {msgs.map((m, i) => (
              <div key={i} className={"bubble" + (m.from === "me" ? " me" : "")}>{m.text}</div>
            ))}
            <div ref={chatEnd} />
          </div>
          <div className="chat-input">
            <input
              className="input"
              placeholder="Type a message..."
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
            />
            <button className="btn btn-primary" onClick={send}>Send</button>
          </div>
        </Card>
      </div>
    </>
  );
}