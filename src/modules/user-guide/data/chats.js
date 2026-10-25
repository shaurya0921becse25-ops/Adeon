import defaultChats from "./chats.json";
import { loadChatThreads } from "./sharedDataBridge";

export const initialChats = [
  ...defaultChats,
  {
    threadId: "HMR-882194",
    bookingId: "HMR-882194",
    serviceId: "cook-1",
    serviceTitle: "Authentic Himachali Dham Feast Workshop",
    providerId: "p1",
    providerName: "Sunil Verma",
    providerRole: "Master Chef & Host",
    providerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    lastMessageTimestamp: "2026-10-18T10:18:00.000Z",
    unreadCount: 0,
    messages: [
      {
        id: "m-1",
        sender: "guide",
        from: "me",
        text: "Namaste Aarav! Thank you for booking the Dham masterclass in Mashobra. We have everything ready for your culinary session. Looking forward to welcoming you!",
        timestamp: "2026-10-18T10:15:00.000Z",
        time: "10:15 AM",
        status: "read"
      },
      {
        id: "m-2",
        sender: "user",
        from: "them",
        text: "Namaste Sunil-ji! Very excited. Should we arrive 10 minutes early?",
        timestamp: "2026-10-18T10:17:00.000Z",
        time: "10:17 AM",
        status: "read"
      },
      {
        id: "m-3",
        sender: "guide",
        from: "me",
        text: "Yes, arriving around 10:15 AM is ideal so you can enjoy a warm cup of wild mint tea while taking in the morning orchard views. See you soon!",
        timestamp: "2026-10-18T10:18:00.000Z",
        time: "10:18 AM",
        status: "read"
      }
    ]
  }
];

export const getInitialThreads = () => {
  const loaded = loadChatThreads();
  if (loaded && loaded.length) {
    return loaded;
  }
  return initialChats;
};

export const quickReplies = [
  "What should I bring?",
  "Exact pickup location?",
  "Can I add a guest?",
  "Is parking available on site?",
  "What time does the experience end?"
];

export const guideAutomatedResponses = {
  bring: "Just bring comfortable walking shoes, sunglasses, and a light windproof jacket as mountain breezes can be cool. All trekking/cooking safety gear and refreshments will be provided by Agam!",
  location: "Our meeting point is right by the Agam Mountaineering Outpost / Ridge Point in Old Manali & Shimla. We will send you the live Google Maps pin 1 hour prior.",
  guest: "Yes, we can accommodate an additional guest! Please let us know a few hours in advance so we can arrange adequate gear and camp meals.",
  parking: "Yes, free dedicated parking is available on site for your vehicle.",
  time: "Our experience duration is paced comfortably, giving you plenty of time for photos, breaks, and tea.",
  fallback: "Thank you for reaching out! I have received your message and will confirm these details for you shortly. Looking forward to hosting you on this Himalayan adventure!"
};
