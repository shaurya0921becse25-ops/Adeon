import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Briefcase,
  CalendarDays,
  BookOpen,
  MessageSquare,
  Star,
  Wallet,
  User,
  Settings,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { useApp } from "../data/AppContext";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/services", label: "My Services", icon: Briefcase },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/bookings", label: "Bookings", icon: BookOpen },
  { to: "/messages", label: "Messages", icon: MessageSquare, badge: 3 },
  { to: "/reviews", label: "Reviews", icon: Star },
  { to: "/earnings", label: "Earnings", icon: Wallet },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/verification", label: "Verification", icon: ShieldCheck },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { profile } = useApp();

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-block">
        <div className="logo-icon-wrap">
          <Compass size={22} className="logo-compass" />
        </div>
        <div>
          <div className="logo">Abeon</div>
          <div className="logo-sub">Himachal Host Hub</div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="nav">
        {links.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            <Icon size={18} className="nav-icon" />
            <span className="nav-text">{label}</span>
            {badge && <span className="nav-badge">{badge}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Host profile block at bottom of sidebar */}
      <div className="sidebar-profile-block">
        <img
          src={profile?.avatar || "/agam-profile.jpg"}
          alt={profile?.name || "Host"}
          className="sidebar-avatar"
        />
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">{profile?.name || "Agam Sharma"}</span>
          <span className="sidebar-user-tag">Himachal Host</span>
        </div>
      </div>
    </aside>
  );
}