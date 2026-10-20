import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { TripProvider } from './context/TripContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import Community from './pages/Community';
import ItineraryPage from './pages/ItineraryPage';
import Chatbot from './pages/Chatbot';
import LoginStub from './pages/LoginStub';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <TripProvider>
              <BrowserRouter>
                <div className="app-shell">
                  <Navbar />
                  <Routes>
                    {/* Primary Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/itinerary" element={<ItineraryPage />} />
                    <Route path="/trip-match" element={<Chatbot />} />
                    <Route path="/profile" element={<LoginStub />} />

                    {/* Backward-compatible Aliases */}
                    <Route path="/dashboard" element={<ItineraryPage />} />
                    <Route path="/chatbot" element={<Chatbot />} />
                    <Route path="/login" element={<LoginStub />} />

                    {/* Fallback 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Footer />
                </div>
              </BrowserRouter>
            </TripProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
