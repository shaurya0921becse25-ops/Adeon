import { useState } from "react";
import { ChevronRight, Save, ShieldAlert } from "lucide-react";
import Tabs from "../ui/tabs";
import Card from "../ui/card";
import Toggle from "../ui/Toggle";
import { useApp } from "../data/AppContext";

function ToggleRow({ title, hint, on, onChange }) {
  return (
    <div className="setting-row">
      <div className="setting-text">
        {title}
        {hint && <small>{hint}</small>}
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

export default function Settings() {
  const { showToast } = useApp();
  const [tab, setTab] = useState("Account");
  const [prefs, setPrefs] = useState({
    email: true,
    sms: true,
    newBooking: true,
    newReview: true,
    promo: false,
  });
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("INR");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankInfo, setBankInfo] = useState({ bank: "HDFC Bank", acc: "XXXX XXXX 4821", ifsc: "HDFC0001234" });

  const setPref = (key, value) => {
    setPrefs(p => ({ ...p, [key]: value }));
    showToast(`Setting updated: ${key}`);
  };

  return (
    <>
      <h1 className="page-title">Settings & Preferences</h1>
      <p className="page-sub">Manage your security, notifications, and payouts.</p>

      <Tabs tabs={["Account", "Notifications", "Payment", "Preferences"]} value={tab} onChange={setTab} />

      {tab === "Account" && (
        <>
          <Card>
            <h3 className="card-title">Account Credentials & Language</h3>
            <div className="setting-row clickable" onClick={() => setShowPasswordModal(true)}>
              <span>Change Account Password</span>
              <ChevronRight size={18} color="var(--muted)" />
            </div>
            <ToggleRow title="Email Notifications" hint="Receive booking confirmations on your registered email" on={prefs.email} onChange={v => setPref("email", v)} />
            <ToggleRow title="SMS Notifications" hint="Urgent traveler messages dispatched to your phone" on={prefs.sms} onChange={v => setPref("sms", v)} />
            <div className="setting-row">
              <span>Host Dashboard Language</span>
              <select className="select-sm" value={language} onChange={e => { setLanguage(e.target.value); showToast(`Language changed to ${e.target.value}`); }}>
                <option>English</option>
                <option>Hindi</option>
                <option>Himachali (Pahari)</option>
                <option>Punjabi</option>
              </select>
            </div>
          </Card>

          <Card className="danger mt">
            <h3 className="card-title">Account Suspension</h3>
            {!confirmDelete ? (
              <button className="btn btn-danger" onClick={() => setConfirmDelete(true)}>Deactivate Account</button>
            ) : (
              <>
                <p style={{ fontSize: 14, marginBottom: 12 }}>
                  Deactivating will unpublish your active experiences and cancel future bookings. Are you sure?
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-danger" onClick={() => { setConfirmDelete(false); showToast("Account temporarily placed on pause mode", "info"); }}>
                    Confirm Pause
                  </button>
                  <button className="btn btn-ghost" onClick={() => setConfirmDelete(false)}>Cancel</button>
                </div>
              </>
            )}
          </Card>
        </>
      )}

      {tab === "Notifications" && (
        <Card>
          <h3 className="card-title">Notification Channels</h3>
          <ToggleRow title="Instant booking requests" hint="Alert immediately when a traveler books a spot." on={prefs.newBooking} onChange={v => setPref("newBooking", v)} />
          <ToggleRow title="Traveler reviews" hint="Receive an alert when a traveler reviews your trek." on={prefs.newReview} onChange={v => setPref("newReview", v)} />
          <ToggleRow title="Abeon host community digest" hint="Occasional trail safety tips and seasonal market trends." on={prefs.promo} onChange={v => setPref("promo", v)} />
        </Card>
      )}

      {tab === "Payment" && (
        <Card>
          <h3 className="card-title">Direct Payout Account (RTGS / NEFT)</h3>
          <div className="info-list">
            <div><p className="info-label">Receiving Bank</p><p className="info-value">{bankInfo.bank}</p></div>
            <div><p className="info-label">Account Number</p><p className="info-value">{bankInfo.acc}</p></div>
            <div><p className="info-label">IFSC Code</p><p className="info-value">{bankInfo.ifsc}</p></div>
          </div>
          <button className="btn btn-outline section-gap" onClick={() => setShowBankModal(true)}>
            Update Bank Details
          </button>
        </Card>
      )}

      {tab === "Preferences" && (
        <Card>
          <h3 className="card-title">Display & Regional Preferences</h3>
          <div className="setting-row">
            <span>Base Currency</span>
            <select className="select-sm" value={currency} onChange={e => { setCurrency(e.target.value); showToast(`Default currency set to ${e.target.value}`); }}>
              <option value="INR">₹ INR (Indian Rupee)</option>
              <option value="USD">$ USD (US Dollar)</option>
              <option value="EUR">€ EUR (Euro)</option>
            </select>
          </div>
        </Card>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)", display: "grid", placeItems: "center", zIndex: 10000, padding: 20 }}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 16, width: "100%", maxWidth: 420 }}>
            <h3 style={{ marginBottom: 12, fontSize: 18 }}>Change Host Password</h3>
            <div className="field">
              <label>Current Password</label>
              <input className="input" type="password" placeholder="••••••••" />
            </div>
            <div className="field">
              <label>New Password</label>
              <input className="input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimum 8 characters" />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
              <button className="btn btn-ghost" onClick={() => setShowPasswordModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setShowPasswordModal(false); showToast("Password updated successfully!"); }}>
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bank Modal */}
      {showBankModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)", display: "grid", placeItems: "center", zIndex: 10000, padding: 20 }}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 16, width: "100%", maxWidth: 440 }}>
            <h3 style={{ marginBottom: 12, fontSize: 18 }}>Update Payout Bank Details</h3>
            <div className="field">
              <label>Bank Name</label>
              <input className="input" value={bankInfo.bank} onChange={e => setBankInfo({ ...bankInfo, bank: e.target.value })} />
            </div>
            <div className="field">
              <label>Account Number</label>
              <input className="input" value={bankInfo.acc} onChange={e => setBankInfo({ ...bankInfo, acc: e.target.value })} />
            </div>
            <div className="field">
              <label>IFSC Code</label>
              <input className="input" value={bankInfo.ifsc} onChange={e => setBankInfo({ ...bankInfo, ifsc: e.target.value })} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
              <button className="btn btn-ghost" onClick={() => setShowBankModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setShowBankModal(false); showToast("Bank details saved for automated payouts!"); }}>
                Save Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}