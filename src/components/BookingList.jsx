
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  Box,
  Button,
  Chip,
  Alert
} from '@mui/material';
import { format } from 'date-fns';

const BookingList = ({ userType, userId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const fetchBookings = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const bookingsRef = collection(db, 'bookings');
      const field = userType === 'client' ? 'clientId' : 'barbershopId';
      const q = query(bookingsRef, where(field, '==', userId), orderBy('bookingDate', 'desc'));
      const querySnapshot = await getDocs(q);
      const bookingsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(bookingsList);
      setError(null);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userId, userType]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    
    try {
        const bookingDoc = doc(db, 'bookings', bookingId);
        await updateDoc(bookingDoc, { status: 'cancelled' });
        // Refresh the list to reflect the change
        fetchBookings(); 
    } catch (err) {
        console.error("Error cancelling booking:", err);
        setError("Failed to cancel the appointment. Please try again.");
    }
  }

  const filterBookings = (status) => {
    const now = new Date();
    switch (status) {
        case 'upcoming':
            return bookings.filter(b => b.bookingDate.toDate() >= now && b.status === 'confirmed').sort((a,b) => a.bookingDate.toDate() - b.bookingDate.toDate());
        case 'past':
             return bookings.filter(b => b.bookingDate.toDate() < now && b.status === 'confirmed');
        case 'cancelled':
            return bookings.filter(b => b.status === 'cancelled');
        default:
            return [];
    }
  };

  const renderBookingList = (bookingArray, isUpcoming) => {
      if (bookingArray.length === 0) {
          return <Typography sx={{textAlign: 'center', p: 3}}>No appointments in this category.</Typography>
      }
      return (
          <List>
              {bookingArray.map(booking => (
                  <ListItem key={booking.id} divider>
                      <ListItemText 
                        primary={userType === 'client' ? booking.barbershopName : `Client: ${booking.clientId.substring(0,6)}...`} 
                        secondary={
                            <>
                                <Typography component="span" variant="body2">{format(booking.bookingDate.toDate(), 'PPP p')}</Typography>
                                <br/>
                                <Typography component="span" variant="body2">{`${booking.serviceName} - $${booking.servicePrice}`}</Typography>
                            </>
                        }
                      />
                      {booking.status === 'cancelled' && <Chip label="Cancelled" color="error" size="small"/>}
                      {isUpcoming && (
                          <Button variant="outlined" color="error" size="small" onClick={() => handleCancelBooking(booking.id)} sx={{ml: 2}}>
                              Cancel
                          </Button>
                      )}
                  </ListItem>
              ))}
          </List>
      )
  }

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Paper sx={{ mt: 4 }}>
        {error && <Alert severity="error" sx={{m: 2}}>{error}</Alert>}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} centered variant="fullWidth">
                <Tab label={`Upcoming (${filterBookings('upcoming').length})`} />
                <Tab label={`Past (${filterBookings('past').length})`} />
                <Tab label={`Cancelled (${filterBookings('cancelled').length})`} />
            </Tabs>
        </Box>
        {tabValue === 0 && renderBookingList(filterBookings('upcoming'), true)}
        {tabValue === 1 && renderBookingList(filterBookings('past'), false)}
        {tabValue === 2 && renderBookingList(filterBookings('cancelled'), false)}
    </Paper>
  );
};

export default BookingList;
