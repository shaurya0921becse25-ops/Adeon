import React, { createContext, useContext, useState, useEffect } from "react";
import { initialBookings } from "../data/bookings";
import { broadcastDataChange, subscribeToDataChanges } from "../data/sharedDataBridge";

const BookingContext = createContext();
const BOOKINGS_STORAGE_KEY = "himora_bookings_data";

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState(() => {
    try {
      const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialBookings;
    } catch {
      return initialBookings;
    }
  });

  // Save bookings to local storage and sync
  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }, [bookings]);

  // Listen to status updates from guide dashboard in abeon_2
  useEffect(() => {
    const unsubscribe = subscribeToDataChanges((type, payload) => {
      if (type === "bookings" && Array.isArray(payload)) {
        setBookings((current) =>
          current.map((b) => {
            const match = payload.find(
              (gb) => String(gb.id) === String(b.id) || gb.service === b.serviceTitle
            );
            if (match && match.status) {
              return { ...b, status: match.status };
            }
            return b;
          })
        );
      }
    });
    return () => unsubscribe();
  }, []);

  const addBooking = (bookingData) => {
    const isInstant = bookingData.instantConfirmation !== false;
    const initialStatus = isInstant ? "Confirmed" : "Incoming";
    const refCode = "HMR-" + Math.floor(100000 + Math.random() * 900000);

    const newBooking = {
      ...bookingData,
      id: refCode,
      status: initialStatus,
      createdAt: new Date().toISOString(),
      hasReview: false
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Sync to abeon_2 guide bookings
    try {
      const savedGuideBookings = localStorage.getItem("abeon_bookings");
      const guideBookings = savedGuideBookings ? JSON.parse(savedGuideBookings) : [];
      const mappedGuideBooking = {
        id: refCode,
        service: newBooking.serviceTitle,
        traveler: newBooking.traveller?.name || "Sarah Johnson",
        email: newBooking.traveller?.email || "sarah.johnson@gmail.com",
        phone: newBooking.traveller?.phone || "+91 98765 43210",
        travelers: newBooking.guests || 1,
        date: newBooking.date || "Oct 24, 2026",
        time: newBooking.timeSlot || "08:00 AM",
        amount: newBooking.totalPrice || 1500,
        status: initialStatus,
        requests: newBooking.traveller?.specialRequests || "None.",
        image: newBooking.coverImage || "/himalayan-trek.jpg"
      };
      const updatedGuideList = [mappedGuideBooking, ...guideBookings];
      localStorage.setItem("abeon_bookings", JSON.stringify(updatedGuideList));
      broadcastDataChange("bookings", updatedGuideList);
    } catch (err) {
      console.warn("Could not sync booking to guide store:", err);
    }

    return newBooking;
  };

  const cancelBooking = (bookingId, reason = "Traveller requested cancellation") => {
    setBookings((prev) => {
      const updated = prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: "Cancelled", cancellationReason: reason }
          : b
      );

      // Sync cancellation to guide store
      try {
        const saved = localStorage.getItem("abeon_bookings");
        if (saved) {
          const list = JSON.parse(saved).map((gb) =>
            String(gb.id) === String(bookingId) ? { ...gb, status: "Cancelled" } : gb
          );
          localStorage.setItem("abeon_bookings", JSON.stringify(list));
          broadcastDataChange("bookings", list);
        }
      } catch (err) {
        console.warn("Sync cancellation error:", err);
      }

      return updated;
    });
  };

  const rescheduleBooking = (bookingId, newDate, newTimeSlot) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, date: newDate, timeSlot: newTimeSlot || b.timeSlot }
          : b
      )
    );
  };

  // Demo simulation button: moves booking to Completed and triggers review prompt
  const simulateMarkCompleted = (bookingId) => {
    setBookings((prev) => {
      const updated = prev.map((b) => (b.id === bookingId ? { ...b, status: "Completed" } : b));
      try {
        const saved = localStorage.getItem("abeon_bookings");
        if (saved) {
          const list = JSON.parse(saved).map((gb) =>
            String(gb.id) === String(bookingId) ? { ...gb, status: "Completed" } : gb
          );
          localStorage.setItem("abeon_bookings", JSON.stringify(list));
          broadcastDataChange("bookings", list);
        }
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const markBookingReviewed = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, hasReview: true } : b))
    );
  };

  const hasBookingForService = (serviceId) => {
    return bookings.some(
      (b) => b.serviceId === serviceId && (b.status === "Confirmed" || b.status === "Completed")
    );
  };

  const getBookingById = (bookingId) => bookings.find((b) => b.id === bookingId);

  const resetBookings = () => {
    setBookings(initialBookings);
    localStorage.removeItem(BOOKINGS_STORAGE_KEY);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        cancelBooking,
        rescheduleBooking,
        simulateMarkCompleted,
        markBookingReviewed,
        hasBookingForService,
        getBookingById,
        resetBookings
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
