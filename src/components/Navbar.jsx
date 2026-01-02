
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
  const { currentUser } = useAuth();
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
        { text: 'List Your Barbershop', icon: <StorefrontIcon />, link: '/signup' },
        { text: 'Login', icon: <LockOpenIcon />, link: '/login' },
        { text: 'Sign Up', icon: <PersonAddIcon />, link: '/signup', variant: 'contained' },
      ];
    }

    const baseUserMenu = [
        { text: 'My Profile', icon: <AccountCircleIcon />, link: '/my-profile' },
        { text: 'Logout', icon: <ExitToAppIcon />, action: handleLogout },
    ];

    switch (currentUser.role) {
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
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', width: 250, bgcolor: 'background.paper', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'secondary.main', color: 'white' }}>
        <ContentCutIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Barber Booking</Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={item.link ? Link : 'button'} to={item.link} onClick={item.action}>
              <ListItemIcon sx={{ color: 'text.primary' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" elevation={0} sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <ContentCutIcon sx={{ mr: 1 }} />
          Barber Booking
        </Typography>

        {isMobile ? (
          <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        ) : (
          <Box>
            {menuItems.map(item => (
                <Button 
                    key={item.text}
                    color="inherit"
                    variant={item.variant || 'text'}
                    component={item.link ? Link : 'button'}
                    to={item.link}
                    onClick={item.action}
                    startIcon={item.icon}
                    sx={{ ml: item.variant === 'contained' ? 2 : 0}}
                >
                    {item.text}
                </Button>
            ))}
          </Box>
        )}
        <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }}>
          {drawer}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
