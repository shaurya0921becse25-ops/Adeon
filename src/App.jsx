import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { TripProvider } from './context/TripContext';

import Navbar from './components/layout/Navbar';
import TravelerGatePreloader from './components/common/TravelerGatePreloader';

import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import Community from './pages/Community';
import ItineraryPage from './pages/ItineraryPage';
import Chatbot from './pages/Chatbot';
import NotFound from './pages/NotFound';
import Profile from './modules/profile/Profile';
import AuthPage from './modules/auth/AuthPage';
import GuideApp from './modules/guide/App';

// Abeon / User Guide sub-pages
import UserGuideWrapper from './modules/user-guide/UserGuideWrapper';
import { TripPage } from './modules/user-guide/pages/TripPage';
import { ServiceDetailsPage } from './modules/user-guide/pages/ServiceDetailsPage';
import { ProviderProfile } from './modules/user-guide/pages/ProviderProfile';
import { Trips } from './modules/user-guide/pages/Trips';
import { Chat } from './modules/user-guide/pages/Chat';

/**
 * Route guard that requires active authentication.
 * If user is not signed in, redirects to /signin.
 * If user has mismatched role, redirects to their assigned role root.
 */
function RequireAuth({ children, allowedRole = null }) {
  const { user, userRole } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    if (userRole === 'guide') {
      return <Navigate to="/guide" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

/**
 * Route guard for public-only pages (Sign In / Sign Up).
 * Authenticated users are redirected to their respective role home.
 */
function PublicOnlyRoute({ children }) {
  const { user, userRole } = useAuth();

  if (user) {
    if (userRole === 'guide') {
      return <Navigate to="/guide" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

/**
 * Route handler for /dashboard alias.
 * Routes authenticated guides to their Host Hub dashboard,
 * and authenticated travelers to their itinerary dashboard.
 */
function DashboardRedirect() {
  const { userRole } = useAuth();
  if (userRole === 'guide') {
    return <Navigate to="/guide" replace />;
  }
  return <Navigate to="/itinerary" replace />;
}

function RootRedirect() {
  const { user, userRole } = useAuth();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  if (userRole === 'guide') {
    return <Navigate to="/guide" replace />;
  }
  return <Home />;
}

/**
 * App Shell managing conditional layout chrome.
 * Traveler navbar and footer are hidden on Auth pages and Guide portal.
 */
function AppShell() {
  const { user, userRole } = useAuth();
  const location = useLocation();

  const isAuthPage =
    location.pathname === '/signin' ||
    location.pathname === '/signup' ||
    (location.pathname === '/' && !user);
  const isGuidePage = location.pathname.startsWith('/guide');
  const showTravelerChrome = !isAuthPage && !isGuidePage && userRole !== 'guide';

  return (
    <div className="app-shell">
      {showTravelerChrome && <TravelerGatePreloader />}
      {showTravelerChrome && <Navbar />}

      <Routes>
        {/* Authentication Routes from sign-in-up-profile */}
        <Route
          path="/signin"
          element={
            <PublicOnlyRoute>
              <AuthPage initialMode="signin" />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <AuthPage initialMode="signup" />
            </PublicOnlyRoute>
          }
        />
        <Route path="/login" element={<Navigate to="/signin" replace />} />

        {/* Traveler Primary Routes (With full navigation bar) */}
        <Route path="/" element={<RootRedirect />} />
        <Route
          path="/services"
          element={
            <RequireAuth allowedRole="traveler">
              <ServicesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/community"
          element={
            <RequireAuth allowedRole="traveler">
              <Community />
            </RequireAuth>
          }
        />
        <Route
          path="/itinerary"
          element={
            <RequireAuth allowedRole="traveler">
              <ItineraryPage />
            </RequireAuth>
          }
        />
        <Route
          path="/itinerary/:tripId"
          element={
            <RequireAuth allowedRole="traveler">
              <ItineraryPage />
            </RequireAuth>
          }
        />
        <Route
          path="/trip-match"
          element={
            <RequireAuth allowedRole="traveler">
              <Chatbot />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth allowedRole="traveler">
              <Profile />
            </RequireAuth>
          }
        />

        {/* Dedicated Abeon Himachal Host Hub Guide Portal (Without traveler navbar) */}
        <Route
          path="/guide/*"
          element={
            <RequireAuth allowedRole="guide">
              <GuideApp />
            </RequireAuth>
          }
        />

        {/* Abeon / User Guide Sub-Routes */}
        <Route
          path="/trip"
          element={
            <RequireAuth allowedRole="traveler">
              <UserGuideWrapper>
                <TripPage />
              </UserGuideWrapper>
            </RequireAuth>
          }
        />
        <Route
          path="/service/:id"
          element={
            <RequireAuth allowedRole="traveler">
              <UserGuideWrapper>
                <ServiceDetailsPage />
              </UserGuideWrapper>
            </RequireAuth>
          }
        />
        <Route
          path="/service-details"
          element={
            <RequireAuth allowedRole="traveler">
              <UserGuideWrapper>
                <ServiceDetailsPage />
              </UserGuideWrapper>
            </RequireAuth>
          }
        />
        <Route
          path="/provider/:id"
          element={
            <RequireAuth allowedRole="traveler">
              <UserGuideWrapper>
                <ProviderProfile />
              </UserGuideWrapper>
            </RequireAuth>
          }
        />
        <Route
          path="/trips"
          element={
            <RequireAuth allowedRole="traveler">
              <UserGuideWrapper>
                <Trips />
              </UserGuideWrapper>
            </RequireAuth>
          }
        />
        <Route
          path="/chat"
          element={
            <RequireAuth>
              <UserGuideWrapper>
                <Chat />
              </UserGuideWrapper>
            </RequireAuth>
          }
        />

        {/* Aliases */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardRedirect />
            </RequireAuth>
          }
        />
        <Route path="/chatbot" element={<Navigate to="/trip-match" replace />} />

        {/* Fallback 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <TripProvider>
              <BrowserRouter>
                <AppShell />
              </BrowserRouter>
            </TripProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
