import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
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
    MenuItem,
    IconButton,
    Avatar
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

const OwnerSettings = () => {
    const { currentUser } = useAuth();
    const [barbershopId, setBarbershopId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ open: false, text: '', severity: 'success' });

    // Profile State
    const [profileData, setProfileData] = useState({
        description: '',
        imageUrl: '',
        gallery: []
    });
    const [newProfileImage, setNewProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState('');
    const [newGalleryImages, setNewGalleryImages] = useState([]);

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
        import('firebase/firestore').then(async ({ collection, query, where, getDocs }) => {
            if (!currentUser) return;
            const q = query(collection(db, 'barbershops'), where('ownerId', '==', currentUser.uid));
            const snap = await getDocs(q);
            if (!snap.empty) {
                const doc = snap.docs[0];
                const data = doc.data();
                setBarbershopId(doc.id);
                setSettings(prev => ({ ...prev, ...(data.settings || {}) }));
                setProfileData({
                    description: data.description || '',
                    imageUrl: data.imageUrl || '',
                    gallery: data.gallery || []
                });
                setProfileImagePreview(data.imageUrl || '');
            }
            setLoading(false);
        });
    }, [currentUser]);

    const handleSettingsChange = (e) => {
        const { name, value, checked, type } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileImageChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setNewProfileImage(file);
            setProfileImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryImageChange = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setNewGalleryImages(prev => [...prev, ...files]);
        }
    };

    const removeGalleryImage = (index, isNew = false) => {
        if (isNew) {
            setNewGalleryImages(prev => prev.filter((_, i) => i !== index));
        } else {
            setProfileData(prev => ({
                ...prev,
                gallery: prev.gallery.filter((_, i) => i !== index)
            }));
        }
    };

    const handleSave = async () => {
        if (!barbershopId) return;
        setSaving(true);
        try {
            let updatedImageUrl = profileData.imageUrl;
            const updatedGallery = [...profileData.gallery];

            // Upload Profile Image
            if (newProfileImage) {
                const storageRef = ref(storage, `barbershops/${barbershopId}/profile_${Date.now()}`);
                const uploadTask = uploadBytesResumable(storageRef, newProfileImage);
                await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed', null, reject, async () => {
                        updatedImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve();
                    });
                });
            }

            // Upload Gallery Images
            for (const file of newGalleryImages) {
                const storageRef = ref(storage, `barbershops/${barbershopId}/gallery_${Date.now()}_${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);
                await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed', null, reject, async () => {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        updatedGallery.push(url);
                        resolve();
                    });
                });
            }

            const shopRef = doc(db, 'barbershops', barbershopId);
            await updateDoc(shopRef, {
                settings,
                description: profileData.description,
                imageUrl: updatedImageUrl,
                gallery: updatedGallery
            });

            // Update local state to reflect saved changes
            setNewProfileImage(null);
            setNewGalleryImages([]);
            setProfileData(prev => ({
                ...prev,
                imageUrl: updatedImageUrl,
                gallery: updatedGallery
            }));

            setMessage({ open: true, text: 'Changes saved successfully', severity: 'success' });
        } catch (error) {
            console.error(error);
            setMessage({ open: true, text: 'Failed to save changes', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Container sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Container>;

    return (
        <Container maxWidth="md">
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>Settings & Profile</Typography>
                    <Typography color="text.secondary">Manage your business appearance and rules.</Typography>
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

            {/* Public Profile Section */}
            <Paper sx={{ p: 4, borderRadius: '16px', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Public Profile</Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={4}>
                    {/* Profile Image */}
                    <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ position: 'relative', mb: 2 }}>
                            <Avatar
                                src={profileImagePreview || 'https://via.placeholder.com/150'}
                                sx={{ width: 150, height: 150, border: '4px solid rgba(255,255,255,0.1)' }}
                            />
                            <IconButton
                                color="primary"
                                aria-label="upload picture"
                                component="label"
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    bgcolor: 'background.paper',
                                    boxShadow: 2,
                                    '&:hover': { bgcolor: 'background.default' }
                                }}
                            >
                                <input hidden accept="image/*" type="file" onChange={handleProfileImageChange} />
                                <PhotoCamera />
                            </IconButton>
                        </Box>
                        <Typography variant="caption" color="text.secondary">Main Barbershop Photo</Typography>
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12} md={8}>
                        <TextField
                            fullWidth
                            label="About your Barbershop"
                            name="description"
                            multiline
                            rows={5}
                            value={profileData.description}
                            onChange={handleProfileChange}
                            placeholder="Tell customers about your shop, your style, and what makes you unique..."
                            helperText="This text will appear on your public profile page."
                        />
                    </Grid>

                    {/* Gallery */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Gallery</Typography>
                        <Grid container spacing={2}>
                            {profileData.gallery.map((url, index) => (
                                <Grid item xs={6} sm={4} md={3} key={`existing-${index}`}>
                                    <Box sx={{ position: 'relative', paddingTop: '100%' }}>
                                        <Box
                                            component="img"
                                            src={url}
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '12px'
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                bgcolor: 'rgba(0,0,0,0.6)',
                                                color: 'white',
                                                '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                                            }}
                                            onClick={() => removeGalleryImage(index)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Grid>
                            ))}
                            {newGalleryImages.map((file, index) => (
                                <Grid item xs={6} sm={4} md={3} key={`new-${index}`}>
                                    <Box sx={{ position: 'relative', paddingTop: '100%' }}>
                                        <Box
                                            component="img"
                                            src={URL.createObjectURL(file)}
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '12px',
                                                opacity: 0.7
                                            }}
                                        />
                                        <Box sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            bgcolor: 'rgba(59, 130, 246, 0.8)',
                                            color: 'white',
                                            textAlign: 'center',
                                            py: 0.5,
                                            fontSize: '0.75rem',
                                            borderBottomLeftRadius: '12px',
                                            borderBottomRightRadius: '12px'
                                        }}>
                                            New
                                        </Box>
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                bgcolor: 'rgba(0,0,0,0.6)',
                                                color: 'white',
                                                '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                                            }}
                                            onClick={() => removeGalleryImage(index, true)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Grid>
                            ))}
                            <Grid item xs={6} sm={4} md={3}>
                                <Button
                                    component="label"
                                    variant="outlined"
                                    sx={{
                                        width: '100%',
                                        height: 0,
                                        paddingTop: '100%',
                                        position: 'relative',
                                        borderRadius: '12px',
                                        border: '2px dashed rgba(255,255,255,0.2)',
                                        '&:hover': { border: '2px dashed #3B82F6', bgcolor: 'rgba(59, 130, 246, 0.05)' }
                                    }}
                                >
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <AddPhotoAlternateIcon sx={{ fontSize: 40, mb: 1, color: 'text.secondary' }} />
                                        <Typography variant="caption" color="text.secondary">Add Photos</Typography>
                                    </Box>
                                    <input hidden accept="image/*" multiple type="file" onChange={handleGalleryImageChange} />
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

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
                            onChange={handleSettingsChange}
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
                            onChange={handleSettingsChange}
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
                            onChange={handleSettingsChange}
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
                            onChange={handleSettingsChange}
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
                            control={<Switch checked={settings.notificationsEmail} onChange={handleSettingsChange} name="notificationsEmail" />}
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
                            control={<Switch checked={settings.notificationsSms} onChange={handleSettingsChange} name="notificationsSms" />}
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
