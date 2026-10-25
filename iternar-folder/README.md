# WanderWise / Adeon Travel Planner Rebuild

A full native React travel planning application rebuilt from the ground up, eliminating iframe-based rendering, establishing unified trip-scoped persistence, and featuring rich offline-first capabilities.

---

## 1. Overview & Architecture

- **100% Native React 19 & Vite 8**: All pages and all 6 workspace tabs are native React components. Zero iframes, zero `srcDoc` HTML string injection, and zero `postMessage` dependencies.
- **Unified Data Model & Storage Layer**: Scoped under `adeon:trips` and `adeon:trip:<tripId>` in `itinerary/`. Every mutation updates the shared reactive store and persists immediately across reloads.
- **Seeded Japan Demo Trip**: Exactly one coherent Japan demo trip on fresh installation (`data/seeds/japan.json`), with 7 real places verified by geographic coordinates in Tokyo. All 6 tabs reflect this trip.
- **Stable URL Routing**:
  - `/` — Itinerary creation form and My Trips dashboard.
  - `/trips/:id` — Trip workspace for the selected trip.
  - Invalid trip IDs display a graceful "Trip Not Found" screen with a return link.
- **Offline-First Resilience**: All core UI interactions, form edits, stop reordering, packing checks, food/shop tracking, expense management, mock currency conversions, and text itinerary exports work completely offline without internet connectivity.
- **Safe Lightweight Backend**: An optional Node.js/Express proxy (`server/index.js`) for Unsplash image search and weather requests. All secret API keys remain server-side in `.env` (gitignored).

---

## 2. Quickstart & Commands

### Prerequisites
- Node.js (v18 or newer recommended)
- npm

### Installation
```bash
npm install
```

### Start Frontend Dev Server
```bash
npm run dev
```
Open `http://localhost:5173/` (or the port Vite displays) in your browser.

### Start Optional Express Backend
```bash
npm run server
```
Runs the API proxy on `http://localhost:3001/` for cached Unsplash image search and weather fallback.

### Run Automated Tests
```bash
npm test
```
Executes all Vitest unit and integration test suites.

### Build Production Bundle
```bash
npm run build
```
Creates an optimized, minified production build in `dist/`.

---

## 3. Environment Variables

Create a local `.env` file (copied from `.env.example`):
```bash
cp .env.example .env
```

Available variables:
| Variable | Description |
|---|---|
| `PORT` | Backend server port (Default: `3001`) |
| `UNSPLASH_ACCESS_KEY` | Optional Unsplash access key for image search |
| `OPENWEATHER_API_KEY` | Optional OpenWeatherMap API key |
| `GEMINI_API_KEY` | Optional Google Gemini API key |
| `FOURSQUARE_API_KEY` | Optional Foursquare Places API key |

> **Security Note:** Secrets are strictly loaded in `server/index.js` via Node environment variables. Secret keys are never exposed in React code or browser bundles.

---

## 4. Key Features & Tab Breakdown

1. **Main Page (`/`)**:
   - Trip creation form: Destination, title, description, interactive date picker, derived duration, budget, and tag manager.
   - My Trips grid: Filter by Planned, Archived, or Completed. Real actions on each card: Edit, Duplicate (creates isolated clone with new UUIDs), Archive, and Delete (with confirmation dialog).
   - Calendar Subscription (.ics export).
2. **Overview Tab**:
   - Live trip hero card, pass ticket (traveller count, dates, places preview, countdown).
   - Atlas stats across trips (passport stamps, days explored, places saved, distance).
   - Truthful MOCK currency converter with amount entry, currency selectors, swap button, and clear label: *"Demo conversion — not live exchange rates"*.
   - Reset Demo button to safely restore the Japan starting state without affecting user trips.
3. **Plan Tab**:
   - MapLibre GL map centered on the trip's verified coordinates. Graceful fallback banner if offline or tile failure occurs.
   - Day schedule accordions with stops, reorder controls (Up/Down), delete stop, and day/transport notes.
   - Saved Places side panel with search, category filters, and "+ Add Place" modal.
   - Export Itinerary: Plain-text `.txt` download containing scheduled days and stops.
   - Truthful straight-line stop connections and external Google Maps directions link.
4. **Shop Tab**:
   - Authentic Food & Shopping guides with story, locations, and practical tips.
   - Card modals and one-click "Mark as tried" / "Mark as collected" with persistent state.
5. **Lists Tab**:
   - Mode switcher between Packing List and To-Do tasks.
   - Category grouping, real React checkbox persistence, and dynamic progress bar.
6. **Cost Tab**:
   - Total budget with inline edit modal, recorded expenses list, and remaining budget calculation.
   - Category breakdowns and SVG daily expense distribution chart.
   - Safe linking of transport bookings into expenses without double-counting.
7. **Transport Tab**:
   - Transport booking cards (flight, train, bus, car, other) with carrier, confirmation codes, and prices.
   - Filter pills by transport type.
   - "+ Add to Expenses" action to safely record booking costs in the Cost Tab.

---

## 5. Centralized Data Hub & File Distribution

All data files (destinations, places, food guides, shopping guides, packing templates, and map styles) are stored in the single centralized `data/` directory in pure JSON format:

- `data/destinations.json`: Core destination definitions, metadata, currency, coordinates, zoom levels.
- `data/japan.json`: Default demo trip seed data.
- `data/map_style.json`: MapLibre GL vector and raster tile styling.
- `data/places_*.json`: Curated verified places for Chandigarh, Dubai, Jaipur, Japan, and Shimla.
- `data/food_guide.json`: Regional authentic culinary guide across all destinations.
- `data/shopping_and_lists.json`: Souvenir guides, accordion shopping tips, and packing templates.

For complete architectural details, directory tree maps, and schema specifications, refer to [docs/FILE_DISTRIBUTION.md](file:///d:/WanderWise/iternar-folder/docs/FILE_DISTRIBUTION.md).
