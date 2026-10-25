# API CONTRACT

> Adeon / TREK Trips — Service/repository contracts.
> There is NO HTTP backend in the current application. All data is stored in
> browser localStorage. This document defines the proposed JavaScript service
> layer that the implementation plan targets.

---

## Architecture Note

The current architecture has no HTTP endpoints. The proposed connected
implementation will NOT add a backend; it will wire a shared JavaScript
service layer between React components (replacing the per-iframe isolation).
All persistence remains in localStorage, scoped by trip ID.

Do NOT invent HTTP endpoints for features that do not require them.

---

## 1. Storage Schema

The service layer reads and writes a single localStorage key per trip, plus a
trips-index key.

```
localStorage['adeon:trips']        // TripIndex: { ids: string[] }
localStorage['adeon:trip:{id}']    // TripStore (see below)
```

### TripIndex
```js
{
  ids: string[]   // ordered list of trip IDs; most-recent-first
}
```

### TripStore (per trip)
```js
{
  trip: Trip,
  places: Place[],
  days: Day[],
  visits: Visit[],
  expenses: Expense[],
  transports: TransportBooking[],
  packingItems: PackingItem[],
  todoItems: TodoItem[],
  foodGuide: FoodGuideEntry[],
  shopGuide: ShopGuideEntry[]
}
```

All arrays are stored in full. On every write, the relevant collection is
replaced in full. No partial/diff writes.

---

## 2. TripRepository

```js
// itinerary/TripRepository.js
export const TripRepository = {

  // Returns all trips (lightweight summary objects only)
  listTrips(): TripSummary[]

  // Returns a single trip store or null if not found
  getTrip(id: string): TripStore | null

  // Creates a new trip; generates UUID, sets createdAt/updatedAt; creates
  // Day records for each date in the range
  // Returns the created trip store
  createTrip(input: {
    title: string,
    destination: string,
    description?: string,
    coverImageUrl?: string,
    startDate: string,   // YYYY-MM-DD
    endDate: string,     // YYYY-MM-DD
    currency: string,    // ISO 4217
    budget?: number,     // integer, smallest currency unit
    tags?: string[]
  }): TripStore

  // Updates only the provided fields; regenerates Days if dates changed
  // Returns updated trip store
  updateTrip(id: string, patch: Partial<TripInput>): TripStore

  // Sets trip status to 'archived'
  archiveTrip(id: string): Trip

  // Deep-clones the trip and all child records with new IDs
  // Returns the new trip store
  duplicateTrip(id: string): TripStore

  // Deletes trip and ALL child records
  deleteTrip(id: string): void

  // Loads a full TripStore from a seed JSON object (idempotent)
  // If a trip with the same ID already exists, it is NOT overwritten
  // unless force=true
  loadSeed(store: TripStore, options?: { force?: boolean }): TripStore

  // Resets a trip to its seed state (deletes all child records and
  // reloads from seed). Does NOT delete real user-created trips.
  resetToSeed(seedId: string, seedData: TripStore): TripStore
}
```

### Errors
- Throws `{ code: 'TRIP_NOT_FOUND', id }` if a trip ID does not exist
- Throws `{ code: 'INVALID_DATES', reason }` if endDate < startDate
- Throws `{ code: 'INVALID_CURRENCY', code }` if the currency is not ISO 4217
- Throws `{ code: 'STORAGE_FULL' }` if localStorage quota is exceeded

---

## 3. PlaceRepository

```js
// itinerary/PlaceRepository.js
export const PlaceRepository = {

  // Returns all places for a trip
  listPlaces(tripId: string): Place[]

  // Creates a new place
  createPlace(tripId: string, input: {
    name: string,
    category: PlaceCategory,
    note?: string,
    tip?: string,
    imageUrl?: string,
    latitude?: number,
    longitude?: number,
    estimatedCost?: number
  }): Place

  // Updates a place
  updatePlace(tripId: string, placeId: string, patch: Partial<PlaceInput>): Place

  // Deletes a place (also deletes all Visits referencing this place)
  deletePlace(tripId: string, placeId: string): void

  // Toggles isFavorite
  toggleFavorite(tripId: string, placeId: string): Place
}
```

### Validation
- name: required, 1–200 chars
- category: must be one of the defined PlaceCategory enum values
- If latitude set: longitude required, and vice versa
- latitude: -90 to 90; longitude: -180 to 180
- estimatedCost: integer >= 0
- tripId must exist in TripRepository

---

## 4. VisitRepository

```js
export const VisitRepository = {

  // Returns all visits for a day, sorted by order
  listVisitsForDay(tripId: string, dayId: string): Visit[]

  // Assigns a place to a day (appends to end of day's visit list)
  createVisit(tripId: string, input: {
    dayId: string,
    placeId: string,
    scheduledTime?: string   // HH:MM
  }): Visit

  // Reorders visits within a day by providing the new ordered array of visit IDs
  reorderVisits(tripId: string, dayId: string, orderedVisitIds: string[]): Visit[]

  // Removes a visit (does NOT delete the Place)
  deleteVisit(tripId: string, visitId: string): void

  // Sets scheduled time
  updateVisit(tripId: string, visitId: string, patch: { scheduledTime?: string }): Visit
}
```

### Validation
- placeId.tripId must equal dayId.tripId (no cross-trip references)
- scheduledTime: HH:MM format if provided

---

## 5. ExpenseRepository

```js
export const ExpenseRepository = {

  listExpenses(tripId: string): Expense[]

  createExpense(tripId: string, input: {
    name: string,
    amount: number,          // integer, smallest unit
    category: ExpenseCategory,
    dayIndices?: number[],
    linkedTransportId?: string
  }): Expense

  updateExpense(tripId: string, expenseId: string, patch: Partial<ExpenseInput>): Expense

  deleteExpense(tripId: string, expenseId: string): void

  // Derived calculations (pure functions, not stored)
  // These are exported utilities, not repository methods:
  sumExpenses(expenses: Expense[]): number
  expensesByCategory(expenses: Expense[]): Record<ExpenseCategory, number>
  dailyTotals(expenses: Expense[], daysCount: number): number[]
  remainingBudget(budget: number, expenses: Expense[]): number
}
```

### Validation
- amount: integer > 0
- category: one of "transport"|"accommodation"|"food"|"activities"|"other"
- linkedTransportId: if provided, must exist in TransportRepository for the same tripId

### Business rules
- Do NOT double-count: if linkedTransportId is set, that booking's cost is
  represented by this Expense; do not also sum a separate transport booking cost.
- Food/shopping entries do NOT auto-create Expense records.
- Duplicate-prevention: before creating an Expense linked to a ShopGuideEntry,
  verify no existing Expense has linkedShopEntryId equal to that entry's ID.

---

## 6. TransportRepository

```js
export const TransportRepository = {

  listBookings(tripId: string): TransportBooking[]

  createBooking(tripId: string, input: {
    type: TransportType,
    status: 'confirmed' | 'pending' | 'cancelled',
    title: string,
    confirmationCode?: string,
    carrier?: string,
    from?: string,
    to?: string,
    flightNumber?: string,
    seatNumber?: string,
    departureDate?: string,
    notes?: string
  }): TransportBooking

  updateBooking(tripId: string, bookingId: string, patch: Partial<BookingInput>): TransportBooking

  deleteBooking(tripId: string, bookingId: string): void
}
```

---

## 7. PackingRepository

```js
export const PackingRepository = {

  listItems(tripId: string): PackingItem[]

  createItem(tripId: string, input: {
    text: string,
    category?: string,
    quantity?: number
  }): PackingItem

  toggleItem(tripId: string, itemId: string): PackingItem   // flips checked

  updateItem(tripId: string, itemId: string, patch: Partial<PackingInput>): PackingItem

  deleteItem(tripId: string, itemId: string): void

  reorderItems(tripId: string, orderedItemIds: string[]): PackingItem[]

  // Pure function
  progress(items: PackingItem[]): { completed: number, total: number, pct: number }
}
```

---

## 8. TodoRepository

```js
export const TodoRepository = {

  listItems(tripId: string): TodoItem[]

  createItem(tripId: string, input: {
    title: string,
    description?: string,
    priority?: 'none'|'p1'|'p2'|'p3',
    dueDate?: string
  }): TodoItem

  toggleItem(tripId: string, itemId: string): TodoItem

  updateItem(tripId: string, itemId: string, patch: Partial<TodoInput>): TodoItem

  deleteItem(tripId: string, itemId: string): void

  // Pure function
  progress(items: TodoItem[]): { completed: number, total: number, pct: number }
}
```

---

## 9. ShopGuideRepository

```js
export const ShopGuideRepository = {

  listFoodEntries(tripId: string): FoodGuideEntry[]
  listShopEntries(tripId: string): ShopGuideEntry[]

  toggleFoodTried(tripId: string, entryId: string): FoodGuideEntry
  toggleShopBought(tripId: string, entryId: string): ShopGuideEntry

  // createEntry / updateEntry / deleteEntry intentionally omitted from v1.
  // Food and shop guide entries come only from seed data in v1.
  // Direct CRUD by the user is not in scope.
}
```

---

## 10. SeedLoader

```js
// itinerary/SeedLoader.js
export const SeedLoader = {

  // Loads a seed file idempotently.
  // If the seed trip ID already exists, does nothing (unless force=true).
  // Does not delete existing user-created trips.
  loadSeed(seedData: TripStore, options?: { force?: boolean }): {
    loaded: boolean,
    tripId: string,
    reason?: 'already_exists' | 'loaded'
  }

  // Resets a seed trip to its original state.
  // Deletes ONLY the trip matching seedData.trip.id.
  // Does NOT touch any other trips.
  resetSeed(seedData: TripStore): { tripId: string }
}
```

### Idempotency guarantee
- loadSeed is safe to call multiple times. It checks for the seed trip ID
  before writing.
- resetSeed only deletes the specific seed trip, then reloads it.
- No automatic seeding on startup. Seeds are loaded only on explicit user action.

---

## 11. Error Codes

All repository functions throw plain objects with a `code` string:

| Code | Meaning |
|---|---|
| TRIP_NOT_FOUND | No trip with that ID in localStorage |
| PLACE_NOT_FOUND | No place with that ID in that trip |
| CROSS_TRIP_REFERENCE | placeId and dayId belong to different trips |
| INVALID_DATES | endDate < startDate, or invalid date string |
| INVALID_CURRENCY | Not a recognised ISO 4217 code |
| DUPLICATE_EXPENSE | Expense already linked to this ShopGuideEntry |
| STORAGE_FULL | localStorage quota exceeded |
| VALIDATION_ERROR | Field-level validation failure (includes `field` and `message`) |

---

## 12. Map Integration Contract

The Plan tab uses MapLibre GL JS. The map is rendered inside the plan-tab HTML
file. In the connected version, the plan tab will receive trip data via a
message channel.

```
React (TripApp) -> postMessage({ type: 'adeon:trip-data', payload: TripStore })
Plan iframe <- window.addEventListener('message', handler)
```

Map constraints:
- Only the current trip's places are shown on the map.
- Coordinates come only from Place.latitude / Place.longitude.
- If a place has no coordinates, it is listed in the panel but not shown on the map.
- Straight lines drawn between stops on a day are labelled "Connect stops" or
  "Show path", NOT "calculated road route" or "driving directions".
- Actual driving/walking directions require the user to click "Open in Google Maps".
- The map tile provider (OpenFreeMap / Positron) is free, no API key required.
- The satellite layer (ESRI) is used under the ESRI terms of service; it is not
  metered for personal/development use.
- Handle: map library load failure (show error state, not blank), missing
  coordinates (hide marker, show note), and empty trip (show world view).

---

## 13. What is Explicitly Out of Scope for v1

The following are documented as NOT implemented and must NOT be stubbed with
fake implementations:

- Live flight status API
- Payment processing / booking purchases
- Live foreign exchange rates
- Automatic itinerary optimisation
- Real-time collaboration
- File attachments / upload storage
- Multi-user authentication
- Push notifications
- Server-side rendering

Controls that rely on these features must display an "unavailable" or "coming soon"
state. They must not silently do nothing.
