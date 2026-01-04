import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Grid,
    Divider,
    Alert,
    CircularProgress
} from '@mui/material';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import SaveIcon from '@mui/icons-material/Save';
import PaletteIcon from '@mui/icons-material/Palette';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SecurityIcon from '@mui/icons-material/Security';

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`settings-tabpanel-${index}`}
            aria-labelledby={`settings-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const AdminSettings = () => {
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Settings State with Defaults
    const [settings, setSettings] = useState({
        siteName: 'Sona',
        primaryColor: '#3B82F6',
        secondaryColor: '#10B981',
        heroTitle: 'Your Style, Elevated to the Max.',
        heroSubtitle: 'Discover and book the best barbershops with a premium, seamless experience.',
        enableStripe: true,
        enablePayPal: false,
        currency: 'USD',
        platformFeePercent: 10,
        allowRegistrations: true,
        requireEmailVerification: false
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, 'platform', 'settings');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (err) {
                console.error("Error fetching settings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSettingChange = (prop) => (event) => {
        const val = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setSettings(prev => ({ ...prev, [prop]: val }));
    };

    const handleSave = async () => {
        setSaving(true);
        setSuccessMsg('');
        try {
            await setDoc(doc(db, 'platform', 'settings'), settings, { merge: true });
            setSuccessMsg('Settings saved successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error("Error saving settings:", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box>;

    return (
        <Box sx={{ pb: 8 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }}>Platform Settings</Typography>

            {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}

            <Paper sx={{ width: '100%', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        px: 2,
                        pt: 2,
                        '& .MuiTab-root': { fontWeight: 700, minHeight: 64 }
                    }}
                >
                    <Tab icon={<PaletteIcon />} iconPosition="start" label="General & Theme" />
                    <Tab icon={<TextFieldsIcon />} iconPosition="start" label="Content & CMS" />
                    <Tab icon={<AttachMoneyIcon />} iconPosition="start" label="Payments" />
                    <Tab icon={<SecurityIcon />} iconPosition="start" label="Security & Access" />
                </Tabs>

                <Box sx={{ p: 4 }}>
                    {/* TAB 0: General & Theme */}
                    <TabPanel value={value} index={0}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>General Information</Typography>
                                <TextField
                                    fullWidth
                                    label="Site Name"
                                    value={settings.siteName || ''}
                                    onChange={handleSettingChange('siteName')}
                                    sx={{ mb: 3 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>Theme Colors</Typography>
                                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                    <Box>
                                        <Typography variant="caption">Primary Color</Typography>
                                        <input
                                            type="color"
                                            value={settings.primaryColor || '#000000'}
                                            onChange={handleSettingChange('primaryColor')}
                                            style={{ display: 'block', width: '100%', height: 40, border: 'none', borderRadius: 4, cursor: 'pointer' }}
                                        />
                                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{settings.primaryColor}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption">Secondary Color</Typography>
                                        <input
                                            type="color"
                                            value={settings.secondaryColor || '#000000'}
                                            onChange={handleSettingChange('secondaryColor')}
                                            style={{ display: 'block', width: '100%', height: 40, border: 'none', borderRadius: 4, cursor: 'pointer' }}
                                        />
                                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{settings.secondaryColor}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* TAB 1: Content & CMS */}
                    <TabPanel value={value} index={1}>
                        <Typography variant="h6" gutterBottom>Hero Section</Typography>
                        <TextField
                            fullWidth
                            label="Hero Title"
                            value={settings.heroTitle || ''}
                            onChange={handleSettingChange('heroTitle')}
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            fullWidth
                            label="Hero Subtitle"
                            multiline
                            rows={2}
                            value={settings.heroSubtitle || ''}
                            onChange={handleSettingChange('heroSubtitle')}
                            sx={{ mb: 3 }}
                        />
                    </TabPanel>

                    {/* TAB 2: Payments */}
                    <TabPanel value={value} index={2}>
                        <Typography variant="h6" gutterBottom>Payment Gateways</Typography>
                        <FormControlLabel
                            control={<Switch checked={settings.enableStripe || false} onChange={handleSettingChange('enableStripe')} />}
                            label="Enable Stripe"
                            sx={{ display: 'block', mb: 1 }}
                        />
                        <FormControlLabel
                            control={<Switch checked={settings.enablePayPal || false} onChange={handleSettingChange('enablePayPal')} />}
                            label="Enable PayPal"
                            sx={{ display: 'block', mb: 3 }}
                        />

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" gutterBottom>Platform Fees</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Platform Fee (%)"
                                    type="number"
                                    value={settings.platformFeePercent || 0}
                                    onChange={handleSettingChange('platformFeePercent')}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Currency"
                                    value={settings.currency || ''}
                                    onChange={handleSettingChange('currency')}
                                    helperText="ISO Code (e.g. USD, EUR)"
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* TAB 3: Security */}
                    <TabPanel value={value} index={3}>
                        <Typography variant="h6" gutterBottom>Access Control</Typography>
                        <FormControlLabel
                            control={<Switch checked={settings.allowRegistrations || false} onChange={handleSettingChange('allowRegistrations')} />}
                            label="Allow New User Registrations"
                            sx={{ display: 'block', mb: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
                            If disabled, only Admins can create new accounts.
                        </Typography>

                        <FormControlLabel
                            control={<Switch checked={settings.requireEmailVerification || false} onChange={handleSettingChange('requireEmailVerification')} />}
                            label="Require Email Verification"
                            sx={{ display: 'block', mb: 1 }}
                        />
                    </TabPanel>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                            onClick={handleSave}
                            disabled={saving}
                            sx={{ borderRadius: '12px', px: 4 }}
                        >
                            {saving ? 'Saving...' : 'Save All Settings'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default AdminSettings;
