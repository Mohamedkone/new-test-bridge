import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Drawer,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Article as LogsIcon,
  ConnectWithoutContact as BridgeIcon,
  Folder as VaultIcon,
  MeetingRoom as RoomIcon,
  HelpOutline as SupportIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES, DRAWER_WIDTH } from '../../utils/constants';
import { usePermissions } from '../../hooks/usePermission';
import Logo from '../../assets/logo.svg'


interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  variant?: 'permanent' | 'temporary';
}

interface NavigationItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  requiresPermission?: keyof ReturnType<typeof usePermissions>;
}

const Sidebar: React.FC<SidebarProps> = ({ open = true, onClose, variant = 'permanent' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const permissions = usePermissions();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navigationItems: NavigationItem[] = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: ROUTES.DASHBOARD,
      requiresPermission: 'canAccessDashboard',
    },
    {
      text: 'Logs',
      icon: <LogsIcon />,
      path: ROUTES.LOGS,
      requiresPermission: 'canAccessLogs',
    },
    {
      text: 'Bridge',
      icon: <BridgeIcon />,
      path: ROUTES.BRIDGE,
      requiresPermission: 'canAccessBridge',
    },
    {
      text: 'Vault',
      icon: <VaultIcon />,
      path: ROUTES.VAULT,
      requiresPermission: 'canAccessVault',
    },
    {
      text: 'Room',
      icon: <RoomIcon />,
      path: ROUTES.ROOMS,
      requiresPermission: 'canAccessRooms',
    },
  ];

  const filteredNavigationItems = navigationItems.filter(item => {
    if (!item.requiresPermission) return true;
    return permissions[item.requiresPermission];
  });

  const handleNavigate = (path: string) => {
    navigate(path);
    if (onClose && isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 2,
          display:"flex",
          justifyContent:"center",
        }}
      >
          <img src={Logo} width={50} style={{boxShadow:"0 2px 2px #999", borderRadius:"50px", background:"#fff"}}/>
      </Box>


      {/* Navigation */}
      <Box sx={{ flex: 1, px: 2, py:5 }}>
        <List sx={{ py: 0 }}>
          {filteredNavigationItems.map((item) => (
            <ListItem key={item.text} sx={{ px: 0, mb: 0.5 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: '8px',
                  px: 2,
                  py: 1.5,
                  color: location.pathname === item.path ? '#000' : '#64748b',
                  bgcolor: location.pathname === item.path ? '#f1f5f9' : 'transparent',
                  '&:hover': {
                    bgcolor: location.pathname === item.path ? '#f1f5f9' : '#f8fafc',
                  },
                  '&.Mui-selected': {
                    bgcolor: '#f1f5f9',
                    '&:hover': {
                      bgcolor: '#f1f5f9',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'inherit',
                    minWidth: 36,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '14px',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Support */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          sx={{
            borderRadius: '8px',
            px: 2,
            py: 1.5,
            color: '#64748b',
            '&:hover': {
              bgcolor: '#f8fafc',
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: 'inherit',
              minWidth: 36,
            }}
          >
            <SupportIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Support"
            primaryTypographyProps={{
              fontSize: '14px',
              fontWeight: 400,
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  if (variant === 'temporary') {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            borderRight: '1px solid #e2e8f0',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: DRAWER_WIDTH,
          borderRight: '1px solid #e2e8f0',
        },
      }}
      open
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;