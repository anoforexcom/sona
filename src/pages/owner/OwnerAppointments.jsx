import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    getDoc
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Grid,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const OwnerAppointments = () => {
    const { currentUser } = useAuth();
    const [barbershopId, setBarbershopId] = useState(null);
    const [events, setEvents] = useState([]);
    const [services, setServices] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [message, setMessage] = useState({ open: false, text: '', severity: 'success' });

    // Form State
    const [formData, setFormData] = useState({
        clientName: '',
        clientPhone: '',
        serviceId: '',
        staffId: '',
        date: '',
        time: '',
        notes: ''
    });

    // Fetch Barbershop ID
    useEffect(() => {
        const fetchShop = async () => {
            if (!currentUser) return;
            try {
                const q = query(collection(db, 'barbershops'), where('ownerId', '==', currentUser.uid));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    setBarbershopId(snap.docs[0].id);
                }
            } catch (err) {
                console.error("Error fetching shop", err);
            }
        };
        fetchShop();
    }, [currentUser]);

    // Fetch Data (Services, Staff, Bookings)
    const fetchData = useCallback(async () => {
        if (!barbershopId) return;
        setLoading(true);
        try {
            // Services
            const servicesSnap = await getDocs(collection(db, 'barbershops', barbershopId, 'services'));
            const servicesData = servicesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            setServices(servicesData);

            // Staff
            const staffSnap = await getDocs(collection(db, 'barbershops', barbershopId, 'professionals'));
            const staffData = staffSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            setStaff(staffData);

            // Bookings (Events)
            const bookingsSnap = await getDocs(query(collection(db, 'bookings'), where('barbershopId', '==', barbershopId)));
            const calendarEvents = bookingsSnap.docs.map(doc => {
                const data = doc.data();
                // Construct Date objects
                // Assuming stored as 'YYYY-MM-DD' and 'HH:mm' string or Timestamp
                // Let's create proper JS Date objects for the calendar
                const start = new Date(`${data.date}T${data.time}`);
                // Calculate end time based on service duration (default 30 min if not found)
                const service = servicesData.find(s => s.name === data.serviceName) || {};
                const duration = parseInt(service.duration || 30);
                const end = new Date(start.getTime() + duration * 60000);

                return {
                    id: doc.id,
                    title: `${data.clientName} - ${data.serviceName}`,
                    start,
                    end,
                    resource: data,
                    allDay: false
                };
            });
            setEvents(calendarEvents);

        } catch (error) {
            console.error(error);
            setMessage({ open: true, text: 'Failed to load calendar data', severity: 'error' });
        } finally {
            setLoading(false);
        }
    }, [barbershopId]);

    useEffect(() => {
        if (barbershopId) fetchData();
    }, [barbershopId, fetchData]);


    const handleSelectSlot = ({ start }) => {
        // Prepare form for new booking at clicked time
        setFormData({
            clientName: '',
            clientPhone: '',
            serviceId: '',
            staffId: '',
            date: format(start, 'yyyy-MM-dd'),
            time: format(start, 'HH:mm'),
            notes: ''
        });
        setSelectedEvent(null);
        setOpenDialog(true);
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        const data = event.resource;
        // Find IDs based on names (since we stored names flatly before, ideally store IDs)
        // For now, let's just populate what we can
        const svc = services.find(s => s.name === data.serviceName);
        const stf = staff.find(s => s.name === data.barberName);

        setFormData({
            clientName: data.clientName,
            clientPhone: data.clientPhone || '',
            serviceId: svc ? svc.id : '',
            staffId: stf ? stf.id : '',
            date: data.date,
            time: data.time,
            notes: data.notes || ''
        });
        setOpenDialog(true);
    };

    const handleSave = async () => {
        if (!formData.clientName || !formData.serviceId || !formData.date || !formData.time) {
            setMessage({ open: true, text: 'Please fill in required fields', severity: 'warning' });
            return;
        }

        try {
            const service = services.find(s => s.id === formData.serviceId);
            const barber = staff.find(s => s.id === formData.staffId);

            const bookingData = {
                barbershopId,
                clientName: formData.clientName,
                clientPhone: formData.clientPhone,
                serviceName: service?.name || 'Unknown Service',
                servicePrice: service?.price || 0,
                barberName: barber?.name || 'Any',
                barberId: formData.staffId, // New field for better linking
                date: formData.date,
                time: formData.time,
                status: 'confirmed',
                createdAt: new Date(),
                createdBy: 'owner' // Mark as manual entry
            };

            if (selectedEvent) {
                // Update
                await updateDoc(doc(db, 'bookings', selectedEvent.id), bookingData);
                setMessage({ open: true, text: 'Appointment updated', severity: 'success' });
            } else {
                // Create
                await addDoc(collection(db, 'bookings'), bookingData);
                setMessage({ open: true, text: 'Appointment created', severity: 'success' });
            }

            setOpenDialog(false);
            fetchData(); // Refresh calendar

        } catch (error) {
            console.error(error);
            setMessage({ open: true, text: 'Error saving appointment', severity: 'error' });
        }
    };

    const handleDelete = async () => {
        if (!selectedEvent || !window.confirm("Cancel this appointment?")) return;
        try {
            await deleteDoc(doc(db, 'bookings', selectedEvent.id));
            setOpenDialog(false);
            fetchData();
            setMessage({ open: true, text: 'Appointment cancelled', severity: 'info' });
        } catch (error) {
            console.error(error);
            setMessage({ open: true, text: 'Error cancelling', severity: 'error' });
        }
    };

    return (
        <Container maxWidth="xl" sx={{ height: '85vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4" fontWeight="bold">Agenda</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleSelectSlot({ start: new Date() })}>
                    New Appointment
                </Button>
            </Box>

            <Paper sx={{ flexGrow: 1, p: 2, borderRadius: 2, overflowX: 'auto' }}>
                <Box sx={{ minWidth: 600, height: '100%' }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: '100%' }}
                            selectable
                            onSelectSlot={handleSelectSlot}
                            onSelectEvent={handleSelectEvent}
                            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                            defaultView={Views.WEEK}
                            step={15} // 15 min slots
                            timeslots={4}
                        />
                    )}
                </Box>
            </Paper>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{selectedEvent ? 'Edit Appointment' : 'New Appointment'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Client Name"
                                fullWidth
                                value={formData.clientName}
                                onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Phone (Optional)"
                                fullWidth
                                value={formData.clientPhone}
                                onChange={e => setFormData({ ...formData, clientPhone: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                label="Service"
                                fullWidth
                                value={formData.serviceId}
                                onChange={e => setFormData({ ...formData, serviceId: e.target.value })}
                            >
                                {services.map(s => <MenuItem key={s.id} value={s.id}>{s.name} ({s.duration}m)</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                label="Barber"
                                fullWidth
                                value={formData.staffId}
                                onChange={e => setFormData({ ...formData, staffId: e.target.value })}
                            >
                                <MenuItem value="">Any Professional</MenuItem>
                                {staff.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type="date"
                                label="Date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type="time"
                                label="Time"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Notes"
                                fullWidth
                                multiline
                                rows={2}
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    {selectedEvent && (
                        <Button color="error" onClick={handleDelete} sx={{ mr: 'auto' }}>Cancel Appt</Button>
                    )}
                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={message.open}
                autoHideDuration={4000}
                onClose={() => setMessage({ ...message, open: false })}
            >
                <Alert severity={message.severity}>{message.text}</Alert>
            </Snackbar>
        </Container>
    );
};

export default OwnerAppointments;
