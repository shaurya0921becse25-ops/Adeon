import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  bookings as initialBookings,
  earnings as initialEarnings,
  payouts as initialPayouts,
  reviews as initialReviews,
  ratingBreakdown as initialBreakdown,
} from "./mock";
import {
  broadcastDataChange,
  loadGuideProfile,
  loadGuideServices,
  subscribeToDataChanges
} from "./sharedDataBridge";

const AppContext = createContext();

export function AppProvider({ children }) {
  // Services initialized with full shared services
  const [services, setServices] = useState(() => {
    return loadGuideServices();
  });

  // Bookings
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("abeon_bookings");
    return saved ? JSON.parse(saved) : initialBookings;
  });

  // Host Profile
  const [profile, setProfile] = useState(() => {
    return loadGuideProfile();
  });

  // Reviews
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("abeon_reviews");
    return saved ? JSON.parse(saved) : initialReviews;
  });

  // Calendar blocked / booked status
  const [calendarStatus, setCalendarStatus] = useState(() => {
    const saved = localStorage.getItem("abeon_calendar");
    return saved ? JSON.parse(saved) : {
      "2026-10-16": "booked",
      "2026-10-20": "booked",
      "2026-10-22": "booked",
      "2026-10-24": "blocked",
      "2026-10-25": "blocked",
    };
  });

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Booking Request", desc: "Sarah Johnson booked Himalayan Trek (2 days)", time: "10 mins ago", read: false },
    { id: 2, title: "Payout Dispatched", desc: "₹12,000 has been transferred to your HDFC account", time: "2 hours ago", read: false },
    { id: 3, title: "New 5★ Review", desc: "Lisa Carter left a glowing review for Himalayan Trek", time: "Yesterday", read: true },
  ]);

  // Global Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Live selected experience from User Guide
  const [selectedService, setSelectedService] = useState(() => {
    try {
      const saved = localStorage.getItem("abeon_selected_service");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Flag to prevent broadcast loopback on external incoming data
  const isExternalSync = useRef(false);

  // Subscribe to real-time incoming changes from User Guide (e.g. new bookings, profile edits, selected service)
  useEffect(() => {
    const unsub = subscribeToDataChanges((type, payload) => {
      if (type === "bookings" && Array.isArray(payload)) {
        isExternalSync.current = true;
        setBookings(payload);
      } else if (type === "profile" && payload) {
        isExternalSync.current = true;
        setProfile((prev) => ({ ...prev, ...payload }));
      } else if (type === "services" && Array.isArray(payload)) {
        isExternalSync.current = true;
        setServices(payload);
      } else if (type === "service_selected" && payload) {
        setSelectedService(payload);
        showToast(`Traveler exploring: "${payload.title}"`, "info");
      }
    });
    return () => unsub();
  }, []);

  // Sync to localStorage and broadcast to user guide
  useEffect(() => {
    if (isExternalSync.current) return;
    localStorage.setItem("abeon_services", JSON.stringify(services));
    broadcastDataChange("services", services);
  }, [services]);

  useEffect(() => {
    if (isExternalSync.current) return;
    localStorage.setItem("abeon_bookings", JSON.stringify(bookings));
    broadcastDataChange("bookings", bookings);
  }, [bookings]);

  useEffect(() => {
    if (isExternalSync.current) return;
    localStorage.setItem("abeon_profile", JSON.stringify(profile));
    broadcastDataChange("profile", profile);
  }, [profile]);

  useEffect(() => {
    if (isExternalSync.current) {
      isExternalSync.current = false;
    }
  });

  useEffect(() => {
    localStorage.setItem("abeon_reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem("abeon_calendar", JSON.stringify(calendarStatus));
  }, [calendarStatus]);

  // Service actions
  const addService = (newService) => {
    const id = `guide-serv-${Date.now()}`;
    const created = {
      id,
      legacyId: Date.now(),
      guideId: profile?.id || "guide-agam",
      providerId: profile?.id || "guide-agam",
      providerName: profile?.name || "Agam",
      spots: 10,
      status: "Active",
      image: newService.image || "/himalayan-trek.jpg",
      coverImage: newService.image || "/himalayan-trek.jpg",
      unit: "person",
      priceUnit: "per person",
      rating: 5.0,
      reviewCount: 0,
      ...newService,
    };
    setServices((prev) => [created, ...prev]);
    showToast(`Experience "${created.title}" successfully published!`);
    return created;
  };

  const updateService = (id, updatedFields) => {
    setServices((prev) =>
      prev.map((s) => (String(s.id) === String(id) ? { ...s, ...updatedFields } : s))
    );
    showToast("Service listing updated");
  };

  const deleteService = (id) => {
    setServices((prev) => prev.filter((s) => String(s.id) !== String(id)));
    showToast("Listing deleted", "info");
  };

  // Booking actions
  const updateBookingStatus = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (String(b.id) === String(id) ? { ...b, status: newStatus } : b))
    );
    showToast(`Booking marked as ${newStatus}`);
  };

  // Review actions
  const replyToReview = (id, replyText) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reply: replyText } : r))
    );
    showToast("Reply published to traveler");
  };

  // Calendar actions
  const toggleCalendarDay = (dateStr) => {
    setCalendarStatus((prev) => {
      if (prev[dateStr] === "booked") return prev;
      const next = { ...prev };
      if (next[dateStr] === "blocked") {
        delete next[dateStr];
        showToast(`Date ${dateStr} is now Available`);
      } else {
        next[dateStr] = "blocked";
        showToast(`Date ${dateStr} is now Blocked`, "info");
      }
      return next;
    });
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("All notifications marked as read");
  };

  return (
    <AppContext.Provider
      value={{
        services,
        addService,
        updateService,
        deleteService,
        bookings,
        updateBookingStatus,
        profile,
        setProfile,
        reviews,
        replyToReview,
        calendarStatus,
        toggleCalendarDay,
        earnings: initialEarnings,
        payouts: initialPayouts,
        ratingBreakdown: initialBreakdown,
        notifications,
        clearNotification,
        markAllNotificationsRead,
        selectedService,
        setSelectedService,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
