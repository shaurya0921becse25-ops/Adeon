import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Context Providers
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";
import { ChatProvider } from "./context/ChatContext";

// New Standalone Pages Converted Directly from HTML Counterparts (No iframe)
import { SearchPage } from "./pages/SearchPage";
import { TripPage } from "./pages/TripPage";
import { ServiceDetailsPage } from "./pages/ServiceDetailsPage";
import { ProviderProfile } from "./pages/ProviderProfile";

// Connected App Pages for My Trips (History) and Chat
import { Trips } from "./pages/Trips";
import { Chat } from "./pages/Chat";

// Global Styles
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/utilities.css";
import "./styles/ui.css";

// Scroll to top upon navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <BookingProvider>
            <ChatProvider>
              <ScrollToTop />
              <div className="app-shell min-h-screen">
                <Routes>
                  {/* Main Flow */}
                  <Route path="/" element={<SearchPage />} />
                  <Route path="/trip" element={<TripPage />} />
                  <Route path="/service/:id" element={<ServiceDetailsPage />} />
                  <Route path="/service-details" element={<ServiceDetailsPage />} />
                  <Route path="/provider/:id" element={<ProviderProfile />} />
                  <Route path="/guide" element={<ProviderProfile defaultId="guide-agam" />} />

                  {/* Connected My Trips & Chat */}
                  <Route path="/trips" element={<Trips />} />
                  <Route path="/chat" element={<Chat />} />

                  {/* Fallback to main search page */}
                  <Route path="*" element={<SearchPage />} />
                </Routes>
              </div>
            </ChatProvider>
          </BookingProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
