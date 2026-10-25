import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Modal, Button } from "./ui";

export const AuthModal = () => {
  const { isSignInModalOpen, closeSignInModal, signIn } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState("Aarav Sen");
  const [email, setEmail] = useState("aarav.sen@example.com");
  const [city, setCity] = useState("New Delhi");
  const [error, setError] = useState("");

  if (!isSignInModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please fill in your name and email address.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    signIn({ name: name.trim(), email: email.trim(), city: city.trim() });
    addToast(`Welcome back, ${name.trim()}! Signed in to Himora.`, "success");
    closeSignInModal();
  };

  return (
    <Modal isOpen={isSignInModalOpen} onClose={closeSignInModal} title="Sign in to Himora">
      <form onSubmit={handleSubmit}>
        <p className="text-taupe-soft" style={{ marginBottom: 20, fontSize: "0.95rem" }}>
          Access your bookings, simulated guide chats, saved wishlist, and verified reviews across devices.
        </p>

        {error && <div className="form-error" style={{ marginBottom: 14 }}>{error}</div>}

        <div className="form-group">
          <label className="form-label" htmlFor="auth-name">Full Name</label>
          <input
            id="auth-name"
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder="e.g. Aarav Sen"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="auth-email">Email Address</label>
          <input
            id="auth-email"
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="e.g. aarav@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="auth-city">Home City</label>
          <input
            id="auth-city"
            type="text"
            className="form-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. New Delhi"
          />
        </div>

        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <Button type="submit" variant="primary" fullWidth size="lg">
            Continue as {name || "Traveller"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
