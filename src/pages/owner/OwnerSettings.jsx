import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import {
    Container,
    Typography,
    Box,
    Paper,
    Switch,
    FormControlLabel,
    TextField,
    Button,
    Divider,
    CircularProgress,
    Snackbar,
    Alert,
    Grid,
    InputAdornment,
    MenuItem
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const OwnerSettings = () => {
    const { currentUser } = useAuth();
    const [barbershopId, setBarbershopId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ open: false, text: '', severity: 'success' });

    // Settings State
    const [settings, setSettings] = useState({
        notificationsEmail: true,
        notificationsSms: false,
        cancellationPolicy: '24h', // 24h, 48h, flexible
        bookingWindow: 30, // days in advance
        slotInterval: 30, // minutes
        currency: 'USD',
        minNotice: 2, // hours
    });

    useEffect(() => {
        // Find Shop ID
        // In a real app we'd query by ownerID once and store context. 
        // Repeating here for modularity in this demo.
        import('firebase/firestore').then(async ({ collection, query, where, getDocs }) => {
            if (!currentUser) return;
            const q = query(collection(db, 'barbershops'), where('ownerId', '==', currentUser.uid));
            const snap = await getDocs(q);
            if (!snap.empty) {
                const doc = snap.docs[0];
                setBarbershopId(doc.id);
                // Merge existing settings if any
                if (doc.data().settings) {
                    setSettings(prev => ({ ...prev, ...doc.data().settings }));
                }
            }
            setLoading(false);
        });
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        if (!barbershopId) return;
        setSaving(true);
        try {
            const shopRef = doc(db, 'barbershops', barbershopId);
            await updateDoc(shopRef, { settings });
            setMessage({ open: true, text: 'Settings saved successfully', severity: 'success' });
        } catch (error) {
            console.error(error);
            setMessage({ open: true, text: 'Failed to save settings', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Container sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Container>;

    return (
        <Container maxWidth="md">
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>Settings</Typography>
                    <Typography color="text.secondary">Configure your business rules and preferences.</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={!saving && <SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ borderRadius: '10px' }}
                >
                    {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                </Button>
            </Box>

            <Paper sx={{ p: 4, borderRadius: '16px', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Booking Rules</Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            label="Cancellation Policy"
                            name="cancellationPolicy"
                            value={settings.cancellationPolicy}
                            onChange={handleChange}
                            helperText="When can customers cancel for free?"
                        >
                            <MenuItem value="flexible">Flexible (Any time)</MenuItem>
                            <MenuItem value="24h">24 Hours in advance</MenuItem>
                            <MenuItem value="48h">48 Hours in advance</MenuItem>
                            <MenuItem value="strict">Strict (Non-refundable)</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Booking Window"
                            name="bookingWindow"
                            value={settings.bookingWindow}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">days</InputAdornment>,
                            }}
                            helperText="How far in advance can clients book?"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            type="number"
                            fullWidth
                            label="Minimum Notice"
                            name="minNotice"
                            value={settings.minNotice}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">hours</InputAdornment>,
                            }}
                            helperText="Minimum notice for online bookings"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            label="Currency"
                            name="currency"
                            value={settings.currency}
                            onChange={handleChange}
                        >
                            <MenuItem value="USD">USD ($)</MenuItem>
                            <MenuItem value="EUR">EUR (€)</MenuItem>
                            <MenuItem value="BRL">BRL (R$)</MenuItem>
                            <MenuItem value="GBP">GBP (£)</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: '16px' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Notifications</Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Switch checked={settings.notificationsEmail} onChange={handleChange} name="notificationsEmail" />}
                            label={
                                <Box>
                                    <Typography fontWeight="500">Email Notifications</Typography>
                                    <Typography variant="caption" color="text.secondary">Receive emails for new bookings and cancellations</Typography>
                                </Box>
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Switch checked={settings.notificationsSms} onChange={handleChange} name="notificationsSms" />}
                            label={
                                <Box>
                                    <Typography fontWeight="500">SMS Notifications</Typography>
                                    <Typography variant="caption" color="text.secondary">Receive text messages (Additional charges may apply)</Typography>
                                </Box>
                            }
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Snackbar open={message.open} autoHideDuration={4000} onClose={() => setMessage({ ...message, open: false })}>
                <Alert severity={message.severity}>{message.text}</Alert>
            </Snackbar>
        </Container>
    );
};

export default OwnerSettings;
