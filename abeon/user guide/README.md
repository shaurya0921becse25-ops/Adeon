# Himora — Local Mountain Experiences Marketplace

Himora is a refined, traveller-side experiences marketplace built with **React 18**, **Vite**, and **plain CSS** using the **Porcelain & Aegean** design theme.

---

## 🏔️ Highlights & Features

- **City Search with Autocomplete**: Search across 12 Indian destinations. Selecting Shimla opens 32 curated local experiences; selecting any other city displays an authentic "Coming Soon" notify-me state.
- **Rich Experience Catalog (Shimla)**: 32 handpicked tours across 7 categories:
  - Cooking Classes & Himachali Dham feasts
  - Colonial Heritage Walks (Ridge, Christ Church, Gaiety Theatre)
  - Wildlife & Cedar Sanctuary Safaris
  - Cultural Guides & Village Kath-Kuni immersions
  - Alpine Treks (Shali Tibba, Tara Devi, Hatu Peak, Churdhar)
  - Street Food Crawls & Apple Orchard Tastings
  - Royal Enfield Motorcycle & Vehicle Fleet Rentals
- **3-Step Booking Flow**:
  1. Traveller details with inline validation
  2. Demo payment simulation (UPI / Card) with clear zero-charge indicators
  3. Confirmation with instant reference codes and status lifecycle
- **Guide Messenger (Chat)**:
  - Unlocked automatically upon booking
  - WhatsApp-style conversation layout with timestamps and read receipts
  - Simulated guide auto-replies to quick chips ("What should I bring?", "Exact pickup location?") and questions
- **My Trips with Simulation**:
  - Upcoming, Completed, and Cancelled tabs
  - "Simulate: mark service as completed" button for demo testing
  - Review prompts and verified review publishing that updates live average ratings
- **Customizable Name**: Easily rebrand by editing `src/config/appConfig.js`.

---

## 🎨 Color Palette: Porcelain & Aegean

Defined in `:root` inside `src/styles/tokens.css`:
- `--porcelain`: `#FAF7F0` (Page background)
- `--mist`: `#D9E7EB` (Soft surfaces, chips, section bands)
- `--aegean`: `#91B8C7` (Primary accent, active states)
- `--limestone`: `#D8BDA6` (Badges, dividers)
- `--taupe`: `#765F53` (Body text, headings, dark buttons)
- Derived contrast-safe tokens: `--aegean-deep` (`#2F6174`), `--taupe-deep` (`#4A3A32`), and warm white surfaces.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Visit `http://localhost:5173` in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── config/
│   └── appConfig.js           # App name, currency, default destination
├── context/
│   ├── AuthContext.jsx         # Demo traveller authentication
│   ├── BookingContext.jsx      # Booking state & status lifecycle
│   ├── ChatContext.jsx         # WhatsApp-style messaging & guide auto-replies
│   ├── ReviewContext.jsx       # Verified reviews & live rating calculation
│   ├── WishlistContext.jsx     # Saved experiences
│   └── ToastContext.jsx        # Notification toasts
├── data/
│   ├── destinations.js         # Shimla active + upcoming Indian cities
│   ├── categories.js           # 7 experience categories
│   ├── providers.js            # 12 Shimla guides & businesses
│   ├── services.js             # 32 complete Shimla experiences
│   ├── reviews.js              # Seeded reviews with host replies
│   ├── bookings.js             # Seeded bookings in all statuses
│   └── chats.js                # Initial conversations & automated answers
├── components/
│   ├── ui/                     # Hand-built UI kit (Button, Badge, Card, Modal, Drawer, Tabs, etc.)
│   ├── layout/                 # Header with city selector & Footer
│   ├── search/                 # CitySearchBox with autocomplete & recent searches
│   ├── service/                # ServiceCard with wishlist animation & ratings
│   ├── booking/                # 3-Step BookingModal
│   └── review/                 # ReviewModal with subratings & preview
├── pages/
│   ├── Home.jsx                # Hero search, categories, top guides, trust strip
│   ├── Destination.jsx         # Shimla catalog, sidebar filters, sorting, search
│   ├── ComingSoon.jsx          # Coming soon state with notify-me email
│   ├── ServiceDetail.jsx       # Gallery lightbox, sticky widget, itinerary, FAQs
│   ├── ProviderProfile.jsx     # Public guide bio, badges, services, reviews
│   ├── Trips.jsx               # My Trips with simulation action
│   ├── Chat.jsx                # Guide messaging thread
│   └── Wishlist.jsx            # Saved items
└── styles/
    ├── tokens.css              # Porcelain & Aegean CSS variables
    ├── base.css                # Typography & global styles
    ├── utilities.css           # Layout helpers
    └── ui.css                  # UI kit primitives
```

---

## 📍 How to Add a New Destination's Services

The architecture is built so adding a new city requires **only data files**, with no changes to the UI code:

1. Open `src/data/destinations.js` and update your destination flag:
   ```javascript
   {
     id: "manali",
     name: "Manali",
     state: "Himachal Pradesh",
     comingSoon: false, // Set to false
     coverImage: "...",
     quickFacts: [...]
   }
   ```
2. Create `src/data/manaliServices.js` with experiences following the schema in `services.js`.
3. In `src/data/services.js`, import and return your new city services in `getServicesByCity(cityId)`. The destination page and filters will immediately work for `/destination/manali`!

---

## 🔌 Connecting to a Real Backend

To transition from mock storage to a production API:
1. **API Client**: Replace `localStorage` reads in `BookingContext`, `ChatContext`, and `ReviewContext` with REST or GraphQL endpoints (e.g. `/api/v1/bookings`, `/api/v1/messages`).
2. **WebSockets / SSE**: Replace `simulateGuideReply` in `ChatContext` with real-time WebSocket events from the guide side.
3. **Payments**: Replace the mock payment step in `BookingModal.jsx` with Razorpay or Stripe checkout scripts.
4. **Auth**: Replace `AuthContext.jsx` with Firebase Auth, Supabase Auth, or your JWT session provider.
