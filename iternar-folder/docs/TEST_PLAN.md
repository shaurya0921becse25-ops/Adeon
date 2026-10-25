# TEST PLAN

> Adeon / TREK Trips
> Current state: NO test framework installed. This plan defines what to add and what to test.

---

## 1. Test Infrastructure to Add

No test runner is currently installed. The following setup is recommended:

### Recommended stack
- Test runner: Vitest (already has Vite integration; no additional config needed)
- DOM environment: jsdom (for browser API simulation)
- Assertion library: Vitest built-in (expect, vi)

### Installation (Phase 0 prerequisite)
```sh
npm install -D vitest jsdom @vitest/coverage-v8
```

### vitest.config.js addition
```js
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['**/__tests__/**/*.test.js'],
  },
})
```

### npm script addition
```json
"test": "vitest run",
"test:watch": "vitest"
```

---

## 2. Phase 0 — Unit Tests: Repository Layer

Location: `itinerary/__tests__/`

### TripRepository.test.js

| Test | What it verifies |
|---|---|
| createTrip() creates a trip with a UUID | Trip.id is a non-empty string |
| createTrip() creates Day records for each date | durationDays days are created |
| createTrip() rejects endDate < startDate | Throws INVALID_DATES |
| createTrip() rejects unknown currency | Throws INVALID_CURRENCY |
| getTrip() returns null for unknown ID | Returns null |
| getTrip() returns full store for known ID | Returns TripStore |
| updateTrip() changes only patched fields | Other fields unchanged |
| updateTrip() regenerates Days when dates change | New days match new range |
| archiveTrip() sets status to "archived" | Trip.status === "archived" |
| duplicateTrip() creates new IDs for all records | No ID collision with original |
| duplicateTrip() remaps Visit.placeId to new Place IDs | No stale references |
| deleteTrip() removes trip and all child records | getTrip() returns null after |
| listTrips() returns only trip summaries, not full stores | No place/expense data leaked |

### PlaceRepository.test.js

| Test | What it verifies |
|---|---|
| createPlace() adds a place scoped to the trip | place.tripId === tripId |
| createPlace() rejects latitude without longitude | Throws VALIDATION_ERROR |
| createPlace() rejects longitude out of range | Throws VALIDATION_ERROR |
| deletePlace() also deletes all Visits for that place | No orphaned visits |
| toggleFavorite() flips isFavorite | Correct boolean value returned |

### VisitRepository.test.js

| Test | What it verifies |
|---|---|
| createVisit() rejects placeId from different trip | Throws CROSS_TRIP_REFERENCE |
| createVisit() appends to end of day | order is max(existing)+1 |
| reorderVisits() changes Visit.order correctly | Returned visits in new order |
| deleteVisit() does not delete the Place | Place still exists after |

### ExpenseRepository.test.js

| Test | What it verifies |
|---|---|
| createExpense() rejects amount <= 0 | Throws VALIDATION_ERROR |
| sumExpenses() returns correct total | Pure function |
| expensesByCategory() sums per category | Pure function |
| remainingBudget() = budget - total | Pure function; can be negative |
| Duplicate linked expense prevention | Throws DUPLICATE_EXPENSE |

### SeedLoader.test.js

| Test | What it verifies |
|---|---|
| loadSeed() is idempotent | Second call does not create duplicate trip |
| loadSeed() with force=true overwrites | Trip replaced |
| resetSeed() deletes only the seed trip | Other trips unaffected |
| resetSeed() restores seed state | Trip matches original seed |

### calculations.test.js

| Test | What it verifies |
|---|---|
| durationDays(start, end) | Correct inclusive count |
| sumExpenses([]) | Returns 0 |
| sumExpenses(expenses) | Returns correct integer sum |
| packingProgress() with no items | Returns { completed:0, total:0, pct:0 } |
| packingProgress() with partial completion | Correct percentage |

---

## 3. Phase 1 — Unit Tests: URL Routing

Location: `src/__tests__/`

### routing.test.js

| Test | What it verifies |
|---|---|
| getCurrentPage('/') returns 'main' | Route parsing correct |
| getCurrentPage('/trips/abc123') returns { page:'trips', id:'abc123' } | Route parsing |
| getTripIdFromPath('/trips/') returns null | No ID case handled |

---

## 4. Phase 1–7 — Integration Tests: Tab Data Flow

Location: `src/__tests__/integration/`

These tests verify that postMessage communication between the React shell and
iframes works correctly. Use jsdom; mock iframes.

### tabBridge.test.js

| Test | What it verifies |
|---|---|
| Shell sends trip data to each tab on mount | postMessage with trip payload |
| Shell handles adeon:create-place from iframe | PlaceRepository.createPlace() called |
| Shell sends updated TripStore after place created | Iframe receives new data |
| Shell handles adeon:toggle-food | ShopGuideRepository.toggleFoodTried() called |
| Shell rejects cross-trip postMessages | Messages from wrong source ignored |

---

## 5. Phase 8 — Seed Data Tests

Location: `data/__tests__/`

### iceland-seed.test.js

| Test | What it verifies |
|---|---|
| iceland.json is valid JSON | Parse succeeds |
| iceland.json has exactly 10 places | places.length === 10 |
| All places have valid coordinates | lat/lng in valid range |
| All visits reference places in places[] | No dangling placeIds |
| All visits reference days in days[] | No dangling dayIds |
| days count matches date range | Correct duration |
| expenses.length > 0 | Has at least one expense |
| transports.length > 0 | Has at least one booking |
| packingItems.length > 0 | Has at least one item |
| foodGuide.length > 0 | Has at least one food entry |

### japan-seed.test.js (same structure as iceland-seed.test.js)

---

## 6. Phase 9 — Error State Tests

### errorStates.test.js

| Test | What it verifies |
|---|---|
| Invalid trip ID in URL renders not-found state | Component tree shows error UI |
| Corrupted localStorage does not crash | App renders with empty state |
| STORAGE_FULL error shows user message | Error code surfaced to UI |

---

## 7. End-to-End Tests (Manual for v1)

No E2E test runner is in scope for v1. The following scenarios should be verified
manually after each phase:

### After Phase 1
- [ ] Create a trip, reload, trip still in My Trips list
- [ ] Click trip card, navigate to /trips/{id}
- [ ] Reload /trips/{id}, correct trip loads
- [ ] Navigate to /trips/invalid, see not-found page

### After Phase 3 (Plan)
- [ ] Add a place, see it on the map and in the list
- [ ] Reload, place still present
- [ ] Reorder a stop, reload, order preserved
- [ ] Open Iceland then Japan: map centres differ, places differ

### After Phase 8 (Seeds)
- [ ] Load Iceland seed: all 6 tabs show Iceland data
- [ ] Load Japan seed: all 6 tabs show Japan data
- [ ] Open Iceland then open Japan: data is completely separate
- [ ] Reset Iceland: Iceland trip returns to original seed state; Japan unaffected
- [ ] Load Iceland seed twice: only one Iceland trip in the list

---

## 8. Acceptance Criteria Summary (from User Requirements)

| Criterion | Phase tested |
|---|---|
| Opening Iceland shows Iceland data on every screen | Phase 8 |
| Opening Japan shows Japan data on every screen | Phase 8 |
| Editing one trip does not affect another | Phase 1 |
| Adding a place updates list, map, and count | Phase 3 |
| Scheduling a place updates the correct day | Phase 3 |
| Add/edit/delete expense updates all cost summaries | Phase 6 |
| Checking an item updates progress | Phase 5 |
| Transport CRUD persists | Phase 7 |
| Reloading preserves changes | Phase 1 |
| Invalid trip IDs show not-found state | Phase 1 / Phase 9 |
| Empty trips do not crash or show sample content | Phase 9 |
| No secrets in frontend bundle or docs | Phase 0 (no secrets exist) |
| Existing and new tests pass | Every phase |
