import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import {
  Login as LoginIcon,
  Security as SecurityIcon,
  Cloud as CloudIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const LoginPage: React.FC = () => {
  const { login, isLoading, error, isAuthenticated, clearError } = useAuth();
  const { showError } = useNotification();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  // Show error notifications
  useEffect(() => {
    if (error) {
      showError(error);
      clearError();
    }
  }, [error, showError, clearError]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      // Error is handled by the auth context and notification
      console.error('Login error:', error);
    }
  };



  return (
    <Box sx={{ width: '100%' }}>
      {/* Main Login Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Welcome Back
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to access your secure file sharing platform
        </Typography>

        {/* Login Button */}
        <Button
          variant="contained"
          size="large"
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
          onClick={handleLogin}
          disabled={isLoading}
          sx={{
            py: 1.5,
            px: 4,
            fontSize: '1.1rem',
            borderRadius: 2,
            textTransform: 'none',
            minWidth: 200,
          }}
        >
          {isLoading ? 'Signing In...' : 'Sign In with Auth0'}
        </Button>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Additional Info */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          New to our platform?{' '}
          <Typography
            component="span"
            variant="body2"
            color="primary"
            sx={{ fontWeight: 600, cursor: 'pointer' }}
            onClick={handleLogin}
          >
            Create an account
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;