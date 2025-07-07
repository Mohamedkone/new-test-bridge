// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress } from '@mui/material';
import { Auth0Provider } from '@auth0/auth0-react';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import Logs from './pages/logs/Logs';
import Vault from './pages/vault/Vault';
import Bridge from './pages/bridge/Bridge';
import AccountSetting from './pages/account/AccountSetting';

// OAuth Callback Components
import GoogleCallback from './pages/oauth/GoogleCallback';
import DropboxCallback from './pages/oauth/DropboxCallback';
import OneDriveCallback from './pages/oauth/OneDriveCallback';

// Theme and Config
import theme from './theme';
import auth0Config from './config/auth0';
import { ROUTES } from './utils/constants';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

// App Routes Component
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route index element={<LoginPage />} />
      </Route>

      {/* OAuth Callback Routes - Public (no auth required) */}
      <Route path="/oauth/google/callback" element={<GoogleCallback />} />
      <Route path="/oauth/dropbox/callback" element={<DropboxCallback />} />
      <Route path="/oauth/onedrive/callback" element={<OneDriveCallback />} />
      
      {/* Legacy callback routes (keeping for backward compatibility) */}
      <Route path="/callbackss" element={<GoogleCallback />} />
      <Route path="/callbacksdrop" element={<DropboxCallback />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        
        {/* Placeholder routes - implement these later */}
        <Route path="logs" element={<Logs />} />
        <Route path="vault" element={<Vault />} />
        <Route path="rooms" element={<div>Rooms Page - Coming Soon</div>} />
        <Route path="bridge" element={<Bridge />} />
        <Route path="join" element={<div>Members Page - Coming Soon</div>} />
        <Route path="settings" element={<div>Settings Page - Coming Soon</div>} />
        <Route path="account" element={<AccountSetting />} />
        
        {/* Default redirect to dashboard */}
        <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <Auth0Provider {...auth0Config}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationProvider>
          <AuthProvider>
            <Router>
              <AppRoutes />
            </Router>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </Auth0Provider>
  );
};

export default App;