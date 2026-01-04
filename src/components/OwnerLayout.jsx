import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBarbershop } from '../contexts/BarbershopContext';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    CircularProgress,
    Button,
    Alert
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SettingsIcon from '@mui/icons-material/Settings'; // Reusing settings icon
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const drawerWidth = 260;

const OwnerLayout = () => {
    const { currentUser, logout } = useAuth();
    const { barbershop, loading } = useBarbershop();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    // Loading State
    if (loading) {
        return <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>;
    }

    // Redirect if no barbershop exists (and we aren't already on the profile page - wait, this layout is FOR dashboard apps, profile is separate usually? 
    // Actually, in App.jsx, /barbershop-profile is OUTSIDE OwnerLayout (OwnerRoute -> BarbershopProfile). 
    // So if we are here, we EXPECT a shop.
    if (!barbershop) {
        return (
            <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 3, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">Setup Required</Typography>
                <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
                    You haven't set up your barbershop profile yet. Please complete the setup to access your dashboard.
                </Typography>
                <Button variant="contained" size="large" onClick={() => navigate('/barbershop-profile')}>
                    Create Barbershop Profile
                </Button>
                <Button sx={{ mt: 2 }} onClick={handleLogout}>Sign Out</Button>
            </Box>
        );
    }

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, link: '/owner-dashboard' },
        { text: 'Appointments', icon: <EventIcon />, link: '/owner/appointments' },
        { text: 'Services', icon: <ContentCutIcon />, link: '/owner/services' },
        { text: 'Staff', icon: <PeopleIcon />, link: '/owner/staff' },
        { text: 'Clients', icon: <GroupIcon />, link: '/owner/clients' },
        { text: 'Financials', icon: <AttachMoneyIcon />, link: '/owner/financials' },
        { text: 'Settings', icon: <SettingsIcon />, link: '/owner/settings' },
    ];

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#121214' }}>
            <Toolbar sx={{ px: 3 }}>
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800, background: 'linear-gradient(45deg, #8B5CF6 30%, #3B82F6 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    SONA OWNER
                </Typography>
            </Toolbar>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
            <List sx={{ px: 2, flexGrow: 1, py: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            onClick={() => navigate(item.link)}
                            selected={location.pathname === item.link}
                            sx={{
                                borderRadius: '12px',
                                '&.Mui-selected': {
                                    bgcolor: 'rgba(139, 92, 246, 0.15)',
                                    color: '#A78BFA',
                                    '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.25)' },
                                    '& .MuiListItemIcon-root': { color: '#A78BFA' }
                                },
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
            <List sx={{ px: 2 }}>
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/barbershop-profile" sx={{ borderRadius: '12px', mb: 1 }}>
                        <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}><SettingsIcon /></ListItemIcon>
                        <ListItemText primary="Edit Profile" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout} sx={{ borderRadius: '12px', color: 'error.main', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}>
                        <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Sign Out" primaryTypographyProps={{ fontWeight: 500 }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    bgcolor: 'rgba(18, 18, 20, 0.8)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {menuItems.find(i => i.link === location.pathname)?.text || 'Dashboard'}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {!barbershop.approved && (
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'warning.main', bgcolor: 'rgba(245, 158, 11, 0.1)', px: 2, py: 0.5, borderRadius: '20px', mr: 2 }}>
                                <WarningAmberIcon sx={{ mr: 1, fontSize: 20 }} />
                                <Typography variant="caption" fontWeight="bold">PENDING APPROVAL</Typography>
                            </Box>
                        )}
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
                            {barbershop.name}
                        </Typography>
                        <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                            <Avatar src={barbershop.imageUrl} sx={{ bgcolor: 'secondary.main' }}>{barbershop.name[0]}</Avatar>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => navigate('/barbershop-profile')}>Shop Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(255,255,255,0.05)' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, md: 3 },
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    mt: 8
                }}
            >
                {!barbershop.approved && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        Your barbershop is currently pending approval. It will not be visible to clients until an administrator approves it.
                    </Alert>
                )}
                <Outlet />
            </Box>
        </Box>
    );
};

export default OwnerLayout;
