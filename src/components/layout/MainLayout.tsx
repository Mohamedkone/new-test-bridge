import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { DRAWER_WIDTH } from '../../utils/constants';

interface MainLayoutProps {
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ title }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Sidebar Navigation */}
      <Sidebar 
        open={!isMobile || mobileOpen} 
        onClose={() => setMobileOpen(false)}
        variant={isMobile ? 'temporary' : 'permanent'}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Box mb={5}>
        {/* Top Navigation */}
        <TopNavbar 
          title={title} 
          />
        </Box>

        {/* Page Content */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3 },
            bgcolor: '#f8fafc',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;