import React, { useState, useEffect, useCallback } from 'react';
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase'; // Correct path to firebase
import { useAuth } from '../../contexts/AuthContext';
import {
    Box,
    Button,
    TextField,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    Alert,
    Grid,
    InputAdornment,
    Container,
    Card,
    CardMedia,
    CardContent,
    CardActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const OwnerServices = () => {
    const { currentUser } = useAuth();
    const [barbershopId, setBarbershopId] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);

    // Form State
    const [formState, setFormState] = useState({ name: '', duration: '', price: '', description: '' });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    // Fetch Barbershop ID first
    const fetchBarbershopId = useCallback(async () => {
        if (!currentUser) return;
        try {
            const q = query(collection(db, 'barbershops'), where('ownerId', '==', currentUser.uid));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setBarbershopId(querySnapshot.docs[0].id);
            } else {
                setError('Barbershop profile not found. Please create your profile first.');
                setLoading(false);
            }
        } catch (err) {
            console.error("Error fetching barbershop:", err);
            setError('Failed to load barbershop profile.');
            setLoading(false);
        }
    }, [currentUser]);

    // Fetch Services once Barbershop ID is known
    const fetchServices = useCallback(async () => {
        if (!barbershopId) return;
        try {
            setLoading(true);
            const servicesRef = collection(db, 'barbershops', barbershopId, 'services');
            const q = query(servicesRef);
            const querySnapshot = await getDocs(q);
            const servicesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setServices(servicesList);
        } catch (err) {
            console.error("Error fetching services:", err);
            setError('Failed to load services.');
        } finally {
            setLoading(false);
        }
    }, [barbershopId]);

    useEffect(() => {
        fetchBarbershopId();
    }, [fetchBarbershopId]);

    useEffect(() => {
        if (barbershopId) {
            fetchServices();
        }
    }, [barbershopId, fetchServices]);

    const handleClickOpen = (service = null) => {
        setCurrentService(service);
        setFormState(service
            ? { name: service.name, duration: service.duration, price: service.price, description: service.description || '' }
            : { name: '', duration: '', price: '', description: '' }
        );
        setPreviewUrl(service?.imageUrl || '');
        setImageFile(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentService(null);
        setImageFile(null);
        setPreviewUrl('');
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const updateBarbershopPrices = async (currentServices) => {
        if (!barbershopId || currentServices.length === 0) return;

        const prices = currentServices.map(s => Number(s.price)).filter(p => !isNaN(p));
        if (prices.length === 0) return;

        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        try {
            await updateDoc(doc(db, 'barbershops', barbershopId), {
                minPrice,
                maxPrice,
                priceRange: minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`
            });
        } catch (err) {
            console.error("Error updating barbershop prices:", err);
        }
    };

    const handleSave = async () => {
        if (!formState.name || !formState.duration || !formState.price) {
            // Basic validation
            alert('Name, Duration, and Price are required.');
            return;
        }

        setUploading(true);
        let imageUrl = currentService?.imageUrl || '';

        try {
            // Upload Image if selected
            if (imageFile) {
                const storageRef = ref(storage, `services/${barbershopId}/${Date.now()}_${imageFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, imageFile);

                await new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        null,
                        (error) => reject(error),
                        async () => {
                            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve();
                        }
                    );
                });
            }

            const serviceData = {
                ...formState,
                imageUrl,
                updatedAt: new Date()
            };

            const servicesRef = collection(db, 'barbershops', barbershopId, 'services');
            let updatedServicesList = [];

            if (currentService) {
                await updateDoc(doc(servicesRef, currentService.id), serviceData);
                updatedServicesList = services.map(s => s.id === currentService.id ? { ...s, id: s.id, ...serviceData } : s);
                setServices(updatedServicesList);
            } else {
                const docRef = await addDoc(servicesRef, { ...serviceData, createdAt: new Date() });
                updatedServicesList = [...services, { id: docRef.id, ...serviceData }];
                setServices(updatedServicesList);
            }

            // Update parent document with new price range
            await updateBarbershopPrices(updatedServicesList);

            handleClose();
        } catch (err) {
            console.error("Error saving service:", err);
            alert("Failed to save service.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (serviceId) => {
        if (!window.confirm("Delete this service?")) return;
        try {
            await deleteDoc(doc(db, 'barbershops', barbershopId, 'services', serviceId));
            const updatedServicesList = services.filter(s => s.id !== serviceId);
            setServices(updatedServicesList);

            // Update parent document with new price range
            await updateBarbershopPrices(updatedServicesList);
        } catch (err) {
            console.error("Error deleting service:", err);
            alert("Failed to delete service.");
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>Services</Typography>
                    <Typography color="text.secondary">Manage your service menu</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => handleClickOpen()}
                    disabled={!barbershopId}
                    sx={{ borderRadius: '10px', px: 3, py: 1 }}
                >
                    Add Service
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
            ) : (
                <Grid container spacing={3}>
                    {services.map((service) => (
                        <Grid item xs={12} sm={6} md={4} key={service.id}>
                            <Card sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                bgcolor: 'background.paper',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-4px)' }
                            }}>
                                {service.imageUrl && (
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={service.imageUrl}
                                        alt={service.name}
                                    />
                                )}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" gutterBottom fontWeight="bold">{service.name}</Typography>
                                    <Box sx={{ display: 'flex', gap: 2, mb: 2, color: 'text.secondary' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <AccessTimeIcon fontSize="small" />
                                            <Typography variant="body2">{service.duration} min</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <AttachMoneyIcon fontSize="small" />
                                            <Typography variant="body2">${service.price}</Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{
                                        display: '-webkit-box',
                                        overflow: 'hidden',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 2
                                    }}>
                                        {service.description || "No description provided."}
                                    </Typography>
                                </CardContent>
                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                                    <Button size="small" startIcon={<EditIcon />} onClick={() => handleClickOpen(service)}>Edit</Button>
                                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(service.id)}>Delete</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                    {!loading && services.length === 0 && (
                        <Grid item xs={12}>
                            <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'transparent', border: '2px dashed rgba(255,255,255,0.1)' }}>
                                <Typography color="text.secondary">No services found. Add your first service to get started.</Typography>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            )}

            {/* Dialog for Add/Edit */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{currentService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Box
                                    component="img"
                                    src={previewUrl || 'https://via.placeholder.com/150?text=Service+Image'}
                                    sx={{ width: 150, height: 150, objectFit: 'cover', borderRadius: '12px', bgcolor: 'action.hover' }}
                                />
                                <IconButton
                                    color="primary"
                                    aria-label="upload picture"
                                    component="label"
                                    sx={{ position: 'absolute', bottom: -8, right: -8, bgcolor: 'background.paper', '&:hover': { bgcolor: 'background.default' } }}
                                >
                                    <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                                    <PhotoCamera />
                                </IconButton>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                name="name"
                                label="Service Name"
                                fullWidth
                                value={formState.name}
                                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="duration"
                                label="Duration (min)"
                                type="number"
                                fullWidth
                                value={formState.duration}
                                onChange={(e) => setFormState({ ...formState, duration: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="price"
                                label="Price ($)"
                                type="number"
                                fullWidth
                                value={formState.price}
                                onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="description"
                                label="Description"
                                multiline
                                rows={3}
                                fullWidth
                                value={formState.description}
                                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClose} disabled={uploading}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" disabled={uploading}>
                        {uploading ? <CircularProgress size={24} /> : 'Save Service'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default OwnerServices;
