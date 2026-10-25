import React, { useState } from "react";
import { Search, Bell, ChevronDown, X, Sparkles, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../data/AppContext";
import { useAuth } from "../../../context/AuthContext";

export default function Topbar() {
  const { profile, notifications, clearNotification, markAllNotificationsRead } =
    useApp();
  const { logout } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/guide/services?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="topbar">
      <div className="search">
        <Search size={18} className="search-icon" />
        <input
          placeholder="Search experiences, bookings or travelers (Press Enter)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      <div className="topbar-right">
        {/* Quick status pill */}
        <div className="topbar-host-badge" title="Live status">
          <span className="live-dot pulse"></span>
          <span className="badge-text">Bookings Open</span>
        </div>

        {/* Notifications */}
        <div className="notif-wrapper">
          <button
            className="icon-btn"
            title="Notifications"
            onClick={() => setShowNotifs(!showNotifs)}
          >
            <Bell size={19} />
            {unreadCount > 0 && <span className="notif-dot" />}
          </button>

          {showNotifs && (
            <div className="notif-dropdown">
              <div className="notif-dropdown-header">
                <strong>Notifications</strong>
                {unreadCount > 0 && (
                  <button
                    className="link-btn-text"
                    onClick={markAllNotificationsRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <p className="notif-empty">No new notifications</p>
              ) : (
                <div className="notif-list">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notif-item ${n.read ? "read" : "unread"}`}
                    >
                      <div className="notif-item-header">
                        <h5>{n.title}</h5>
                        <button
                          onClick={() => clearNotification(n.id)}
                          className="notif-dismiss"
                          title="Dismiss"
                        >
                          <X size={13} />
                        </button>
                      </div>
                      <p className="notif-desc">{n.desc}</p>
                      <span className="notif-time">{n.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Badge */}
        <Link to="/guide/profile" className="user-profile-badge">
          <img
            src={profile.avatar || "/agam-profile.jpg"}
            alt={profile.name}
            className="avatar"
          />
          <div className="user-info-text">
            <span className="user-name">{profile.name}</span>
            <span className="user-status">
              {profile.role ? profile.role.split(" ")[0] + " Host" : "Host"}
            </span>
          </div>
          <ChevronDown size={14} className="chevron" />
        </Link>

        {/* Guide Logout Button */}
        <button
          type="button"
          title="Log out"
          onClick={() => {
            if (logout) logout();
            navigate("/signin");
          }}
          style={{
            marginLeft: "8px",
            color: "#dc2626",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "7px 14px",
            borderRadius: "8px",
            border: "1px solid #fecaca",
            background: "#fef2f2",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          <LogOut size={14} />
          <span>Log out</span>
        </button>
      </div>
    </header>
  );
}