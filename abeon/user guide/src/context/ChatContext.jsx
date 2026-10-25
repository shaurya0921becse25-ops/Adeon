import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { initialChats, guideAutomatedResponses } from "../data/chats";
import {
  loadChatThreads,
  saveChatThreads,
  subscribeToDataChanges
} from "../data/sharedDataBridge";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [threads, setThreads] = useState(() => {
    return loadChatThreads();
  });

  const [activeThreadId, setActiveThreadId] = useState(() => {
    const list = loadChatThreads();
    return list[0]?.threadId || null;
  });

  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Subscribe to cross-tab / cross-app updates from guide portal (abeon_2)
  useEffect(() => {
    const unsubscribe = subscribeToDataChanges((type, payload) => {
      if (type === "chats" && Array.isArray(payload)) {
        setThreads(payload);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync to shared storage
  useEffect(() => {
    saveChatThreads(threads);
  }, [threads]);

  // Ensure a thread exists for a booking
  const ensureThreadForBooking = (booking) => {
    if (!booking) return null;
    const threadId = booking.id || `thread-${booking.serviceId || Date.now()}`;
    const existing = threads.find((t) => t.threadId === threadId || t.bookingId === booking.id);
    if (existing) {
      setActiveThreadId(existing.threadId);
      return existing;
    }

    const newThread = {
      threadId,
      bookingId: booking.id,
      serviceId: booking.serviceId || "guide-trek-1",
      serviceTitle: booking.serviceTitle || "Himalayan Trek - 2 Days",
      providerId: booking.providerId || "guide-agam",
      providerName: booking.providerName || "Agam",
      providerRole: "Certified Himalayan Mountaineer & Local Culture Guide",
      providerAvatar: booking.providerAvatar || "/agam-profile.jpg",
      userName: booking.traveller?.name || "Sarah Johnson",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0,
      messages: [
        {
          id: "m-" + Date.now(),
          sender: "guide",
          from: "me",
          text: `Namaste ${booking.traveller?.name || "there"}! Thank you for booking ${booking.serviceTitle}. Feel free to ask any questions about packing, gear, meeting points, or weather conditions here!`,
          timestamp: new Date().toISOString(),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "read"
        }
      ]
    };

    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(threadId);
    return newThread;
  };

  // Start chat with guide directly from profile or service page
  const startThreadWithGuide = (service, provider) => {
    const threadId = `thread-guide-${provider?.id || "agam"}-${service?.id || "general"}`;
    const existing = threads.find((t) => t.threadId === threadId);
    if (existing) {
      setActiveThreadId(threadId);
      return existing;
    }

    const newThread = {
      threadId,
      bookingId: `INQ-${Date.now().toString().slice(-6)}`,
      serviceId: service?.id || "guide-trek-1",
      serviceTitle: service?.title || "Himalayan Trek - 2 Days",
      providerId: provider?.id || "guide-agam",
      providerName: provider?.name || "Agam",
      providerRole: provider?.role || "Certified Himalayan Mountaineer & Local Culture Guide",
      providerAvatar: provider?.avatar || "/agam-profile.jpg",
      userName: "Sarah Johnson",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0,
      messages: [
        {
          id: "m-" + Date.now(),
          sender: "guide",
          from: "me",
          text: `Namaste! I am ${provider?.name || "Agam"}. How can I help you plan your mountain experience?`,
          timestamp: new Date().toISOString(),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "read"
        }
      ]
    };

    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(threadId);
    return newThread;
  };

  const sendMessage = (threadId, text) => {
    if (!text || !text.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      from: "them",
      text: text.trim(),
      timestamp: new Date().toISOString(),
      time: timeStr,
      status: "delivered"
    };

    setThreads((prev) => {
      const updated = prev.map((t) => {
        if (t.threadId === threadId) {
          return {
            ...t,
            lastMessageTimestamp: userMessage.timestamp,
            lastMsg: userMessage.text,
            time: timeStr,
            messages: [...t.messages, userMessage]
          };
        }
        return t;
      });
      saveChatThreads(updated);
      return updated;
    });

    // Simulate realistic guide typing & reply if guide portal isn't actively replying
    simulateGuideReply(threadId, text);
  };

  const simulateGuideReply = (threadId, incomingText) => {
    setIsTyping(true);

    const lower = incomingText.toLowerCase();
    let replyText = guideAutomatedResponses.fallback;

    if (lower.includes("bring") || lower.includes("wear") || lower.includes("clothes") || lower.includes("pack") || lower.includes("jacket")) {
      replyText = guideAutomatedResponses.bring;
    } else if (lower.includes("location") || lower.includes("pickup") || lower.includes("where") || lower.includes("meet")) {
      replyText = guideAutomatedResponses.location;
    } else if (lower.includes("guest") || lower.includes("friend") || lower.includes("add") || lower.includes("extra")) {
      replyText = guideAutomatedResponses.guest;
    } else if (lower.includes("park") || lower.includes("car")) {
      replyText = guideAutomatedResponses.parking;
    } else if (lower.includes("time") || lower.includes("hour") || lower.includes("finish") || lower.includes("end")) {
      replyText = guideAutomatedResponses.time;
    }

    const replyDelay = 1800 + Math.random() * 800;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const guideMessage = {
        id: "msg-" + Date.now(),
        sender: "guide",
        from: "me",
        text: replyText,
        timestamp: new Date().toISOString(),
        time: timeStr,
        status: "read"
      };

      setThreads((prev) => {
        const updated = prev.map((t) => {
          if (t.threadId === threadId) {
            return {
              ...t,
              lastMessageTimestamp: guideMessage.timestamp,
              lastMsg: guideMessage.text,
              time: timeStr,
              messages: [...t.messages, guideMessage]
            };
          }
          return t;
        });
        saveChatThreads(updated);
        return updated;
      });
    }, replyDelay);
  };

  const resetChats = () => {
    setThreads(initialChats);
    setActiveThreadId(initialChats[0]?.threadId || null);
    saveChatThreads(initialChats);
  };

  const unreadCount = threads.reduce((acc, t) => acc + (t.unreadCount || 0), 0);

  return (
    <ChatContext.Provider
      value={{
        threads,
        activeThreadId,
        setActiveThreadId,
        sendMessage,
        ensureThreadForBooking,
        startThreadWithGuide,
        isTyping,
        unreadCount,
        resetChats
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
