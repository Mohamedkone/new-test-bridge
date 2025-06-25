import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { DRAWER_WIDTH, ROUTES } from '../../utils/constants';

interface TopNavbarProps {
  title?: string;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ title = 'Dashboard' }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useNotification();
  
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleProfileNavigation = () => {
    navigate(ROUTES.PROFILE);
    handleProfileClose();
  };

  const handleSettingsNavigation = () => {
    navigate(ROUTES.SETTINGS);
    handleProfileClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Logged out successfully');
      handleProfileClose();
    } catch (error: any) {
      showError(error.message || 'Failed to logout');
    }
  };

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        width: `120px`,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        borderRadius: '50px',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center'
      }}
    >
        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Notifications */}
          <IconButton
            size="large"
            aria-label="show notifications"
            color="inherit"
            onClick={handleNotificationClick}
          >
            <Badge badgeContent={0} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account menu"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleProfileClick}
            color="inherit"
          >
            <Avatar
              src={user?.profilePicture}
              sx={{ width: 32, height: 32 }}
            >
              {user?.firstName?.[0]?.toUpperCase() || user?.email[0].toUpperCase()}
            </Avatar>
          </IconButton>
        </Box>

        {/* Notifications Menu */}
        <Menu
          id="notification-menu"
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: { width: 320, maxHeight: 400 },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Notifications</Typography>
          </Box>
          <Divider />
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No new notifications
            </Typography>
          </Box>
        </Menu>

        {/* Profile Menu */}
        <Menu
          id="profile-menu"
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: { width: 220 },
          }}
        >
          {/* User Info */}
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={user?.profilePicture}
                sx={{ width: 40, height: 40 }}
              >
                {user?.firstName?.[0]?.toUpperCase() || user?.email[0].toUpperCase()}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="subtitle2" noWrap>
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.email}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user?.email}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Divider />

          {/* Menu Items */}
          <MenuItem onClick={handleProfileNavigation}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleSettingsNavigation}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
    </AppBar>
  );
};

export default TopNavbar;