# IMPLEMENTATION PLAN

> Adeon / TREK Trips — Dependency-ordered phases for connecting the data system.
> Phase 0 is the foundation; each subsequent phase depends on the one before it.

---

## Guiding Principles

1. Preserve the existing visual design. No redesign.
2. Do not add frameworks or dependencies beyond what is already installed.
3. Replace the iframe-based architecture incrementally; do not rewrite everything at once.
4. Every commit must leave the application in a working state.
5. Keep business calculations outside presentation components.
6. Persist every user edit across browser reload before moving to the next feature.

---

## Phase 0 — Foundation: Storage Service and Data Model

**Goal:** Replace the fragmented localStorage keys with a unified, trip-scoped
service layer. No UI changes. The iframes still render as before.

### Deliverables

1. `itinerary/types.js`
   - JSDoc @typedef for all entities: Trip, Place, Day, Visit, Expense,
     TransportBooking, PackingItem, TodoItem, FoodGuideEntry, ShopGuideEntry
   - Enum constants: PLACE_CATEGORIES, EXPENSE_CATEGORIES, TRANSPORT_TYPES,
     TRIP_STATUSES

2. `itinerary/ids.js`
   - `generateId()` — returns a stable UUID v4 (crypto.randomUUID or fallback)

3. `itinerary/storage.js`
   - `readTripIndex()`: returns { ids: string[] }
   - `writeTripIndex(index)`: writes 'adeon:trips'
   - `readTripStore(id)`: returns TripStore | null from 'adeon:trip:{id}'
   - `writeTripStore(id, store)`: writes 'adeon:trip:{id}'
   - `deleteTripStore(id)`: removes 'adeon:trip:{id}'
   - Wraps all localStorage calls in try/catch; surfaces STORAGE_FULL

4. `itinerary/TripRepository.js` — per API_CONTRACT.md section 2
5. `itinerary/PlaceRepository.js` — per API_CONTRACT.md section 3
6. `itinerary/VisitRepository.js` — per API_CONTRACT.md section 4
7. `itinerary/ExpenseRepository.js` — per API_CONTRACT.md section 5
8. `itinerary/TransportRepository.js` — per API_CONTRACT.md section 6
9. `itinerary/PackingRepository.js` — per API_CONTRACT.md section 7
10. `itinerary/TodoRepository.js` — per API_CONTRACT.md section 8
11. `itinerary/ShopGuideRepository.js` — per API_CONTRACT.md section 9
12. `itinerary/SeedLoader.js` — per API_CONTRACT.md section 10
13. `itinerary/calculations.js`
    - Pure functions: sumExpenses, expensesByCategory, dailyTotals,
      remainingBudget, durationDays, packingProgress, todoProgress

### Target files
- `itinerary/` directory (new files only; does not modify any existing file)

### Acceptance criteria
- All repository functions work correctly for create/read/update/delete.
- Cross-trip reference protection: createVisit with mismatched tripId throws.
- loadSeed is idempotent (calling twice does not duplicate).
- All tests in `itinerary/__tests__/` pass (see TEST_PLAN.md Phase 0).

### Risks
- localStorage quota (~5 MB): acceptable for personal trip data; handled with STORAGE_FULL error.
- No TypeScript: JSDoc @typedef provides type hints in editors.

---

## Phase 1 — Trip Routing: Trip ID in URL and Trip Context

**Goal:** Give every trip a stable URL. The trip workspace resolves data by trip ID.
No tab content changes yet.

### Deliverables

1. Update `src/App.jsx`:
   - Route pattern: `/trips/:id` (parse via `window.location.pathname.split('/')`)
   - If no ID or ID not found: show a "Trip not found" state with a link back to /
   - Pass `tripId` down to TripApp

2. Update `src/components/TripApp.jsx`:
   - Accept `tripId` prop
   - Read TripStore from TripRepository.getTrip(tripId) on mount
   - Hold TripStore in React state (useState)
   - Pass TripStore (and per-entity arrays) down to each tab

3. Update `src/components/TripTabs.jsx`:
   - No change to UI; receive and display trip title in tab bar area (optional)

4. Update `final/iternary.txt` (Main Page):
   - "Save Itinerary" button: call TripRepository.createTrip() with form values,
     then navigate to `/trips/{newId}` instead of just `/trips`
   - Trip card click: navigate to `/trips/{trip.id}`
   - Trip list: read from TripRepository.listTrips() and render dynamically
   - Edit/Duplicate/Archive/Delete buttons: wire to TripRepository methods
   - "New Trip" card: focus the create form

5. Update `src/components/MainPage.jsx`:
   - Inject trip data via postMessage into the iframe after iframe loads
   - Listen for postMessage from iframe: `adeon:save-trip`, `adeon:navigate-trip`, etc.

### Target files
- `src/App.jsx`
- `src/components/TripApp.jsx`
- `src/components/TripTabs.jsx`
- `src/components/MainPage.jsx`
- `final/iternary.txt` (JS section only)

### Acceptance criteria
- `/trips/nonexistent` shows "Trip not found" state, not a blank/crashed page.
- Creating a trip from the form navigates to the correct trip URL.
- Reloading `/trips/{id}` restores the correct trip.
- Two trips in localStorage are selectable independently.
- Back button returns to `/`.

### Risks
- The Main Page is an iframe. The postMessage bridge needs bidirectional communication.
  See API_CONTRACT.md section 12 for the message protocol.
- Changing routing may break the overviewThenPlan option; must be preserved.

---

## Phase 2 — Overview Tab: Live Trip Data

**Goal:** Overview tab reads its data from the selected trip, not hardcoded HTML.

### Deliverables

1. Update `src/components/SourceTabs.jsx`:
   - `OverviewTab` receives `tripStore` prop and injects it into the iframe via postMessage

2. Update `final/overview-tab.txt`:
   - Remove ALL hardcoded Japan content
   - Listen for `adeon:trip-data` postMessage; populate:
     - Hero trip name and dates
     - Countdown (days until startDate)
     - Buddies count (hardcoded as 1 traveller for v1 — no auth)
     - Places count (from places array)
     - Atlas stats: derived from all trips in the index
   - Highlights / Collections section: display trip.tags as collections (v1 simplification)
   - Currency converter: UI-only (no live FX rate in v1); label it clearly
   - Edit/Duplicate/Archive/Delete: send postMessage to React shell; shell handles

3. Empty state: if TripStore has no places, show a "No places yet" state in the pass card.

### Target files
- `src/components/SourceTabs.jsx`
- `final/overview-tab.txt`

### Acceptance criteria
- Iceland seed trip shows Iceland data on Overview.
- Japan seed trip shows Japan data on Overview.
- Reloading the Overview tab shows the same trip data.
- Empty trip shows empty state, not Japan placeholder data.

---

## Phase 3 — Plan Tab: Live Places and Itinerary

**Goal:** Plan tab map and day panel show only the selected trip's places.

### Deliverables

1. `src/components/SourceTabs.jsx`: inject TripStore into plan-tab iframe via postMessage

2. `final/plan-tab.html`:
   - Remove hardcoded `P[]` (Iceland places) and `DAYS[]` arrays
   - Listen for `adeon:trip-data` postMessage; populate P and DAYS from received data
   - Map centres on the trip's places (bounding box), not hardcoded Iceland coordinates
   - "Add Place" dialog: sends `adeon:create-place` postMessage to React shell; shell calls PlaceRepository, then sends updated TripStore back
   - Stop reorder: sends `adeon:reorder-visits` to shell
   - Place delete: sends `adeon:delete-place` to shell
   - Day note/transport prompt: replace window.prompt() with a proper dialog that sends `adeon:update-day` to shell
   - "Export" button: generate a text/PDF itinerary from the received data (v1: plain text download)
   - If no places: show "No places saved yet" state in both panels

3. Coordinate sourcing: only use Place.latitude / Place.longitude for map markers.
   Places without coordinates are listed in the side panel with a "No location" note.

### Target files
- `src/components/SourceTabs.jsx`
- `final/plan-tab.html`

### Acceptance criteria
- Iceland trip shows only Iceland places on the map.
- Japan trip shows only Japan places on the map (different coordinates, different centre).
- Adding a place updates the list, the map, and the place count in Overview tab.
- Reordering stops persists across reload.
- Plan tab with no places shows empty state, not Iceland map.
- Straight lines between stops are not labelled as driving routes.

---

## Phase 4 — Shop Tab: Trip-Scoped Food and Shopping Guide

**Goal:** Shop tab shows food and shopping entries for the selected trip.

### Deliverables

1. `src/components/SourceTabs.jsx`: inject TripStore into shop-tab iframe

2. `final/Shop-tab.html`:
   - Remove hardcoded FOOD[] and SHOP[] Iceland arrays
   - Listen for `adeon:trip-data`; populate from tripStore.foodGuide and tripStore.shopGuide
   - Mark-as-tried/bought: send `adeon:toggle-food` / `adeon:toggle-shop` to shell; shell calls ShopGuideRepository; sends updated store back
   - Remove localStorage['trip-shop'] direct access (now handled by shell)
   - Shopping budget chip: reads from tripStore.trip.budget * 0.075 (or 0 if no budget)
   - Empty state: if no food/shop entries, show "No guide for this trip yet"

### Target files
- `src/components/SourceTabs.jsx`
- `final/Shop-tab.html`

### Acceptance criteria
- Iceland trip shows Iceland food and shopping guide.
- Japan trip shows Japan food and shopping guide.
- Marking as tried/bought persists across reload.
- Different trips have independent tried/bought states.

---

## Phase 5 — Lists Tab: Trip-Scoped Packing and To-do

### Deliverables

1. Inject TripStore into lists-tab iframe via postMessage

2. `final/lists-tab.html`:
   - Remove localStorage['trek-packing'] and ['trek-todo'] direct access
   - All CRUD sends postMessages to shell; shell calls PackingRepository / TodoRepository; sends updated store back
   - Packing check, add, delete, reorder: wired through shell
   - Todo check, add, edit, delete: wired through shell

### Target files
- `src/components/SourceTabs.jsx`
- `final/lists-tab.html`

### Acceptance criteria
- Iceland packing list is separate from Japan packing list.
- Checking an item persists after reload.
- Adding an item to one trip does not affect another trip's list.
- Progress derives from actual item completion counts.

---

## Phase 6 — Cost Tab: Trip-Scoped Expenses and Budget

### Deliverables

1. Inject TripStore into costs-tab iframe

2. `final/costs-tab.html`:
   - Remove hardcoded E[] Iceland expenses and hardcoded budget
   - Remove localStorage['trip-budget'] direct access
   - Populate from tripStore.trip.budget and tripStore.expenses
   - All CRUD sends postMessages to shell
   - Derived totals: all sums computed in calculations.js (pure functions)
   - Currency label: use tripStore.trip.currency
   - If no expenses: show "No expenses yet" state
   - Budget edit: sends `adeon:update-budget` to shell

### Acceptance criteria
- Iceland cost tab shows ISK and Iceland expenses.
- Japan cost tab shows JPY and Japan expenses.
- Adding an expense updates chart, category breakdown, and remaining budget.
- Budget edit persists.
- Transport expenses are not double-counted.
- Remaining budget is always derived, never stored separately.

---

## Phase 7 — Transport Tab: Trip-Scoped Bookings

### Deliverables

1. Inject TripStore into transport-tab iframe

2. `final/transport-tab.txt`:
   - Remove hardcoded transports[] (Iceland Icelandair flights)
   - All CRUD sends postMessages to shell
   - "Create expense" shortcut: sends `adeon:create-linked-expense` to shell;
     shell checks for duplicate, creates Expense with linkedTransportId

### Acceptance criteria
- Iceland transport tab shows Iceland bookings (Icelandair).
- Japan transport tab shows Japan bookings.
- Adding/editing/deleting a booking persists.
- "Create expense" shortcut creates one linked expense and prevents duplicates.

---

## Phase 8 — Seed Data and Demo Reset

**Goal:** Load the Iceland and Japan seed fixtures deterministically.

### Deliverables

1. `data/seeds/iceland.json` — see DATA_MODEL.md for structure
2. `data/seeds/japan.json` — see DATA_MODEL.md for structure
3. `itinerary/SeedLoader.js` — implemented from Phase 0
4. `src/components/MainPage.jsx` or a dedicated Settings/Demo panel:
   - "Load Iceland demo" button — calls SeedLoader.loadSeed(icelandSeed)
   - "Load Japan demo" button — calls SeedLoader.loadSeed(japanSeed)
   - "Reset Iceland demo" button — calls SeedLoader.resetSeed(icelandSeed)
   - "Reset Japan demo" button — calls SeedLoader.resetSeed(japanSeed)
   - Confirm dialog before reset: "This will replace the Iceland demo trip.
     Your other trips will not be affected."

### Acceptance criteria
- Loading Iceland seed twice does not create duplicate trips.
- Resetting Iceland seed removes only the Iceland seed trip.
- Japan seed trip is unaffected by Iceland reset.
- User-created trips are never deleted by seed operations.
- All 10 places, days, visits, expenses, transport, packing, and food/shop
  entries load correctly.

---

## Phase 9 — Empty State and Error Handling

**Goal:** Every screen handles loading, empty, success, and error states explicitly.

### Deliverables

For every tab:
- Loading state: shown while postMessage data is in flight
- Empty state: shown when the trip has no data for that section
- Error state: shown if data reading fails (corrupted localStorage)
- Invalid trip ID state: shown when /trips/{id} resolves no trip

For the main page:
- Empty trips list: show "No trips yet. Create your first trip." with the form focused.

### Acceptance criteria
- No screen crashes or shows misleading hardcoded data when data is missing.
- Navigating to /trips/invalid-id shows the not-found state.
- Corrupted localStorage does not crash the app.

---

## Phase 10 — Unused Component Cleanup and Documentation Update

**Goal:** Remove dead code; update docs to reflect the connected system.

### Deliverables

1. Remove or repurpose:
   - `src/components/TripOverview.jsx` (or wire it into the main page if needed)
   - `src/components/TripPlan.jsx`
   - `src/components/TripLists.jsx`
   - `src/components/EmptyTripSection.jsx`
   - `src/components/ShoppingTab.jsx`
   - `itinerary/data.js` (replaced by repository layer; archive or delete)

2. Update all documentation files to reflect the implemented system.
3. Remove the `data.js` note from README.md and add accurate setup instructions.

---

## Dependency Order Summary

```
Phase 0  (Storage + repositories)
  |
Phase 1  (Trip routing)
  |
Phase 2  (Overview live data)
  |
Phase 3  (Plan live data)
  |
Phase 4  (Shop live data)     -- can run in parallel with Phase 5
Phase 5  (Lists live data)    -- can run in parallel with Phase 4
  |
Phase 6  (Costs live data)
  |
Phase 7  (Transport live data)
  |
Phase 8  (Seed data)
  |
Phase 9  (Empty/error states)
  |
Phase 10 (Cleanup)
```

Phases 4 and 5 can be developed concurrently; all others are sequential.

---

## Not in Scope (v1)

- Live flight status
- Payment or booking purchases
- Live exchange rates
- Automatic route optimisation
- Multi-user / authentication
- Server-side persistence
- File upload storage
- Cover image upload (button renders; no upload in v1)
