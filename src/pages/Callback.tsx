import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../utils/constants';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearError } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Clear any existing errors
        clearError();

        // Get authorization code and state from URL params
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Check for errors in the callback
        if (error) {
          throw new Error(errorDescription || error);
        }

        // Check for required parameters
        if (!code || !state) {
          throw new Error('Missing authorization code or state parameter');
        }

        // Handle the social login callback
        const response = await authService.handleSocialCallback(code, state);

        if (response.success && response.data) {
          // Store user data
          authService.storeUser(response.data.user);
          setStatus('success');

          // Redirect to dashboard after a brief success message
          setTimeout(() => {
            navigate(ROUTES.DASHBOARD, { replace: true });
          }, 2000);
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setErrorMessage(error.message || 'Authentication failed');
        setStatus('error');

        // Redirect to login page after showing error
        setTimeout(() => {
          navigate(ROUTES.LOGIN, { replace: true });
        }, 5000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, clearError]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F2F7FC',
        p: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 400,
          textAlign: 'center',
        }}
      >
        {status === 'loading' && (
          <>
            <CircularProgress size={48} sx={{ mb: 3 }} />
            <Typography variant="h6" gutterBottom>
              Completing Sign In...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we verify your authentication.
            </Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <Typography variant="h4" sx={{ color: 'white' }}>
                ✓
              </Typography>
            </Box>
            <Typography variant="h6" gutterBottom color="success.main">
              Sign In Successful!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Redirecting you to your dashboard...
            </Typography>
          </>
        )}

        {status === 'error' && (
          <>
            <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
              <Typography variant="body2">
                {errorMessage}
              </Typography>
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Redirecting you back to the login page...
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AuthCallback;