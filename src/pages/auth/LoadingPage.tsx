import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Container,
  Avatar,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

export const LoadingPage: React.FC = () => {
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* App Logo */}
        <Avatar
          sx={{
            m: 1,
            bgcolor: 'primary.main',
            width: 64,
            height: 64,
            mb: 3,
          }}
        >
          <CloudUpload sx={{ fontSize: 32 }} />
        </Avatar>

        {/* Loading Spinner */}
        <CircularProgress size={40} sx={{ mb: 2 }} />

        {/* Loading Message */}
        <Typography variant="h6" color="text.secondary">
          Authenticating...
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Please wait while we verify your credentials
        </Typography>
      </Box>
    </Container>
  );
};