// src/pages/oauth/OneDriveCallback.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { oauthService } from '../../services/oauth.service';

const OneDriveCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        console.error('OAuth error:', errorParam);
        navigate('/account?tab=storage&error=onedrive_oauth_failed');
        return;
      }

      if (!code || !user?.id) {
        setError('Invalid OAuth callback parameters');
        setTimeout(() => {
          navigate('/account?tab=storage&error=onedrive_oauth_invalid');
        }, 3000);
        return;
      }

      try {
        const response = await oauthService.handleCallback('onedrive', code, state || '', user.id);
        
        if (response.success) {
          navigate('/account?tab=storage&success=onedrive_connected');
        } else {
          navigate('/account?tab=storage&error=onedrive_oauth_failed');
        }
      } catch (error) {
        console.error('Failed to complete OneDrive OAuth:', error);
        navigate('/account?tab=storage&error=onedrive_oauth_failed');
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, user?.id]);

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh" gap={2}>
        <Alert severity="error">{error}</Alert>
        <Typography>Redirecting to storage settings...</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh" gap={2}>
      <CircularProgress size={60} />
      <Typography variant="h6">Connecting OneDrive...</Typography>
      <Typography variant="body2" color="text.secondary">
        Please wait while we complete the connection process.
      </Typography>
    </Box>
  );
};

export default OneDriveCallback;