
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
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Paper elevation={3} sx={{p:4}}>
                <Typography variant="h3" component="h1" gutterBottom sx={{fontWeight: 'bold'}}>{barbershop.name}</Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>{barbershop.address}, {barbershop.city}</Typography>
                <Divider sx={{my:3}}/>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={selectedService ? 4 : 12}>
                        <Typography variant="h5" sx={{fontWeight: 600, mb: 2}}>Our Services</Typography>
                        <List>
                             {barbershop.services && barbershop.services.map((service, index) => (
                                 <ListItem button key={index} onClick={() => handleSelectService(service)} selected={selectedService?.name === service.name}>
                                     <ListItemText primary={service.name} secondary={`$${service.price}`}/>
                                 </ListItem>
                             ))}
                        </List>
                    </Grid>
                    
                    {selectedService && (
                        <Grid item xs={12} md={8}>
                            <Typography variant="h5" sx={{fontWeight: 600, mb: 2}}>Schedule Your Appointment</Typography>
                            <Typography sx={{mb:2}}>You selected: <strong>{selectedService.name}</strong> for <strong>${selectedService.price}</strong></Typography>
                            
                            <StaticDateTimePicker
                                orientation="landscape"
                                openTo="day"
                                value={bookingDate}
                                onChange={(newValue) => {
                                    setBookingDate(newValue);
                                }}
                                minDateTime={new Date()} // Can't book in the past
                            />
                            <Box sx={{mt:3, textAlign:'right'}}>
                                <Button onClick={() => setSelectedService(null)} sx={{mr:2}}>Change Service</Button>
                                <Button variant="contained" size="large" onClick={handleBooking}>Book Now</Button>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Paper>

             {/* Notification Snackbar */}
            <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>

        </Container>
    </LocalizationProvider>
  );
};

export default BarbershopDetails;
