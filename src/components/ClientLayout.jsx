import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
    BottomNavigation,
    BottomNavigationAction,
    Paper,
    useMediaQuery,
    useTheme
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import StarRateIcon from '@mui/icons-material/StarRate';

const drawerWidth = 260;

const ClientLayout = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard' },
        { text: 'My Appointments', icon: <EventIcon />, link: '/my-appointments' },
        { text: 'Favorites', icon: <FavoriteIcon />, link: '/my-favorites' },
        { text: 'Reviews', icon: <StarRateIcon />, link: '/my-reviews' },
        { text: 'Profile', icon: <PersonIcon />, link: '/my-profile' },
    ];

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
            <Toolbar sx={{ px: 3 }}>
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800, background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    SONA
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
                                    bgcolor: 'rgba(59, 130, 246, 0.1)',
                                    color: 'primary.main',
                                    '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.2)' },
                                    '& .MuiListItemIcon-root': { color: 'primary.main' }
                                }
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
                    <ListItemButton onClick={handleLogout} sx={{ borderRadius: '12px', color: 'error.main' }}>
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
        <Box sx={{ display: 'flex', pb: isMobile ? 7 : 0 }}>
            {/* Desktop App Bar */}
            {/* Desktop App Bar */}
            {!isMobile ? (
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
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                {currentUser?.email}
                            </Typography>
                            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                                <Avatar sx={{ bgcolor: 'secondary.main' }}>{currentUser?.email?.[0].toUpperCase()}</Avatar>
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
                                <MenuItem onClick={() => { handleClose(); navigate('/my-profile'); }}>Profile</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>
            ) : (
                /* Mobile App Bar */
                <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'rgba(18,18,20, 0.95)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 800, background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            SONA
                        </Typography>
                        <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: '0.875rem' }}>{currentUser?.email?.[0].toUpperCase()}</Avatar>
                        </IconButton>
                    </Toolbar>
                </AppBar>
            )}

            {/* Navigation Drawer (Sidebar) - Desktop Only */}
            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 }, display: { xs: 'none', md: 'block' } }}>
                <Drawer
                    variant="permanent"
                    sx={{
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: 'background.paper', borderRight: '1px solid rgba(255,255,255,0.05)' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    flexGrow: 1,
                    p: { xs: 2, md: 3 },
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    mt: { xs: 7, md: 8 },
                    minHeight: '100vh'
                }}
            >
                <Outlet />
            </Box>

            {/* Mobile Bottom Navigation */}
            {isMobile && (
                <Paper
                    sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, borderTop: '1px solid rgba(255,255,255,0.1)' }}
                    elevation={3}
                >
                    <BottomNavigation
                        showLabels
                        value={location.pathname}
                        onChange={(event, newValue) => {
                            navigate(newValue);
                        }}
                        sx={{ bgcolor: '#121214' }}
                    >
                        <BottomNavigationAction label="Home" value="/dashboard" icon={<DashboardIcon />} />
                        <BottomNavigationAction label="Bookings" value="/my-appointments" icon={<EventIcon />} />
                        <BottomNavigationAction label="Favorites" value="/my-favorites" icon={<FavoriteIcon />} />
                        <BottomNavigationAction label="Profile" value="/my-profile" icon={<PersonIcon />} />
                    </BottomNavigation>
                </Paper>
            )}
        </Box>
    );
};

export default ClientLayout;
