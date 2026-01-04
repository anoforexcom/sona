import React, { useState, useEffect, useCallback } from 'react';
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    Alert,
    Grid,
    Container,
    Card,
    CardContent,
    Avatar,
    IconButton,
    Tabs,
    Tab,
    FormControlLabel,
    Checkbox,
    Divider,
    Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const initialSchedule = {
    monday: { start: '09:00', end: '18:00', active: true },
    tuesday: { start: '09:00', end: '18:00', active: true },
    wednesday: { start: '09:00', end: '18:00', active: true },
    thursday: { start: '09:00', end: '18:00', active: true },
    friday: { start: '09:00', end: '18:00', active: true },
    saturday: { start: '10:00', end: '16:00', active: true },
    sunday: { start: '10:00', end: '16:00', active: false },
};

const OwnerStaff = () => {
    const { currentUser } = useAuth();
    const [barbershopId, setBarbershopId] = useState(null);
    const [staff, setStaff] = useState([]);
    const [services, setServices] = useState([]); // Available services
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [currentMember, setCurrentMember] = useState(null);
    const [tabValue, setTabValue] = useState(0);

    // Form State
    const [formState, setFormState] = useState({ name: '', title: 'Barber', bio: '', phone: '' });
    const [selectedServices, setSelectedServices] = useState([]);
    const [memberSchedule, setMemberSchedule] = useState(initialSchedule);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    // Fetch Barbershop ID
    const fetchBarbershopId = useCallback(async () => {
        if (!currentUser) return;
        try {
            const q = query(collection(db, 'barbershops'), where('ownerId', '==', currentUser.uid));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setBarbershopId(querySnapshot.docs[0].id);
            } else {
                setError('Barbershop profile not found.');
                setLoading(false);
            }
        } catch (err) {
            console.error("Error:", err);
            setLoading(false);
        }
    }, [currentUser]);

    // Fetch Data
    useEffect(() => {
        fetchBarbershopId();
    }, [fetchBarbershopId]);

    const fetchData = useCallback(async () => {
        if (!barbershopId) return;
        setLoading(true);
        try {
            // Fetch Services first (for linking)
            const servicesRef = collection(db, 'barbershops', barbershopId, 'services');
            const servicesSnap = await getDocs(servicesRef);
            setServices(servicesSnap.docs.map(d => ({ id: d.id, ...d.data() })));

            // Fetch Staff
            const staffRef = collection(db, 'barbershops', barbershopId, 'professionals');
            const staffSnap = await getDocs(staffRef);
            setStaff(staffSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) {
            console.error(err);
            setError('Failed to load data.');
        } finally {
            setLoading(false);
        }
    }, [barbershopId]);

    useEffect(() => {
        if (barbershopId) fetchData();
    }, [barbershopId, fetchData]);


    const handleClickOpen = (member = null) => {
        setCurrentMember(member);
        if (member) {
            setFormState({ name: member.name, title: member.title || 'Barber', bio: member.bio || '', phone: member.phone || '' });
            setSelectedServices(member.services || []);
            setMemberSchedule(member.schedule || initialSchedule);
            setPreviewUrl(member.imageUrl || '');
        } else {
            setFormState({ name: '', title: 'Barber', bio: '', phone: '' });
            setSelectedServices([]);
            setMemberSchedule(initialSchedule);
            setPreviewUrl('');
        }
        setImageFile(null);
        setTabValue(0);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentMember(null);
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleServiceToggle = (serviceId) => {
        setSelectedServices(prev =>
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const handleScheduleChange = (day, field, value) => {
        setMemberSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
    };

    const handleSave = async () => {
        if (!formState.name) return alert('Name is required');

        setUploading(true);
        let imageUrl = currentMember?.imageUrl || '';

        try {
            if (imageFile) {
                const storageRef = ref(storage, `staff/${barbershopId}/${Date.now()}_${imageFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, imageFile);
                await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed', null, reject, async () => {
                        imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve();
                    });
                });
            }

            const memberData = {
                ...formState,
                imageUrl,
                services: selectedServices,
                schedule: memberSchedule,
                updatedAt: new Date()
            };

            const staffRef = collection(db, 'barbershops', barbershopId, 'professionals');

            if (currentMember) {
                await updateDoc(doc(staffRef, currentMember.id), memberData);
                setStaff(prev => prev.map(m => m.id === currentMember.id ? { ...m, id: m.id, ...memberData } : m));
            } else {
                const docRef = await addDoc(staffRef, { ...memberData, createdAt: new Date() });
                setStaff(prev => [...prev, { id: docRef.id, ...memberData }]);
            }
            handleClose();
        } catch (err) {
            console.error(err);
            alert("Failed to save team member.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this team member?")) return;
        try {
            await deleteDoc(doc(db, 'barbershops', barbershopId, 'professionals', id));
            setStaff(prev => prev.filter(m => m.id !== id));
        } catch (err) { console.error(err); }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>Team Management</Typography>
                    <Typography color="text.secondary">Manage your barbers and their schedules</Typography>
                </Box>
                <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => handleClickOpen()} disabled={!barbershopId} sx={{ borderRadius: '10px' }}>
                    Add Team Member
                </Button>
            </Box>

            {loading ? <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box> : (
                <Grid container spacing={3}>
                    {staff.map(member => (
                        <Grid item xs={12} sm={6} md={4} key={member.id}>
                            <Card sx={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
                                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar src={member.imageUrl} sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>{member.name[0]}</Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">{member.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">{member.title}</Typography>
                                    </Box>
                                </Box>
                                <Divider />
                                <CardContent>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Services:</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                                        {member.services?.map(svcId => {
                                            const svc = services.find(s => s.id === svcId);
                                            return svc ? <Chip key={svcId} label={svc.name} size="small" variant="outlined" /> : null;
                                        })}
                                        {(!member.services || member.services.length === 0) && <Typography variant="caption" color="text.secondary">No services assigned</Typography>}
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <IconButton size="small" onClick={() => handleClickOpen(member)}><EditIcon /></IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDelete(member.id)}><DeleteIcon /></IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    {staff.length === 0 && (
                        <Grid item xs={12}>
                            <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'transparent', border: '2px dashed rgba(255,255,255,0.1)' }}>
                                <Typography color="text.secondary">No team members found.</Typography>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            )}

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Team Member Details</DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tab label="Profile" />
                        <Tab label="Schedule" />
                    </Tabs>

                    <Box sx={{ p: 3 }} hidden={tabValue !== 0}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                            <Avatar src={previewUrl} sx={{ width: 100, height: 100, mb: 1 }} />
                            <Button component="label" startIcon={<PhotoCamera />} size="small">
                                Upload Photo <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                            </Button>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField label="Full Name" fullWidth value={formState.name} onChange={e => setFormState({ ...formState, name: e.target.value })} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label="Title/Role" fullWidth value={formState.title} onChange={e => setFormState({ ...formState, title: e.target.value })} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>Performing Services:</Typography>
                                <Paper variant="outlined" sx={{ maxHeight: 150, overflow: 'auto' }}>
                                    {services.map(svc => (
                                        <ListItem key={svc.id} dense button onClick={() => handleServiceToggle(svc.id)}>
                                            <ListItemIcon>
                                                <Checkbox edge="start" checked={selectedServices.includes(svc.id)} tabIndex={-1} disableRipple />
                                            </ListItemIcon>
                                            <ListItemText primary={svc.name} />
                                        </ListItem>
                                    ))}
                                    {services.length === 0 && <Box sx={{ p: 2 }}><Typography variant="caption">No services defined yet.</Typography></Box>}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ p: 3 }} hidden={tabValue !== 1}>
                        <Grid container spacing={2}>
                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                                <Grid item xs={12} container alignItems="center" spacing={1} key={day}>
                                    <Grid item xs={3}>
                                        <FormControlLabel
                                            control={<Checkbox checked={memberSchedule[day].active} onChange={e => handleScheduleChange(day, 'active', e.target.checked)} />}
                                            label={<Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{day.slice(0, 3)}</Typography>}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField type="time" size="small" fullWidth disabled={!memberSchedule[day].active} value={memberSchedule[day].start} onChange={e => handleScheduleChange(day, 'start', e.target.value)} />
                                    </Grid>
                                    <Grid item xs={1} sx={{ textAlign: 'center' }}>-</Grid>
                                    <Grid item xs={4}>
                                        <TextField type="time" size="small" fullWidth disabled={!memberSchedule[day].active} value={memberSchedule[day].end} onChange={e => handleScheduleChange(day, 'end', e.target.value)} />
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} disabled={uploading}>
                        {uploading ? <CircularProgress size={24} /> : 'Save Member'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default OwnerStaff;
