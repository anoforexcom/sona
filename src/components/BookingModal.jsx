
import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Box, Typography, Button, CircularProgress, Grid, Alert, Chip, Snackbar } from '@mui/material';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addMinutes, format, parse } from 'date-fns';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400, md: 500 },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto'
};

const BookingModal = ({ open, handleClose, service, barbershop }) => {
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [error, setError] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const generateTimeSlots = (date) => {
    if (!barbershop?.hours || !service?.duration) return [];
    const dayOfWeek = format(date, 'eeee').toLowerCase();
    const businessHours = barbershop.hours[dayOfWeek];
    if (!businessHours || !businessHours.isOpen) return [];

    const slots = [];
    const startTime = parse(businessHours.open, 'HH:mm', date);
    const endTime = parse(businessHours.close, 'HH:mm', date);
    let currentTime = startTime;

    while (addMinutes(currentTime, parseInt(service.duration)) <= endTime) {
      slots.push(format(currentTime, 'HH:mm'));
      currentTime = addMinutes(currentTime, 30); // Increment for next potential slot
    }
    return slots;
  };

  useEffect(() => {
    if (!open || !barbershop || !service) return;
    const fetchBookingsAndSetSlots = async () => {
      setLoadingSlots(true);
      setError('');
      setSelectedSlot(null);
      try {
        const dayStart = new Date(selectedDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(selectedDate);
        dayEnd.setHours(23, 59, 59, 999);

        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef, where('barbershopId', '==', barbershop.id), where('bookingDate', '>=', dayStart), where('bookingDate', '<=', dayEnd));
        const querySnapshot = await getDocs(q);
        const existingBookings = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return { start: data.bookingDate.toDate(), duration: data.serviceDuration };
        });

        const allPossibleSlots = generateTimeSlots(selectedDate);
        
        const availableSlots = allPossibleSlots.filter(slot => {
          const slotTime = parse(slot, 'HH:mm', selectedDate);
          const slotEnd = addMinutes(slotTime, parseInt(service.duration));
          return !existingBookings.some(booking => {
            const bookingStart = booking.start;
            const bookingEnd = addMinutes(bookingStart, booking.duration);
            return (slotTime < bookingEnd && slotEnd > bookingStart); // Check for overlap
          });
        });
        
        setTimeSlots(availableSlots);
      } catch (err) {
        console.error("Error fetching bookings: ", err);
        setError("Could not load time slots.");
      }
      setLoadingSlots(false);
    };

    fetchBookingsAndSetSlots();
  }, [open, selectedDate, barbershop, service]);

  const handleBooking = async () => {
    if (!currentUser) {
        setError("You must be logged in to book an appointment.");
        return;
    }
    if (!selectedSlot) {
        setError("Please select a time slot.");
        return;
    }
    setBookingInProgress(true);
    try {
        const bookingDate = parse(selectedSlot, 'HH:mm', selectedDate);

        await addDoc(collection(db, 'bookings'), {
            clientId: currentUser.uid,
            barbershopId: barbershop.id,
            barbershopName: barbershop.name,
            serviceName: service.name,
            serviceDuration: parseInt(service.duration),
            servicePrice: parseFloat(service.price),
            bookingDate: bookingDate,
            createdAt: serverTimestamp(),
            status: 'confirmed'
        });

        setSnackbar({ open: true, message: 'Booking successful!', severity: 'success' });
        handleClose();
    } catch (err) {
        console.error("Error creating booking: ", err);
        setSnackbar({ open: true, message: 'Booking failed. Please try again.', severity: 'error' });
    } finally {
        setBookingInProgress(false);
    }
  }

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">Book: {service?.name}</Typography>
          <Typography sx={{ mt: 2, mb: 1 }}>Select a date and time:</Typography>
          
          <Box sx={{display: 'flex', justifyContent:'center', mb: 2}}>
            <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} inline />
          </Box>

          {loadingSlots && <CircularProgress sx={{my: 2}}/>}
          {error && <Alert severity="error" sx={{my:1}}>{error}</Alert>}

          {!loadingSlots && timeSlots.length > 0 && (
              <Box sx={{ my: 2, maxHeight: '150px', overflowY: 'auto'}}>
                <Grid container spacing={1}>
                    {timeSlots.map(slot => (
                        <Grid item key={slot}>
                            <Chip label={slot} onClick={() => setSelectedSlot(slot)} color={selectedSlot === slot ? 'primary' : 'default'} clickable />
                        </Grid>
                    ))}
                </Grid>
              </Box>
          )}

          {!loadingSlots && timeSlots.length === 0 && !error && (
              <Typography sx={{my: 2, textAlign: 'center'}}>No available slots for this day.</Typography>
          )}

          <Button onClick={handleBooking} variant="contained" fullWidth disabled={!selectedSlot || loadingSlots || bookingInProgress} sx={{position: 'relative'}}>
            Confirm Booking
            {bookingInProgress && <CircularProgress size={24} sx={{position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px'}}/>}
          </Button>
        </Box>
      </Modal>
      <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
          </Alert>
      </Snackbar>
    </>
  );
};

export default BookingModal;
