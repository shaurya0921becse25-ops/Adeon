import React from "react";
import { NavLink, Link } from "react-router-dom";
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
  { to: "/guide", label: "Dashboard", icon: Home },
  { to: "/guide/services", label: "My Services", icon: Briefcase },
  { to: "/guide/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/guide/bookings", label: "Bookings", icon: BookOpen },
  { to: "/guide/messages", label: "Messages", icon: MessageSquare, badge: 3 },
  { to: "/guide/reviews", label: "Reviews", icon: Star },
  { to: "/guide/earnings", label: "Earnings", icon: Wallet },
  { to: "/guide/profile", label: "Profile", icon: User },
  { to: "/guide/verification", label: "Verification", icon: ShieldCheck },
  { to: "/guide/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { profile } = useApp();

  return (
    <aside className="sidebar guide-sidebar">
      {/* Brand Header */}
      <Link to="/guide" className="sidebar-brand-block" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="logo-icon-wrap">
          <Compass size={22} className="logo-compass" />
        </div>
        <div>
          <div className="logo">Abeon</div>
          <div className="logo-sub">Himachal Host Hub</div>
        </div>
      </Link>

      {/* Nav List */}
      <nav className="nav">
        {links.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/guide"}
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