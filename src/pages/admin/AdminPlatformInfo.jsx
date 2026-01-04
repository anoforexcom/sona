import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Alert,
    CircularProgress
} from '@mui/material';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';

const AdminPlatformInfo = () => {
    const [plans, setPlans] = useState([
        { id: 'basic', name: 'Basic Partner', price: 29, features: ['Listing on platform', 'Basic Booking Management', 'Email Support'] },
        { id: 'premium', name: 'Premium Partner', price: 79, features: ['Top placement in search', 'Advanced Analytics', 'Priority Support', 'Marketing Tools'] }
    ]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const docRef = doc(db, 'platform', 'pricing');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().plans) {
                    setPlans(docSnap.data().plans);
                }
            } catch (err) {
                console.error("Error fetching pricing:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handlePlanChange = (index, field, value) => {
        const newPlans = [...plans];
        newPlans[index][field] = value;
        setPlans(newPlans);
    };

    const handleFeatureChange = (planIndex, featureIndex, value) => {
        const newPlans = [...plans];
        newPlans[planIndex].features[featureIndex] = value;
        setPlans(newPlans);
    };

    const handleSave = async () => {
        setSaving(true);
        setSuccessMsg('');
        try {
            await setDoc(doc(db, 'platform', 'pricing'), { plans }, { merge: true });
            setSuccessMsg('Pricing plans saved successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error("Error saving pricing:", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box>;

    return (
        <Box sx={{ pb: 8 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }}>Platform Subscription Plans</Typography>

            {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}

            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                Configure the monthly subscription tiers available to Barbershops.
            </Typography>

            <Grid container spacing={4}>
                {plans.map((plan, index) => (
                    <Grid item xs={12} md={6} key={plan.id}>
                        <Paper sx={{ p: 4, borderRadius: '24px', height: '100%', border: index === 1 ? '1px solid #F59E0B' : '1px solid rgba(255,255,255,0.05)' }}>
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    label="Plan Name"
                                    fullWidth
                                    value={plan.name}
                                    onChange={(e) => handlePlanChange(index, 'name', e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Monthly Price ($)"
                                    type="number"
                                    fullWidth
                                    value={plan.price}
                                    onChange={(e) => handlePlanChange(index, 'price', parseFloat(e.target.value))}
                                />
                            </Box>
                            <Divider sx={{ my: 2 }}>FEATURES</Divider>
                            <List>
                                {plan.features.map((feature, fIndex) => (
                                    <ListItem key={fIndex}>
                                        <ListItemIcon>
                                            <CheckCircleIcon color="primary" />
                                        </ListItemIcon>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={feature}
                                            onChange={(e) => handleFeatureChange(index, fIndex, e.target.value)}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ borderRadius: '12px', px: 4, py: 1.5 }}
                >
                    {saving ? 'Saving...' : 'Save Pricing Plans'}
                </Button>
            </Box>
        </Box>
    );
};

export default AdminPlatformInfo;
