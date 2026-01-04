import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
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
    useTheme,
    useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';

const drawerWidth = 280;

const AdminLayout = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin-dashboard' },
        { text: 'Financials', icon: <AttachMoneyIcon />, path: '/admin/financials' },
        { text: 'Bookings', icon: <BookOnlineIcon />, path: '/admin/bookings' },
        { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
        { text: 'Platform Plans', icon: <InfoIcon />, path: '/admin/platform' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
    ];

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#111827', color: 'white' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                    p: 1,
                    bgcolor: 'primary.main',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <ContentCutIcon sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                    Sona Admin
                </Typography>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

            <List sx={{ flexGrow: 1, px: 2, py: 3 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            selected={location.pathname === item.path}
                            sx={{
                                borderRadius: '12px',
                                '&.Mui-selected': {
                                    bgcolor: 'primary.main',
                                    '&:hover': { bgcolor: 'primary.dark' },
                                    '& .MuiListItemIcon-root': { color: 'white' }
                                },
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? 'white' : 'rgba(255,255,255,0.7)' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Box sx={{ p: 2 }}>
                <Box sx={{ p: 2, borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.05)', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'secondary.main' }}>
                            {currentUser?.email?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ overflow: 'hidden' }}>
                            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>Admin User</Typography>
                            <Typography variant="caption" noWrap sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                                {currentUser?.email}
                            </Typography>
                        </Box>
                    </Box>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            borderRadius: '8px',
                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                            color: '#EF4444',
                            justifyContent: 'center',
                            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' }
                        }}
                    >
                        <LogoutIcon sx={{ fontSize: 18, mr: 1 }} />
                        <Typography variant="body2" fontWeight="600">Logout</Typography>
                    </ListItemButton>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Top Bar for Mobile */}
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    display: { md: 'none' }, // Check if we want a top bar on desktop, usually dashboard has one. 
                    // Let's hide it on desktop for cleaner look if we don't have global search yet.
                    // Or keep it simple for mobile only first.
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
                    <Typography variant="h6" noWrap component="div">
                        Sona Admin
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Navigation Drawer */}
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            >
                {/* Mobile Drawer */}
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

                {/* Desktop Permanent Drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main Content Area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, md: 3 },
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    bgcolor: 'background.default',
                    minHeight: '100vh',
                    pt: { xs: 8, md: 3 } // Padding top for mobile header
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;
