
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Alert,
  Snackbar,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';

const BarbershopDetails = () => {
  const { barbershopId } = useParams();
  const { currentUser } = useAuth();
  const [barbershop, setBarbershop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchBarbershop = async () => {
      try {
        const docRef = doc(db, 'barbershops', barbershopId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().approved) {
          const barbershopData = { id: docSnap.id, ...docSnap.data() };
          const servicesRef = collection(db, 'barbershops', barbershopId, 'services');
          const servicesSnap = await getDocs(servicesRef);
          const services = servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setBarbershop({ ...barbershopData, services });
        } else {
          setError('This barbershop does not exist or is not available.');
        }
      } catch (err) {
        setError('Failed to load barbershop details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBarbershop();
  }, [barbershopId]);

  const handleSelectService = (service) => {
    setSelectedService(service);
  };

  const handleBooking = async () => {
    if (!currentUser) {
      setError("You must be logged in to book an appointment.");
      return;
    }
    if (!selectedService || !bookingDate) {
      setError("Please select a service and a date for your appointment.")
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        clientId: currentUser.uid,
        barbershopId: barbershop.id,
        barbershopName: barbershop.name,
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        bookingDate: bookingDate,
        status: 'confirmed', // confirmed, cancelled
        createdAt: serverTimestamp()
      });
      setNotification({ open: true, message: `Booking confirmed! A confirmation email has been sent to ${currentUser.email}`, severity: 'success' });
      setSelectedService(null); // Reset selection
    } catch (err) {
      console.error("Error creating booking:", err);
      setNotification({ open: true, message: `Error: ${err.message}`, severity: 'error' });
    }
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  if (loading) {
    return <Container sx={{ py: 5, textAlign: 'center' }}><CircularProgress /></Container>;
  }

  if (error) {
    return <Container sx={{ py: 5, textAlign: 'center' }}><Alert severity="error">{error}</Alert></Container>;
  }

  if (!barbershop) {
    return null;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ minHeight: '90vh', bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Paper
            sx={{
              p: { xs: 3, md: 6 },
              borderRadius: '32px',
              bgcolor: 'rgba(18, 18, 20, 0.6)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ mb: 6 }}>
              <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-2px' }}>
                {barbershop.name}
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                {barbershop.address} • {barbershop.city}
              </Typography>
            </Box>

            <Divider sx={{ mb: 6, borderColor: 'rgba(255,255,255,0.05)' }} />

            <Grid container spacing={8}>
              <Grid item xs={12} md={selectedService ? 5 : 12}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>Our Services</Typography>
                <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {barbershop.services && barbershop.services.map((service, index) => (
                    <Paper
                      key={index}
                      onClick={() => handleSelectService(service)}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        borderRadius: '16px',
                        bgcolor: selectedService?.id === service.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)',
                        border: '1px solid',
                        borderColor: selectedService?.id === service.id ? 'primary.main' : 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 700 }}>{service.name}</Typography>
                        <Typography sx={{ fontWeight: 800, color: 'primary.main' }}>
                          ${service.price}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </List>
              </Grid>

              {selectedService && (
                <Grid item xs={12} md={7}>
                  <Box sx={{
                    p: 4,
                    borderRadius: '24px',
                    bgcolor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Book Your Appointment</Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                      Selected Service: <span style={{ color: '#fff', fontWeight: 700 }}>{selectedService.name}</span>
                    </Typography>

                    <Box sx={{
                      '& .MuiCalendarPicker-root': { bgcolor: 'transparent' },
                      '& .MuiPickersDay-root': { fontWeight: 600 },
                      bgcolor: 'rgba(0,0,0,0.2)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      mb: 4
                    }}>
                      <StaticDateTimePicker
                        orientation="landscape"
                        openTo="day"
                        value={bookingDate}
                        onChange={(newValue) => setBookingDate(newValue)}
                        minDateTime={new Date()}
                        sx={{
                          '& .MuiPickerStaticWrapper-content': { bgcolor: 'transparent' }
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button onClick={() => setSelectedService(null)} sx={{ color: 'text.secondary' }}>Change Service</Button>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleBooking}
                        sx={{ borderRadius: '12px', px: 6 }}
                      >
                        Confirm Booking
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Notification Snackbar */}
          <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%', borderRadius: '12px' }}>
              {notification.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default BarbershopDetails;
