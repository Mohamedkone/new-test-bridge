import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  useTheme,
} from '@mui/material';
import { Outlet } from 'react-router-dom';
import { ENV } from '../../utils/constants';
import Logo from '../../assets/logo.svg'

const AuthLayout: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F2F7FC',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            background: '#fff',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* App Header */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <img src={Logo} width={"50px"} />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: 'primary.main',
                textAlign: 'center',
              }}
            >
              {ENV.APP_NAME}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ textAlign: 'center' }}
            >
              Secure File Sharing & Storage Platform
            </Typography>
          </Box>

          {/* Auth Content */}
          <Outlet />
        </Paper>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            © 2024 {ENV.APP_NAME}. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;