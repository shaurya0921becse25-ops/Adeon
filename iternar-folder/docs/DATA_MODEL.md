# DATA MODEL

> Adeon / TREK Trips — Proposed canonical data model for the connected version.
> This describes the TARGET schema; the current app has NO implemented model.

---

## 1. Entities Overview

```
Trip
 +-- Place (saved places)
 +-- Day  (one per calendar day of the trip)
 |    +-- Visit (a Place scheduled on a Day, in order)
 +-- Expense (actual recorded spending)
 +-- TransportBooking
 +-- PackingItem
 +-- TodoItem
 +-- FoodGuideEntry (per-trip food recommendations)
 +-- ShopGuideEntry (per-trip shopping recommendations)
```

---

## 2. Trip

The root entity. All other records are scoped to exactly one Trip.

| Field         | Type     | Required | Notes |
|---------------|----------|----------|-------|
| id            | string   | YES      | Stable UUID. Generated on creation. Never reused. |
| title         | string   | YES      | Max 120 chars. User-editable. |
| destination   | string   | YES      | Free text (e.g. "Iceland"). Not geocoded in v1. |
| description   | string   | NO       | Free text. Max 1000 chars. |
| coverImageUrl | string   | NO       | URL or local asset path. Falls back to placeholder. |
| startDate     | string   | YES      | ISO 8601 date (YYYY-MM-DD). No time component. Local calendar date. |
| endDate       | string   | YES      | ISO 8601 date. Must be >= startDate. |
| currency      | string   | YES      | ISO 4217 code (e.g. "ISK", "JPY", "USD"). One per trip. |
| budget        | integer  | NO       | Planned total budget in the trip currency's minor unit (see Money). |
| tags          | string[] | NO       | Array of tag strings. Max 20 tags. Max 30 chars each. |
| status        | enum     | YES      | "planned" \| "active" \| "completed" \| "archived" |
| createdAt     | string   | YES      | ISO 8601 datetime. Set on creation. Never changed. |
| updatedAt     | string   | YES      | ISO 8601 datetime. Updated on every mutation. |

### Calculated fields (never persisted)
- durationDays: (endDate - startDate) + 1
- placeCount: count of Place records for this trip
- visitedPlaceCount: count of Places that appear in at least one Visit
- totalExpenses: sum of all Expense.amount for this trip
- remainingBudget: budget - totalExpenses (can be negative)
- packingProgress: count(checked PackingItems) / count(PackingItems)
- todoProgress: count(done TodoItems) / count(TodoItems)

### Validation
- endDate must not be before startDate
- startDate and endDate must be valid calendar dates
- currency must be a known ISO 4217 code

### Deletion
Deleting a Trip deletes ALL child records: Places, Days, Visits, Expenses,
TransportBookings, PackingItems, TodoItems, FoodGuideEntries, ShopGuideEntries.

### Duplication
Trip.duplicate() creates a new Trip with a new UUID and new createdAt/updatedAt.
All child records are deep-cloned with new IDs. All cross-references between
child records (e.g. Visit.placeId) are remapped to the new IDs.

---

## 3. Place

A saved location of interest for a trip.

| Field       | Type   | Required | Notes |
|-------------|--------|----------|-------|
| id          | string | YES      | UUID |
| tripId      | string | YES      | Foreign key -> Trip.id |
| name        | string | YES      | Max 200 chars |
| category    | enum   | YES      | "nature"\|"sight"\|"restaurant"\|"cafe"\|"bar"\|"hotel"\|"museum"\|"activity" |
| note        | string | NO       | Max 1000 chars |
| tip         | string | NO       | Max 500 chars |
| imageUrl    | string | NO       | Falls back to category placeholder |
| latitude    | number | NO       | Decimal degrees. Required to show on map. |
| longitude   | number | NO       | Decimal degrees. Required to show on map. |
| estimatedCost | integer | NO   | In trip currency minor unit |
| isFavorite  | boolean | NO      | Default false |
| createdAt   | string | YES      | |
| updatedAt   | string | YES      | |

### Validation
- If latitude is set, longitude must also be set (and vice versa)
- Latitude: -90 to 90; Longitude: -180 to 180
- References must not cross trip boundaries (tripId must match parent)

### Distinction: saved vs. visited
A Place is "saved" when it exists in the Place table.
A Place is "visited/scheduled" when it appears in at least one Visit record.
These are separate states. Do not conflate them.

---

## 4. Day

Represents one calendar day of the trip. Days are derived from the trip's date
range. In the connected version, Day records are created automatically when a
Trip is saved (one Day per calendar date between startDate and endDate inclusive).

| Field       | Type   | Required | Notes |
|-------------|--------|----------|-------|
| id          | string | YES      | UUID |
| tripId      | string | YES      | Foreign key -> Trip.id |
| date        | string | YES      | ISO 8601 date. Unique per trip. |
| title       | string | NO       | User-editable day label (e.g. "Golden Circle") |
| dayNote     | string | NO       | Free-form note for the day |
| weatherIcon | string | NO       | Icon name (e.g. "cloud-drizzle"). Not live data. |
| weatherTemp | string | NO       | Display string (e.g. "9°"). Not live data. |

### Calculated fields
- dayNumber: (date - trip.startDate) + 1
- dayCost: sum of Visit.estimatedCost for Visits on this day

---

## 5. Visit

Assigns a Place to a Day in a specific order.

| Field       | Type    | Required | Notes |
|-------------|---------|----------|-------|
| id          | string  | YES      | UUID |
| tripId      | string  | YES      | Foreign key -> Trip.id (for scoping) |
| dayId       | string  | YES      | Foreign key -> Day.id |
| placeId     | string  | YES      | Foreign key -> Place.id |
| order       | integer | YES      | Display order within the day. 0-indexed. |
| scheduledTime | string | NO      | HH:MM (local time). Display only. |

### Constraints
- placeId and dayId must belong to the same tripId
- order must be unique within a dayId
- A Place can appear in multiple Visits (same day or different days)

---

## 6. Expense

An actual recorded spending event. Separate from budget estimates.

| Field       | Type    | Required | Notes |
|-------------|---------|----------|-------|
| id          | string  | YES      | UUID |
| tripId      | string  | YES      | Foreign key -> Trip.id |
| name        | string  | YES      | Description. Max 200 chars. |
| amount      | integer | YES      | In trip currency minor unit. Must be > 0. |
| category    | enum    | YES      | "transport"\|"accommodation"\|"food"\|"activities"\|"other" |
| dayIndices  | int[]   | NO       | Which day numbers this expense is spread across (0-indexed) |
| linkedTransportId | string | NO | FK -> TransportBooking.id. Prevents double-counting. |
| createdAt   | string  | YES      | |

### Business rules
- Transport costs must NOT be double-counted. If an Expense is linked to a
  TransportBooking via linkedTransportId, the booking cost must not also be
  summed separately.
- Food/shopping estimates (FoodGuideEntry, ShopGuideEntry) do NOT automatically
  become Expense records. Users must explicitly create an Expense.
- When converting a ShopGuideEntry to an Expense, check that no Expense already
  has linkedShopEntryId equal to that entry's ID.

---

## 7. TransportBooking

A transport reservation (flight, car, train, etc.).

| Field        | Type   | Required | Notes |
|--------------|--------|----------|-------|
| id           | string | YES      | UUID |
| tripId       | string | YES      | Foreign key -> Trip.id |
| type         | enum   | YES      | "flight"\|"train"\|"bus"\|"car"\|"taxi"\|"bicycle"\|"cruise"\|"ferry"\|"other" |
| status       | enum   | YES      | "confirmed"\|"pending"\|"cancelled" |
| title        | string | YES      | Max 200 chars |
| confirmationCode | string | NO  | Booking reference |
| carrier      | string | NO       | Airline, rental company, etc. |
| from         | string | NO       | Origin label |
| to           | string | NO       | Destination label |
| flightNumber | string | NO       | Only for flight type |
| seatNumber   | string | NO       | |
| departureDate | string | NO      | ISO 8601 date |
| notes        | string | NO       | Max 500 chars |
| createdAt    | string | YES      | |
| updatedAt    | string | YES      | |

### Demo data disclaimer
ALL confirmation codes, flight numbers, carrier names, booking references, and
prices in seed fixtures are FICTIONAL. They are not real bookings or live quotes.

---

## 8. PackingItem

An item on the packing list for a trip.

| Field      | Type    | Required | Notes |
|------------|---------|----------|-------|
| id         | string  | YES      | UUID |
| tripId     | string  | YES      | Foreign key -> Trip.id |
| text       | string  | YES      | Max 200 chars |
| category   | string  | NO       | e.g. "Clothing", "Electronics". Max 50 chars. |
| quantity   | integer | NO       | Default 1 |
| checked    | boolean | YES      | Default false |
| order      | integer | YES      | Display order |
| createdAt  | string  | YES      | |

### Calculated field
- packingProgress (on Trip): count(checked) / count(all)

---

## 9. TodoItem

A task / to-do item for a trip.

| Field       | Type    | Required | Notes |
|-------------|---------|----------|-------|
| id          | string  | YES      | UUID |
| tripId      | string  | YES      | Foreign key -> Trip.id |
| title       | string  | YES      | Max 200 chars |
| description | string  | NO       | Max 1000 chars |
| done        | boolean | YES      | Default false |
| priority    | enum    | NO       | "none"\|"p1"\|"p2"\|"p3" |
| dueDate     | string  | NO       | ISO 8601 date |
| order       | integer | YES      | Display order |
| createdAt   | string  | YES      | |

---

## 10. FoodGuideEntry

A destination-specific food recommendation. Part of a trip's Shop tab.

| Field       | Type     | Required | Notes |
|-------------|----------|----------|-------|
| id          | string   | YES      | UUID |
| tripId      | string   | YES      | Foreign key -> Trip.id |
| name        | string   | YES      | Dish or food name. Max 100 chars. |
| emoji       | string   | NO       | Single emoji character |
| tagLine     | string   | NO       | "Type · price range". Max 100 chars. |
| story       | string   | NO       | Description. Max 500 chars. |
| whereToFind | string   | NO       | Max 300 chars. |
| tip         | string   | NO       | Max 200 chars. |
| gradientColors | string[] | NO  | Two hex colours for the tile background |
| tried       | boolean  | YES      | Default false. User marks as tried. |
| order       | integer  | YES      | Display order |

---

## 11. ShopGuideEntry

A destination-specific shopping recommendation.

| Field       | Type     | Required | Notes |
|-------------|----------|----------|-------|
| id          | string   | YES      | UUID |
| tripId      | string   | YES      | Foreign key -> Trip.id |
| name        | string   | YES      | Item name. Max 100 chars. |
| emoji       | string   | NO       | Single emoji |
| tagLine     | string   | NO       | Max 100 chars. |
| story       | string   | NO       | Max 500 chars. |
| whereToBuy  | string   | NO       | Max 300 chars. |
| tip         | string   | NO       | Max 200 chars. |
| gradientColors | string[] | NO  | Two hex colours |
| bought      | boolean  | YES      | Default false |
| linkedExpenseId | string | NO    | FK -> Expense.id if converted to expense |
| order       | integer  | YES      | Display order |

---

## 12. Money Representation

- All money values are stored as INTEGERS in the smallest currency unit.
  - ISK: 1 ISK = 1 unit (no subunit; ISK has 0 decimal places)
  - USD: 1 cent = 1 unit (100 units = $1.00)
  - JPY: 1 yen = 1 unit (no subunit)
  - EUR/GBP: 1 cent/penny = 1 unit
- Currency precision by ISO 4217 must be respected in display formatting.
- Never store floating-point money values.
- Use Intl.NumberFormat for display; always pass the currency code.
- Do NOT store independent "total" or "summary" fields. Derive all totals at
  read time from Expense records.
- v1 supports ONE currency per trip. No automatic conversion between currencies.

---

## 13. Date Handling

- All dates are stored as ISO 8601 strings: YYYY-MM-DD (no time, no timezone).
- Dates represent local calendar dates for the traveller (not UTC).
- All datetimes (createdAt, updatedAt) are stored as ISO 8601 UTC strings.
- Duration calculation: (endDate - startDate) + 1 calendar days.
- No server time is assumed. The browser's local time is the source of truth for
  newly created records.

---

## 14. Record Ownership and Scoping Rules

- Every non-Trip record carries a tripId field.
- Before creating, updating, or deleting any child record, verify that its
  tripId matches the currently selected trip.
- References between child records (e.g. Visit.placeId) MUST refer to records
  with the same tripId. Cross-trip references are invalid.
- The UI must never read or mutate records of a different trip, even if those
  records are present in localStorage.

---

## 15. Calculated vs Persisted Fields Summary

| Field               | Persisted | Derived from |
|---------------------|-----------|-------------|
| Trip.durationDays   | NO        | startDate, endDate |
| Trip.placeCount     | NO        | count(Place) |
| Trip.totalExpenses  | NO        | sum(Expense.amount) |
| Trip.remainingBudget| NO        | budget - totalExpenses |
| Day.dayNumber       | NO        | date - trip.startDate |
| Day.dayCost         | NO        | sum(Visit.place.estimatedCost) |
| Packing progress    | NO        | checked/total PackingItems |
| Todo progress       | NO        | done/total TodoItems |
| Shop food progress  | NO        | tried/total FoodGuideEntries |
| Shop buy progress   | NO        | bought/total ShopGuideEntries |

Never store editable summary totals as independent fields.
