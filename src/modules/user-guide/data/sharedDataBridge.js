// Shared Data Bridge for Abeon Guide & User Guide
import defaultGuide from "./guide.json";
import defaultServices from "./services.json";
import defaultChats from "./chats.json";

export const STORAGE_KEYS = {
  PROFILE: "abeon_profile",
  SERVICES: "abeon_services",
  CHATS: "abeon_shared_chat_threads",
  BOOKINGS: "abeon_bookings"
};

const CHANNEL_NAME = "abeon_travel_bridge";
let broadcastChannel = null;

if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  } catch (err) {
    console.warn("BroadcastChannel initialization skipped:", err);
  }
}

// Cross-origin iframe bridge manager (for port 5173 <-> 5174 synchronization)
let siblingIframe = null;
let isBridgeReady = false;
const pendingQueue = [];

function getSiblingOrigin() {
  if (typeof window === "undefined") return null;
  const { protocol, hostname, port } = window.location;
  if (hostname !== "localhost" && hostname !== "127.0.0.1") return null;
  const siblingPort = port === "5173" ? "5174" : port === "5174" ? "5173" : null;
  if (!siblingPort) return null;
  return `${protocol}//${hostname}:${siblingPort}`;
}

function initCrossBridge() {
  if (typeof window === "undefined" || siblingIframe) return;

  const siblingOrigin = getSiblingOrigin();
  if (!siblingOrigin) return;

  try {
    const iframe = document.createElement("iframe");
    iframe.src = `${siblingOrigin}/bridge.html`;
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    iframe.style.display = "none";
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;

    iframe.onload = () => {
      isBridgeReady = true;
      while (pendingQueue.length > 0) {
        const item = pendingQueue.shift();
        sendToSiblingIframe(item);
      }
    };

    iframe.onerror = () => {
      // Sibling port might not be running yet; fail silently
      isBridgeReady = false;
    };

    document.body.appendChild(iframe);
    siblingIframe = iframe;

    window.addEventListener("message", (event) => {
      if (!event.data) return;
      if (event.data.source === "abeon_bridge_ready") {
        isBridgeReady = true;
        while (pendingQueue.length > 0) {
          const item = pendingQueue.shift();
          sendToSiblingIframe(item);
        }
      } else if (event.data.source === "abeon_bridge_initial_reply" && event.data.data) {
        const dump = event.data.data;
        Object.entries(dump).forEach(([key, val]) => {
          if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify(val));
          }
        });
      }
    });
  } catch (err) {
    console.warn("[Bridge] Init cross-bridge skipped:", err);
  }
}

function sendToSiblingIframe(data) {
  if (siblingIframe && siblingIframe.contentWindow && isBridgeReady) {
    try {
      siblingIframe.contentWindow.postMessage(
        { source: "abeon_bridge_sync", ...data },
        "*"
      );
    } catch (e) {
      console.warn("[Bridge] postMessage error:", e);
    }
  } else {
    pendingQueue.push(data);
  }
}

// Auto-initialize bridge once DOM is ready
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCrossBridge);
  } else {
    setTimeout(initCrossBridge, 100);
  }
}

/**
 * Broadcast event across tabs/apps and cross-origin sibling
 */
export function broadcastDataChange(type, payload) {
  // 1. Same-origin BroadcastChannel
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type, payload, timestamp: Date.now() });
    } catch (e) {
      console.warn("Broadcast failed:", e);
    }
  }

  // 2. Same-origin CustomEvent
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("abeon_local_sync", { detail: { type, payload } })
    );

    // 3. Cross-origin sibling iframe bridge
    let storageKey = null;
    if (type === "profile") storageKey = STORAGE_KEYS.PROFILE;
    else if (type === "services") storageKey = STORAGE_KEYS.SERVICES;
    else if (type === "chats") storageKey = STORAGE_KEYS.CHATS;
    else if (type === "bookings") storageKey = STORAGE_KEYS.BOOKINGS;
    else if (type === "service_selected") storageKey = "abeon_selected_service";

    if (storageKey) {
      sendToSiblingIframe({
        action: "syncItem",
        key: storageKey,
        value: payload,
        type,
        payload
      });
    }

    // 4. Also check window.opener if opened from another window
    if (window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage(
          { source: "abeon_bridge_sync", action: "syncItem", key: storageKey, value: payload, type, payload },
          "*"
        );
      } catch (err) {}
    }
  }
}

/**
 * Subscribe to cross-tab / cross-app updates
 */
export function subscribeToDataChanges(callback) {
  if (typeof window === "undefined") return () => {};

  const handleBroadcast = (event) => {
    if (event.data && callback) {
      callback(event.data.type, event.data.payload);
    }
  };

  const handleLocal = (event) => {
    if (event.detail && callback) {
      callback(event.detail.type, event.detail.payload);
    }
  };

  const handleStorage = (event) => {
    if (!callback) return;
    if (event.key === STORAGE_KEYS.CHATS) {
      try {
        callback("chats", JSON.parse(event.newValue));
      } catch (e) {}
    } else if (event.key === STORAGE_KEYS.SERVICES) {
      try {
        callback("services", JSON.parse(event.newValue));
      } catch (e) {}
    } else if (event.key === STORAGE_KEYS.PROFILE) {
      try {
        callback("profile", JSON.parse(event.newValue));
      } catch (e) {}
    } else if (event.key === STORAGE_KEYS.BOOKINGS) {
      try {
        callback("bookings", JSON.parse(event.newValue));
      } catch (e) {}
    } else if (event.key === "abeon_selected_service") {
      try {
        callback("service_selected", JSON.parse(event.newValue));
      } catch (e) {}
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener("message", handleBroadcast);
  }
  window.addEventListener("abeon_local_sync", handleLocal);
  window.addEventListener("storage", handleStorage);

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener("message", handleBroadcast);
    }
    window.removeEventListener("abeon_local_sync", handleLocal);
    window.removeEventListener("storage", handleStorage);
  };
}

/**
 * Load Guide Profile with localStorage override and JSON fallback
 */
export function loadGuideProfile() {
  if (typeof window === "undefined") return defaultGuide;
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      return { ...defaultGuide, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error("Error loading profile:", e);
  }
  return defaultGuide;
}

export function saveGuideProfile(profile) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    broadcastDataChange("profile", profile);
  } catch (e) {
    console.error("Error saving profile:", e);
  }
}

/**
 * Load Services from JSON merged with saved services
 */
export function loadGuideServices() {
  if (typeof window === "undefined") return defaultServices;
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((item) => adaptServiceWithFallbacks(item));
    }
  } catch (e) {
    console.error("Error loading services:", e);
  }
  return defaultServices.map((item) => adaptServiceWithFallbacks(item));
}

export function saveGuideServices(services) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    broadcastDataChange("services", services);
  } catch (e) {
    console.error("Error saving services:", e);
  }
}

/**
 * Load Chat Threads
 */
export function loadChatThreads() {
  if (typeof window === "undefined") return defaultChats;
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CHATS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error loading chats:", e);
  }
  return defaultChats;
}

export function saveChatThreads(threads) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(threads));
    broadcastDataChange("chats", threads);
  } catch (e) {
    console.error("Error saving chats:", e);
  }
}

/**
 * Adapter ensuring services have all fields required by user guide
 * while strictly preserving original experiences and images
 */
export function adaptServiceWithFallbacks(service) {
  const guide = defaultGuide;
  const image = service.image || service.coverImage || "/himalayan-trek.jpg";

  return {
    id: service.id ? String(service.id) : `serv-${Date.now()}`,
    legacyId: service.legacyId || service.id,
    title: service.title || "Mountain Experience with Local Guide",
    category: service.category || "Trekking & Hiking",
    categoryId: service.categoryId || "trekking",
    providerId: service.providerId || service.guideId || "guide-agam",
    providerName: service.providerName || guide.name,
    price: service.price || 1500,
    priceUnit: service.priceUnit || (service.unit ? `per ${service.unit}` : "per person"),
    unit: service.unit || "person",
    spots: service.spots ?? 10,
    status: service.status || "Active",
    image: image,
    coverImage: image,
    images: service.images && service.images.length ? service.images : [image, "/hero.jpg"],
    duration: service.duration || "4 hours",
    durationCategory: service.durationCategory || "half_day",
    groupSize: service.groupSize || `Max ${service.spots || 10} guests`,
    maxGuests: service.maxGuests || service.spots || 10,
    languages: service.languages || guide.languages || ["English", "Hindi"],
    difficulty: service.difficulty || "Moderate",
    rating: service.rating || 4.9,
    reviewCount: service.reviewCount || 35,
    freeCancellation: service.freeCancellation ?? true,
    instantConfirmation: service.instantConfirmation ?? true,
    featured: service.featured ?? true,
    description:
      service.description ||
      `Join certified local guide ${guide.name} for an authentic mountain experience in Himachal. Explore offbeat trails, take in panoramic views, and enjoy warm local hospitality.`,
    highlights: service.highlights || [
      `Curated and personally led by ${guide.name} (${guide.experienceYears} years experience)`,
      "High quality safety gear, local tea, and authentic regional insights",
      "Small group setting with breathtaking scenic viewpoints"
    ],
    includes: service.includes || [
      "Certified local mountain guide",
      "Safety gear & first aid kit",
      "Traditional mountain refreshments & herbal tea"
    ],
    excludes: service.excludes || ["Personal transport to meeting point", "Gratuities"],
    itinerary: service.itinerary || [
      { time: "Start", title: "Briefing & Welcome", desc: `Meet ${guide.name} at the designated point for an equipment and safety briefing.` },
      { time: "Midway", title: "Main Experience & Trail", desc: "Enjoy scenic viewpoints, photo stops, and guided commentary." },
      { time: "Wrap-up", title: "Refreshments & Q&A", desc: "Relax with local mountain tea and final reflections." }
    ],
    meetingPoint: service.meetingPoint || `${guide.location || "Old Manali / Shimla Ridge Point"}`,
    cancellationPolicy: service.cancellationPolicy || "Free cancellation up to 24 hours before the experience starts.",
    faqs: service.faqs || [
      { q: "What should I wear?", a: "Wear comfortable walking shoes, sunglasses, and a light windproof jacket." },
      { q: "Can I bring children?", a: "Yes, children accompanied by an adult are welcome." }
    ],
    availableTimeSlots: service.availableTimeSlots || ["09:00 AM", "02:00 PM"]
  };
}
