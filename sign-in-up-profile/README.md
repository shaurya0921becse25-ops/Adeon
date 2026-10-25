# ADEON — Profile React Web Application

A fully functional, modular, and accessible React web application named **"Profile"**, meticulously converted from the static `adeon_profile.html` design without the use of iframes, inline style clutter, or extraneous dependency bloat.

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features & Interactivity](#-key-features--interactivity)
3. [Architecture & Component Breakdown](#-architecture--component-breakdown)
4. [File & Directory Structure](#-file--directory-structure)
5. [HTML to React Conversion Mapping](#-html-to-react-conversion-mapping)
6. [Accessibility (a11y) Standards](#-accessibility-a11y-standards)
7. [Design System & CSS Modules](#-design-system--css-modules)
8. [Getting Started & Local Setup](#-getting-started--local-setup)
9. [Conversion Analysis, Pitfalls & Known Considerations](#-conversion-analysis-pitfalls--known-considerations)

---

## 🌟 Project Overview

The **ADEON Profile** application delivers a personal traveler dashboard featuring:
- **Panoramic Cover Banner**: A high-resolution scenic backdrop with subtle overlay gradients.
- **Profile Identification & Stats**: Avatar with error-fallback protection, user display name, handle, bio, travel quote, and real-time travel counters.
- **Interactive Tab Navigation**: Keyboard-accessible tabs for **Trips**, **Comments**, and **Booked Services**.
- **Trip History Panel**: Catalog of visited destinations with dates, coordinates/locations, travel impressions, and dynamic itinerary triggers.
- **Community Engagement**: Community comment feed spanning travel subreddits with overview and detail modes.
- **Booked Services**: Reservation management for hotels, guided activities, and scenic transit.
- **Edit Profile Modal**: Fully controlled, accessible dialog for updating profile details in place.
- **Itinerary Notification & Details Modal**: Non-intrusive toast notification and modal view replacing browser alert popups.

---

## ⚡ Key Features & Interactivity

| Feature | Original HTML (`adeon_profile.html`) | React Implementation |
| :--- | :--- | :--- |
| **Profile State** | Hardcoded DOM elements (`#profileName`, etc.) | Declarative React state initialized via `mockProfileData.js` |
| **Edit Profile Modal** | Imperative DOM value swapping with `document.getElementById` | Controlled dialog with clean separation of form state, auto-focus, ESC handling, and backdrop click dismissal |
| **Tab Navigation** | Class toggling (`tab.classList.toggle('active')`) | Reactive tab switching with full WAI-ARIA tab semantics and arrow key navigation |
| **"View All" Links** | Direct DOM scroll and query selector loop | Prop-driven callback (`onNavigateTab`) with smooth programmatic scroll to navigation tabs |
| **View Itinerary** | Disruptive window `alert()` | Accessible toast notification (`NoticeToast`) + interactive preview modal (`ItineraryModal`) |
| **Image Fallbacks** | Inline `onerror="this.src=..."` | React `onError` state handlers on thumbnails and avatars |
| **Styling** | Monolithic embedded `<style>` block | Scoped **CSS Modules** (`*.module.css`) preserving exact design tokens and typography |

---

## 🏗 Architecture & Component Breakdown

The application follows the single-responsibility principle:

```
src/
├── components/
│   ├── profile/
│   │   ├── Profile.jsx                # Container orchestrator managing profile state & active views
│   │   ├── Profile.module.css         # Layout & page container styling
│   │   ├── CoverBanner.jsx            # Panoramic cover photo banner
│   │   ├── CoverBanner.module.css
│   │   ├── ProfileHead.jsx            # User avatar, identity, quote & 'Edit Profile' button
│   │   ├── ProfileHead.module.css
│   │   ├── ProfileStats.jsx           # Trip, comment, and service counter strip
│   │   ├── ProfileStats.module.css
│   │   ├── ProfileTabs.jsx            # WAI-ARIA accessible tablist navigation
│   │   ├── ProfileTabs.module.css
│   │   ├── TripsPanel.jsx             # Two-column layout: trip cards (left) & sidebar widgets (right)
│   │   ├── TripsPanel.module.css
│   │   ├── TripCard.jsx               # Individual trip entry with photo, meta, and action pill
│   │   ├── TripCard.module.css
│   │   ├── CommentsPanel.jsx          # Dedicated community comments view
│   │   ├── CommentsPanel.module.css
│   │   ├── CommentItem.jsx            # Discussion item with compact overview or expanded detail modes
│   │   ├── CommentItem.module.css
│   │   ├── ServicesPanel.jsx          # Dedicated booked services view
│   │   ├── ServicesPanel.module.css
│   │   ├── ServiceItem.jsx            # Individual booking card with status badge
│   │   ├── ServiceItem.module.css
│   │   ├── EditProfileModal.jsx       # Modal dialog for editing profile information
│   │   ├── EditProfileModal.module.css
│   │   ├── NoticeToast.jsx            # Non-blocking notification banner for itinerary notices
│   │   ├── NoticeToast.module.css
│   │   ├── ItineraryModal.jsx         # Interactive multi-day itinerary preview modal
│   │   └── ItineraryModal.module.css
│   ├── navigation/
│   │   ├── AppHeader.jsx              # Application brand bar & view switcher
│   │   └── AppHeader.module.css
│   └── auth/
│       └── AuthPage.jsx               # Modularized authentication demo page
├── data/
│   └── mockProfileData.js             # Initial profile, trips, comments, and services contracts
├── App.jsx                            # Root application view router
├── main.jsx                           # React 19 entry point
└── index.css                          # Global design tokens, color variables & CSS reset
```

---

## 🔄 HTML to React Conversion Mapping

| Section in `adeon_profile.html` | React Component | Scoped CSS Module |
| :--- | :--- | :--- |
| `<div class="cover">` | `<CoverBanner />` | `CoverBanner.module.css` |
| `<section class="profile-head">` | `<ProfileHead />` | `ProfileHead.module.css` |
| `<div class="stats">` | `<ProfileStats />` | `ProfileStats.module.css` |
| `<nav class="tabs">` | `<ProfileTabs />` | `ProfileTabs.module.css` |
| `<section class="tab-panel" id="trips">` | `<TripsPanel />` | `TripsPanel.module.css` |
| `<div class="trip">` | `<TripCard />` | `TripCard.module.css` |
| `<div class="community-item">` | `<CommentItem />` | `CommentItem.module.css` |
| `<section class="tab-panel" id="comments">` | `<CommentsPanel />` | `CommentsPanel.module.css` |
| `<div class="service">` | `<ServiceItem />` | `ServiceItem.module.css` |
| `<section class="tab-panel" id="services">` | `<ServicesPanel />` | `ServicesPanel.module.css` |
| `<div class="modal-backdrop" id="editModal">` | `<EditProfileModal />` | `EditProfileModal.module.css` |
| `showNotice(...)` | `<NoticeToast />` & `<ItineraryModal />` | `NoticeToast.module.css` |

---

## ♿ Accessibility (a11y) Standards

- **Tab Roles & Keyboard Navigation**:
  - `role="tablist"`, `role="tab"`, and `role="tabpanel"` applied to navigation and panels.
  - Arrow keys (`ArrowLeft`, `ArrowRight`) cycle between tabs smoothly.
  - Correct `aria-selected` and `aria-controls` bindings.
- **Modal Dialog Semantics**:
  - `role="dialog"` and `aria-modal="true"`.
  - Labelled via `aria-labelledby="modalTitle"`.
  - Keyboard dismissal via `Escape` key.
  - Auto-focus on the primary form input upon mounting.
- **Live Notifications**:
  - Itinerary notices use `role="region"` and `aria-live="polite"` so screen readers are promptly informed without interrupting user speech synthesis.
- **Image Accessibility & Fallbacks**:
  - Descriptive `alt` attributes on meaningful images; decorative thumbnail markers marked with `aria-hidden="true"`.
  - Self-healing image error handlers prevent broken image UI.

---

## 🎨 Design System & CSS Modules

The visual identity relies on ADEON's signature earthy-nautical palette:

```css
:root {
  --paper: #faf7f0;  /* Warm canvas background */
  --mist:  #d9e7eb;  /* Soft sea-spray tint */
  --blue:  #91b8c7;  /* Accent blue */
  --stone: #d8bda6;  /* Warm stone contrast */
  --taupe: #765f53;  /* Earthy dark accent */
  --ink:   #294657;  /* Deep nautical navy text */
  --muted: #78909d;  /* Slate secondary text */
  --line:  #e6e8e6;  /* Structural divider borders */
  --white: #fffefa;  /* Card surface white */
}
```

Scoped CSS Modules prevent global selector pollution while preserving responsive breakpoints (`850px` tablet and `480px` mobile).

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### Installation
1. Clone or navigate to the repository directory:
   ```bash
   cd d:/WanderWise/sign-in-up-profile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.

4. Run code quality verification:
   ```bash
   npm run lint
   ```

5. Build for production:
   ```bash
   npm run build
   ```

---

## 💡 Conversion Analysis, Pitfalls & Known Considerations

During the migration from static HTML (`adeon_profile.html`) to dynamic React, several subtle technical challenges were resolved:

1. **State Mutation vs. Direct DOM Manipulation**:
   - *Original*: `document.getElementById('profileName').textContent = ...` directly altered the DOM tree.
   - *React Solution*: Lifted state to `Profile.jsx` with immutable update patterns (`setProfile((prev) => ({ ...prev, ...updated }))`).

2. **Cascading Renders in Dialog Components**:
   - *Challenge*: Synchronously setting form state in an effect upon modal open can trigger cascading re-renders and React Compiler bailouts.
   - *Resolution*: Decomposed `EditProfileModal` into an outer backdrop wrapper and an inner `EditProfileForm` component that mounts only when open, directly initializing state via lazy initializer functions.

3. **Window Alerts vs. User Experience**:
   - *Challenge*: The original `showNotice` invoked `alert(...)`, which blocks the JavaScript thread, breaks user flow, and cannot be styled.
   - *Resolution*: Replaced with a non-blocking `NoticeToast` component combined with an `ItineraryModal` detail view, allowing seamless previewing while retaining the exact notification message.

4. **Image Fallbacks**:
   - *Original*: Inline HTML `onerror="this.src=..."` can cause infinite loops if the fallback URL is invalid.
   - *Resolution*: Managed via localized React component state with guard conditions before applying fallback URLs.
