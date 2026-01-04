
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Box,
  Divider,
  alpha
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import BuildIcon from '@mui/icons-material/Build';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    setDrawerOpen(false);
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const getMenuItems = () => {
    if (!currentUser) {
      return [
        { text: 'Pricing', link: '/pricing' },
        { text: 'FAQ', link: '/faq' },
        { text: 'Contact', link: '/contact' },
        { text: 'Login', icon: <LockOpenIcon />, link: '/login' },
        { text: 'List Barbershop', icon: <StorefrontIcon />, link: '/signup', variant: 'contained' },
      ];
    }

    const baseUserMenu = [
      { text: 'My Profile', icon: <AccountCircleIcon />, link: '/my-profile' },
      { text: 'Logout', icon: <ExitToAppIcon />, action: handleLogout },
    ];

    switch (userRole) {
      case 'admin':
        return [
          { text: 'Admin Dashboard', icon: <AdminPanelSettingsIcon />, link: '/admin-dashboard' },
          { text: 'User Management', icon: <GroupIcon />, link: '/admin/users' },
          ...baseUserMenu
        ];
      case 'barbershop_owner':
        return [
          { text: 'Owner Dashboard', icon: <DashboardIcon />, link: '/owner-dashboard' },
          { text: 'My Barbershop', icon: <BuildIcon />, link: '/barbershop-profile' },
          ...baseUserMenu
        ];
      case 'client':
      default:
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard' },
          { text: 'My Appointments', icon: <CalendarMonthIcon />, link: '/my-appointments' },
          ...baseUserMenu
        ];
    }
  };

  const menuItems = getMenuItems();

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', width: '100%', bgcolor: 'background.paper', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'secondary.main', color: 'white' }}>
        <ContentCutIcon sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight="bold">Sona</Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={item.link ? Link : 'button'}
              to={item.link}
              onClick={item.action}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon sx={{ color: 'text.primary' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: theme.zIndex.appBar,
        backgroundColor: alpha(theme.palette.background.default, 0.7),
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 1)}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 800,
            letterSpacing: '-0.5px'
          }}
        >
          <ContentCutIcon sx={{ mr: 1, fontSize: '1.8rem' }} />
          Sona
        </Typography>

        {isMobile ? (
          <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {menuItems.map(item => (
              <Button
                key={item.text}
                color="inherit"
                variant={item.variant || 'text'}
                component={item.link ? Link : 'button'}
                to={item.link}
                onClick={item.action}
                startIcon={item.icon}
                sx={{
                  borderRadius: '10px',
                  px: 2,
                  fontWeight: 500,
                  color: item.variant === 'contained' ? 'white' : 'text.primary',
                  '&:hover': {
                    backgroundColor: item.variant === 'contained' ? 'primary.dark' : alpha(theme.palette.text.primary, 0.05),
                  }
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        )}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          PaperProps={{
            sx: {
              width: 280,
              backgroundColor: theme.palette.background.default,
              backgroundImage: 'none'
            }
          }}
        >
          {drawer}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
