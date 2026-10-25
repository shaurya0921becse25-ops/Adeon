import React from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { ChatProvider } from './context/ChatContext';
import './styles/tokens.css';
import './styles/base.css';
import './styles/ui.css';

/**
 * Provides Toast, Auth, Booking, and Chat contexts to connected Abeon User Guide pages
 */
export default function UserGuideWrapper({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <BookingProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </BookingProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
