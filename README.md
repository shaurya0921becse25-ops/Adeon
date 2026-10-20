# WanderWise — Feasibility-First Travel Planning Web App

> **"Plans that actually work."** Travel plans fail on logistics (closing times, budgets, transport bottlenecks). WanderWise checks those first with an editorial, timetable-inspired visual language.

Built with **React (Vite)**, **React Router**, **Redux Toolkit**, **Context API**, and pure **Vanilla CSS with Custom Properties** (no Tailwind, no external UI frameworks).

---

## 🗺️ System Architecture & Data Flow

```text
[ HOME PAGE ]
  │
  ├── Interactive Feasibility Preview ──┐
  └── Pilot Cities Cards ───────────────┤
                                        ▼
[ TRIP MATCH CHATBOT ] ────► dispatch(setPendingPlan) ──► [ /dashboard STUB ]
  (Rule-based state machine)                                (Receives: city, days,
                                                             budget, vibe, group)
                                                                    ▲
[ COMMUNITY "FIELD NOTES" ]                                         │
  └── "Save to my trip" button ──► dispatch(savePlace) ─────────────┘
                                   (savedPlaces store)
```

1. **Home Feasibility Preview & Chatbot to Dashboard**: Destination, duration, and target budget are computed client-side and saved into Redux `trip.pendingPlan` and URL query parameters, seamlessly received by the `/dashboard` stub.
2. **Community Field Notes to Dashboard**: Clicking **"Save to my trip"** on any local guide review commits the place name and tips to Redux `community.savedPlaces` (persisted in `localStorage`), which dynamically hydrates the user's trip list in `/dashboard`.

---

## 📂 Folder Structure

```text
wanderwise2.0/
├── public/
│   ├── favicon.svg                # Custom WanderWise route-pin SVG mark
│   └── images/                    # 6 curated editorial photos (each used only once)
│       ├── hero-shimla-train.jpg  # Himalayan mountain railway
│       ├── city-jaipur.jpg        # Pink city terracotta architecture
│       ├── city-tokyo.jpg         # Yanaka quiet alley lanterns
│       ├── city-dubai.jpg         # Historic creek & modern skyline
│       ├── city-chandigarh.jpg    # Le Corbusier modernist geometry
│       └── guide-portrait.jpg     # Verified local guide portrait
├── src/
│   ├── config.js                  # Team name, pilot city counts & constants
│   ├── context/
│   │   ├── AuthContext.jsx        # Mock auth, Traveler vs Local Guide role switcher
│   │   ├── ThemeContext.jsx       # Light / Dark mode toggle with system preference
│   │   └── ToastContext.jsx       # Global notification toasts (live region)
│   ├── store/
│   │   ├── index.js               # Redux Toolkit root store
│   │   ├── communitySlice.js      # Field notes feed, filters, helpful votes, savedPlaces
│   │   ├── chatSlice.js           # Trip Match state machine, history, and results
│   │   └── tripSlice.js           # Pending plan constraints handed off to Dashboard
│   ├── data/
│   │   ├── destinations.js        # Pilot cities data, timetable stops & budget swap stops
│   │   └── posts.js               # 20 detailed reviews with honest prices & gate tips
│   ├── utils/
│   │   ├── formatters.js          # Indian currency formatting (INR), dates, freshness labels
│   │   └── matchScore.js          # Explainable 5-factor destination scoring formula
│   ├── styles/
│   │   ├── tokens.css             # Color palette, clamp() typography, spacing, shadows
│   │   └── base.css               # Accessible focus rings, reset, tabular-nums utility
│   ├── components/
│   │   ├── common/                # Reusable UI primitives
│   │   │   ├── Button.jsx & .css
│   │   │   ├── TicketCard.jsx & .css (Signature notched motif & dashed tear line)
│   │   │   ├── Card.jsx & .css
│   │   │   ├── Badge.jsx & .css (Accessible color + icon status badges)
│   │   │   ├── Pill.jsx & .css
│   │   │   ├── Avatar.jsx & .css
│   │   │   ├── StarRating.jsx & .css (Accessible interactive/display rating)
│   │   │   ├── Modal.jsx & .css (Focus trap, ESC listener, scroll-lock)
│   │   │   ├── Toast.jsx & .css
│   │   │   ├── Skeleton.jsx & .css
│   │   │   ├── EmptyState.jsx & .css (Route-line SVG illustration)
│   │   │   ├── FormField.jsx & .css (Accessible labels, errors, aria-describedby)
│   │   │   ├── Tooltip.jsx & .css
│   │   │   └── RouteLine.jsx & .css (Signature scroll & step route motif)
│   │   ├── layout/
│   │   │   ├── Navbar.jsx & .css (Frosted scroll shrink, role switch popover, mobile drawer)
│   │   │   └── Footer.jsx & .css (4 columns, pilot links, evaluation label, sample data note)
│   │   ├── home/
│   │   │   ├── HeroPreviewCard.jsx & .css (Live budget/feasibility timetable preview)
│   │   │   └── MockChatTeaser.jsx & .css (IntersectionObserver auto-playing simulation)
│   │   ├── community/
│   │   │   ├── PostCard.jsx & .css (Clamped review, tips box, comments, helpful toggle)
│   │   │   ├── CreatePostModal.jsx & .css (Form validation showpiece with spam check)
│   │   │   └── GuideServiceModal.jsx & .css (Local Guide offer service stub)
│   │   └── chatbot/
│   │       └── CompareModal.jsx & .css (Side-by-side criteria & scoring breakdown)
│   ├── pages/
│   │   ├── Home.jsx & .css        # Sections A through H in strict order
│   │   ├── Community.jsx & .css   # 3-column Field Notes forum & multi-select filters
│   │   ├── Chatbot.jsx & .css     # Guided Trip Match conversation & explainable cards
│   │   ├── DashboardStub.jsx & .css # Teammate route displaying incoming payload
│   │   ├── LoginStub.jsx & .css   # Teammate route for user & role toggle
│   │   └── NotFound.jsx & .css    # 404 off-route ticket page
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── README.md
```

---

## 🚀 How to Run Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.
3. **Build and validate production bundle**:
   ```bash
   npm run build
   ```

---

## 💡 The Three User Flows Explained

### Flow 1: Feasibility-First Home Preview
1. On the **Home Hero**, users experiment with the **Feasibility Preview Ticket Card**:
   - Toggling among the 5 pilot cities (Shimla, Jaipur, Tokyo, Dubai, Chandigarh).
   - Adjusting days (1–7) and sliding the budget (₹5,000 to ₹1,00,000).
2. The card recalculates live:
   - If the budget is healthy, it displays a green **Feasible Plan** badge.
   - If the budget is constrained, it flips to an amber **Tight Budget** warning.
   - If over budget, it flips to a red **Over budget by ₹X** badge, automatically animates out the high-ticket stop (e.g. *Colonial High Tea*), and swaps in an authentic budget-friendly heritage stop (e.g. *Indian Coffee House*).
3. Clicking **"Open full plan"** packages the constraints into Redux `tripSlice` and routes to `/dashboard`.

### Flow 2: Community "Field Notes" Discovery & Contribution
1. The **Community Page** avoids Reddit clichés (no karma or orange arrows) and acts as a verified travel field log.
2. Users filter by **City**, **Category** (Transport, Scams, Safety, Food, etc.), **Traveler Type**, **Budget Level**, and **Visit Freshness** (<12 months).
3. Users toggle **"Helpful"** on reviews, expand threaded comments to ask clarifications, and click **"Save to trip"** to bookmark sights directly to their itinerary planner.
4. Clicking **"Share your trip"** opens the **Create Post Modal** (the form-validation showpiece) featuring live character counters (transitioning from neutral to warning at 700 chars and danger at 800), on-blur inline validation, required star picker, and anti-spam heuristics.

### Flow 3: "Trip Match" Explainable Engine
1. Users navigate to `/chatbot` for a guided state-machine conversation.
2. Through interactive chips and steppers, they select **Vibe Priorities**, **Party Group**, **Duration**, **Budget Preset**, and optional **Keywords** (e.g., *'snow', 'walkable'*).
3. The engine simulates a 1.2s verification pass and renders the **Top 3 Destination Matches** as notched ticket cards with:
   - Match %
   - Individual score bars (Vibe 40%, Budget 25%, Duration 15%, Group 10%)
   - Personalized "Why this fits" line
   - Critical "Watch out" warning (e.g. *Amer Fort closes at 17:00; Shimla weekend Cart Road bottlenecks*)
4. Users can click **"Compare All 3"** to open a side-by-side comparison modal or click **"Plan this trip"** to pre-populate `/dashboard`.

---

## 🎓 Viva Cheat Sheet (Project Justifications)

| Evaluation Question | Engineering Justification |
| :--- | :--- |
| **Why use Context API for Auth and Theme?** | Auth status (`user`, `userRole`) and UI Theme (`light`/`dark`) are low-frequency, globally consumed states. Context API eliminates prop-drilling without adding boilerplate for actions that change rarely. |
| **Why use Redux Toolkit for Community and Chat?** | Community reviews and chat preferences involve high-frequency mutations (filtering, multi-select criteria, debounced text search, helpful toggles, comment nesting, and multi-step state rewinds). Redux Toolkit provides predictable state management, selector memoization (`selectFilteredPosts`), and centralized persistence middleware. |
| **How is the Trip Match score calculated?** | It uses a deterministic, explainable multi-attribute utility formula:<br>&bull; **Vibe Alignment (40%)**: Cosine-style overlap between destination vibe weights and chosen tags.<br>&bull; **Budget Feasibility (25%)**: Ratio of daily spend (`Budget / Days`) against verified local daily costs.<br>&bull; **Duration Fit (15%)**: Penalty for trips below city minimum or above maximum sightseeing capacity.<br>&bull; **Group Fit (10%)**: Solo/couple vs. family accessibility.<br>&bull; **Extras (10%)**: Keyword matching for walkability, quietness, snow, or dietary needs. |
| **What data persists across page reloads?** | &bull; **Theme**: `localStorage.getItem('wanderwise_theme')`<br>&bull; **Auth & Role**: `localStorage.getItem('wanderwise_role')`<br>&bull; **Community Posts & Helpful Votes**: `localStorage.getItem('wanderwise_community_posts')`<br>&bull; **Saved Trip Places**: `localStorage.getItem('wanderwise_saved_places')`<br>&bull; **Trip Match Chat Session**: `sessionStorage.getItem('wanderwise_trip_match_session')` |
| **Why Vanilla CSS instead of Tailwind/MUI?** | Strict project constraint. Custom properties in `tokens.css` establish a single source of truth for the warm paper palette, Fraunces optical serif typography, layered elevation shadows, and the signature notched ticket geometry with 0 runtime styling overhead and a tiny bundle footprint. |
