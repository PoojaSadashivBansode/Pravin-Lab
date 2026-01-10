import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './index.css';
import App from './App.jsx';

// ============================================
// GOOGLE CLIENT ID
// ============================================
/**
 * Google OAuth Client ID
 * 
 * Get this from Google Cloud Console:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create/select a project
 * 3. Enable Google+ API
 * 4. Create OAuth 2.0 credentials
 * 5. Add http://localhost:5173 to authorized origins
 * 
 * Store in .env file as VITE_GOOGLE_CLIENT_ID
 */
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// ============================================
// RENDER APPLICATION
// ============================================

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Google OAuth Provider - enables Google Sign-In */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* Auth Provider - provides auth state to entire app */}
      <AuthProvider>
        {/* Cart Provider - provides cart state to entire app */}
        <CartProvider>
          <App />
        {/* Toast Notifications - global toast container */}
        <Toaster 
          position="top-right"
          toastOptions={{
            // Default options for all toasts
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              borderRadius: '8px',
              padding: '12px 16px',
            },
            // Success toast styling
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            // Error toast styling
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
