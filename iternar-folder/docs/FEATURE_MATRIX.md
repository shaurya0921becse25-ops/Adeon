# FEATURE MATRIX

> Every visible interactive control in Adeon / TREK Trips.
> Status key: Working | Partial | UI-only | Stub | Disabled | Not built

---

## Screen: Main Page (/)

| Control / Action | Expected Behaviour | Data read/changed | Status | Acceptance test |
|---|---|---|---|---|
| Destination input | User types trip destination; saved to trip record | Trip.destination | UI-only | Input changes do not persist across reload |
| Description textarea | User types trip summary | Trip.description | UI-only | Value lost on reload |
| Cover image upload button | Opens file picker; previews image; uploads to storage | Trip.coverImageUrl | UI-only | No file picker opens (input type=file hidden) |
| Date range trigger button | Toggles calendar popover | Trip.startDate, Trip.endDate | Working | Calendar opens/closes |
| Calendar prev/next month | Navigates calendar months | (UI state) | Working | Months change correctly |
| Calendar day click | Selects start then end date; updates date label and day count | Trip.startDate, Trip.endDate | Working | Dates update, day count is derived correctly |
| Day count field | Read-only; derived from dates | Derived | Working | Matches (endDate - startDate) + 1 |
| Budget input | User enters planned budget | Trip.budget | UI-only | Value lost on reload |
| Tag: click tag label | Toggles tag selected/deselected state | (UI state) | Working | aria-pressed toggles |
| Tag: click remove (×) | Removes tag from list | Trip.tags | Working (UI-only) | Tag removed from DOM, not persisted |
| Tag: click "+ Add Tag" | Shows add-tag form | (UI state) | Working | Form appears |
| Tag: type in tag input | Validates duplicate / empty | (UI state) | Working | Duplicate tag rejected |
| Tag: click "Add" / press Enter | Adds new tag to list | Trip.tags | Working (UI-only) | Tag appears in DOM, not persisted |
| Tag: click cancel | Hides add-tag form | (UI state) | Working | Form hides |
| "Save Itinerary" button | Should save form data and navigate to trip workspace | Trip (create/update) | UI-only | Navigates to /trips but saves nothing |
| Trip card click | Should open trip workspace for that trip | Trip.id (select) | UI-only | Navigates to /trips but no trip ID resolved |
| Trip card: Edit button | Should open trip edit form | Trip | UI-only | No action |
| Trip card: Duplicate button | Should clone trip with new IDs | Trip (new) | UI-only | No action |
| Trip card: Archive button | Should set trip status to "archived" | Trip.status | UI-only | No action |
| Trip card: Delete button | Should delete trip and all child records | Trip (delete) | UI-only | No action |
| "Planned" filter tab | Shows planned trips | Trip.status filter | UI-only | No filter applied |
| "Archived" filter tab | Shows archived trips | Trip.status filter | UI-only | No filter applied |
| "Completed" filter tab | Shows completed trips | Trip.status filter | UI-only | No filter applied |
| Calendar-subscribe button | Exports trip calendar as .ics | Trip dates | UI-only | No action |
| "New Trip" card button | Should open new trip form or focus form above | Trip (create) | UI-only | No dedicated action |

---

## Screen: Overview Tab (overview-tab.txt)

| Control / Action | Expected Behaviour | Data read/changed | Status | Acceptance test |
|---|---|---|---|---|
| Hero trip display | Shows the current trip name, dates, buddies, places count | Trip (read) | UI-only | Always shows "Japan in Autumn" regardless of selected trip |
| Hero: Edit tool button | Opens trip edit form | Trip | UI-only | No action |
| Hero: Duplicate tool button | Clones trip | Trip | UI-only | No action |
| Hero: Archive tool button | Archives trip | Trip.status | UI-only | No action |
| Hero: Delete tool button | Deletes trip | Trip | UI-only | No action |
| Atlas stats (countries, trips, days, distance) | Shows aggregate user travel stats | Derived from all trips | UI-only | Hardcoded values (15, 3, 28, 0 km) |
| Currency converter (From input) | Converts between currencies | (local UI) | UI-only | Input does not call FX API; value is hardcoded 1.1217 |
| Currency converter (swap button) | Swaps from/to currencies | (local UI) | UI-only | No action |
| Currency converter (select dropdowns) | Changes currency | (local UI) | UI-only | No action |
| Highlights collection buttons | Opens collection | (local UI) | UI-only | No action |

---

## Screen: Plan Tab (plan-tab.html)

| Control / Action | Expected Behaviour | Data read/changed | Status | Acceptance test |
|---|---|---|---|---|
| Map display | Shows places for the current trip as markers | Place[] (read) | Working (hardcoded Iceland data) | Map shows 23 Iceland places |
| Map: satellite toggle (satBtn) | Toggles between map and satellite layers | (UI state) | Working | Layer changes |
| Map: place marker click | Selects place; opens info panel | Place (read) | Working | Info panel opens |
| Map: background click | Deselects place | (UI state) | Working | Info panel closes |
| Left panel: day row click | Selects and expands day | Day (read) | Working | Day expands |
| Left panel: stop click (place row) | Selects place on map and in list | Place (read) | Working | Marker highlighted |
| Left panel: stop reorder (up/down) | Reorders visits within a day | Visit.order | Working (in-memory) | Reorder works until page reload |
| Left panel: "Export" button | Exports itinerary | (Trip data) | UI-only | No action |
| Left panel: "Route" button | Fits map to day's stops | (map viewport) | Working | Map fits day stops |
| Left panel: "Open in Google Maps" | Opens external directions | (coordinates) | Working | Opens Google Maps with waypoints |
| Left panel: "Optimize" button | Optimises route order | Visit.order | Stub | alert() only |
| Left panel: "Add note" day button | Prompts for note text | Day.dayNote | Stub | Uses window.prompt() |
| Left panel: "Add transport" day button | Prompts for transport | Day note | Stub | Uses window.prompt() |
| Left panel: "Public transit" day button | No action defined | — | Stub | No handler |
| Left panel: total cost display | Shows sum of day costs | Derived | Working (in-memory) | Correct for hardcoded data |
| Right panel: "Add Place/Activity" button | Opens add-place dialog | Place (create) | UI-only | Dialog opens; saving does nothing persistent |
| Right panel: "Import file" button | Import places from file | Place[] | Disabled | Button has disabled attribute |
| Right panel: "List Import" button | Import from list | Place[] | Disabled | Button has disabled attribute |
| Right panel: "All" filter button | Shows/hides place count | (UI state) | UI-only | Dropdown does not open |
| Right panel: search box | Filters place list | Place[] (filter) | Working (in-memory) | Filters places in list |
| Right panel: "All Categories" dropdown | Filters by category | (UI state) | Working | Category filter applies |
| Right panel: Favorites button | Filters to starred places | Place.isFavorite | Working (in-memory) | Filter applies |
| Right panel: Select button | Multi-select places | (UI state) | UI-only | Cosmetic |
| Right panel: place row click | Selects place on map | Place (read) | Working | Map marker highlighted |
| Info panel: star/rating buttons | Rates or favorites a place | Place.isFavorite | Working (in-memory) | State saved in-memory |
| Info panel: save button | Saves place to trip | Place (persist) | UI-only | No persistent save |
| Info panel: delete button | Deletes place | Place (delete) | Working (in-memory) | Removed from in-memory list; lost on reload |
| Category filter pills (map toolbar) | Shows only that category on map | Place.category | Working | Markers filter by category |
| Add place dialog: name input | Sets place name | Place.name | Working (in-memory) | Value captured in form |
| Add place dialog: Save | Adds place to list | Place (create) | Working (in-memory) | Appears in list; lost on reload |
| Add place dialog: Cancel | Closes dialog | (UI state) | Working | Dialog closes |

---

## Screen: Shop Tab (Shop-tab.html)

| Control / Action | Expected Behaviour | Data read/changed | Status | Acceptance test |
|---|---|---|---|---|
| Food guide: tile click | Opens detail modal | FoodGuideEntry (read) | Working | Modal opens with Iceland food |
| Food guide: "Mark as tried" button | Marks food entry as tried | FoodGuideEntry.tried | Working | State persists in localStorage['trip-shop'] |
| Food guide: progress bar | Shows % of entries tried | Derived | Working | Updates on toggle |
| Shopping guide: tile click | Opens detail modal | ShopGuideEntry (read) | Working | Modal opens |
| Shopping guide: "Mark as bought" | Marks entry as bought | ShopGuideEntry.bought | Working | State persists in localStorage['trip-shop'] |
| Shopping guide: progress bar | Shows % bought | Derived | Working | Updates on toggle |
| Modal: close button (X) | Closes modal | (UI state) | Working | Modal closes |
| Modal: background click | Closes modal | (UI state) | Working | Modal closes |
| Escape key | Closes modal | (UI state) | Working | Modal closes |
| Shopping budget chip | Shows 7.5% of budget | Derived from localStorage['trip-budget'] | Working | Reads from costs tab localStorage key |
| Accordion: "Where to eat/buy" | Expands/collapses | (UI state) | Working | Section expands |
| Accordion: "Good to know" | Expands/collapses | (UI state) | Working | Section expands |

---

## Screen: Lists Tab (lists-tab.html)

| Control / Action | Expected Behaviour | Data read/changed | Status | Acceptance test |
|---|---|---|---|---|
| Packing tab (top nav) | Shows packing list | PackingItem[] (read) | Working | Packing categories render |
| To-do tab (top nav) | Shows to-do tasks | TodoItem[] (read) | Working | Tasks render |
| Packing: checkbox click | Toggles item packed state | PackingItem.checked | Working | Persists in localStorage |
| Packing: quantity input | Changes item quantity | PackingItem.quantity | Working (in-memory) | Updates in memory, no persistent save |
| Packing: delete button | Removes packing item | PackingItem (delete) | Working (in-memory) | Removed; lost on reload |
| Packing: "Add item" inline | Adds item to category | PackingItem (create) | Working (in-memory) | Appears in list; lost on reload |
| Packing: progress bar | Shows completion % | Derived | Working | Updates live |
| Packing: "Add category" | Adds new packing category | PackingCategory (create) | Working (in-memory) | Category appears; lost on reload |
| To-do: task checkbox | Marks task done/undone | TodoItem.done | Working | Persists in localStorage |
| To-do: task click | Opens detail pane | TodoItem (read) | Working | Detail pane opens |
| To-do: "New task" button | Opens new task modal | (UI state) | Working | Modal opens |
| To-do: new task form submit | Creates task | TodoItem (create) | Working (in-memory) | Task appears; lost on reload |
| To-do: task detail: title/desc | Edit task | TodoItem | Working (in-memory) | Changes visible; lost on reload |
| To-do: task detail: priority | Sets priority | TodoItem.priority | Working (in-memory) | Priority shows; lost on reload |
| To-do: task detail: "Save changes" | Saves task edits | TodoItem | Working (in-memory) | Lost on reload |
| To-do: task detail: "Delete" | Deletes task | TodoItem (delete) | Working (in-memory) | Lost on reload |
| To-do: filter (All/My Tasks/Overdue/Done) | Filters task list | TodoItem[] (filter) | Working | Filters apply |
| To-do: sort (Priority/Due date) | Sorts task list | (UI state) | Working | Sorts apply |
| To-do: progress widget | Shows % completed | Derived | Working | Updates on toggle |

---

## Screen: Cost Tab (costs-tab.html)

| Control / Action | Expected Behaviour | Data read/changed | Status | Acceptance test |
|---|---|---|---|---|
| Total budget card display | Shows current budget | Trip.budget (read) | Working (in-memory) | Shows hardcoded 800,000 ISK |
| Budget edit pencil button | Makes budget field editable | Trip.budget | Working | Input appears |
| Budget input field | User sets budget | Trip.budget | Working | localStorage['trip-budget'] updated |
| Budget: Enter key / check button | Commits budget | Trip.budget | Working | Value saved |
| Total expenses card | Shows sum of all expenses | sum(Expense.amount) | Working (in-memory) | Correct for hardcoded data |
| Remaining budget card | Shows budget minus spent | Derived | Working | Correct derivation |
| "Add expense" button | Opens add expense modal | (UI state) | Working | Modal opens |
| Add expense: name input | Sets expense name | Expense.name | Working | Required validation |
| Add expense: amount input | Sets expense amount | Expense.amount | Working | Numeric validation |
| Add expense: day select | Sets which day(s) | Expense.dayIndices | Working | Options show day labels |
| Add expense: category select | Sets category | Expense.category | Working | Options render |
| Add expense: submit | Creates expense | Expense (create) | Working (in-memory) | Appears in list; lost on reload |
| Add expense: cancel | Closes modal | (UI state) | Working | Modal closes |
| Expense list: delete button | Removes expense | Expense (delete) | Working (in-memory) | Lost on reload |
| Category budgets card | Shows per-category allocation | Derived from CATS shares | Working (in-memory) | Correct for hardcoded data |
| Biggest expenses card | Shows top expenses | Expense[] (read) | Working (in-memory) | Correct for hardcoded data |
| Line chart | Plots daily spend vs budget | Expense[], Trip.budget | Working | Chart renders |
| Chart tooltip | Shows day values on hover | (UI state) | Working | Tooltip appears |

---

## Screen: Transport Tab (transport-tab.txt)

| Control / Action | Expected Behaviour | Data read/changed | Status | Acceptance test |
|---|---|---|---|---|
| Transport card display | Shows booking details | TransportBooking[] (read) | Working (in-memory) | 3 Iceland bookings shown |
| "Add transport" button | Opens add booking modal | (UI state) | Working | Modal opens |
| Transport type selector (pills) | Sets booking type | TransportBooking.type | Working | Type selected |
| Transport form: all fields | Sets booking fields | TransportBooking | Working | Fields captured |
| Transport form: Save | Creates or updates booking | TransportBooking (create/update) | Working (in-memory) | Appears in list; lost on reload |
| Transport form: Cancel | Closes modal | (UI state) | Working | Modal closes |
| Transport card: Edit button | Opens modal with existing data | TransportBooking (read+update) | Working (in-memory) | Form pre-filled |
| Transport card: Delete button | Deletes booking | TransportBooking (delete) | Working (in-memory) | Removed; lost on reload |
| Transport card: "Create expense" shortcut | Should create linked expense | Expense (create) | UI-only | No navigation to Costs tab; cross-tab impossible |
| "Import" button | Imports from file | TransportBooking[] | UI-only | File dialog triggers; no parsing implemented |
| Filter: All/Flight/Car/Train etc. | Filters displayed bookings | TransportBooking[] (filter) | Working | Filter applies |
| Count badges | Shows count per type | Derived | Working | Correct for in-memory data |
| Tab navigation buttons (in-iframe nav) | Switch between tabs | (in-frame nav) | Hidden | Nav bar hidden by CSS in SourceTabs.jsx |

---

## Shared Tab Bar (TripTabs.jsx)

| Control / Action | Expected Behaviour | Data read/changed | Status | Acceptance test |
|---|---|---|---|---|
| Back button | Returns to main page | (routing) | Working | Navigates to / |
| Overview tab | Loads overview iframe | (routing) | Working | Tab renders |
| Plan tab | Loads plan iframe | (routing) | Working | Tab renders |
| Shop tab | Loads shop iframe | (routing) | Working | Tab renders |
| Lists tab | Loads lists iframe | (routing) | Working | Tab renders |
| Cost tab | Loads cost iframe | (routing) | Working | Tab renders |
| Transport tab | Loads transport iframe | (routing) | Working | Tab renders |
| Active tab indicator | Animated underline pill | (UI state) | Working | Pill animates on tab change |
| Keyboard navigation | Tabs accessible by keyboard | ARIA | Partial | aria-current set; no roving tabindex |
