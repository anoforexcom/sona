
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { format } from 'date-fns';

const ClientAppointments = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'bookings'), 
        where('clientId', '==', currentUser.uid),
        orderBy('bookingDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const userBookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(userBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load your appointments. Please try refreshing the page.");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleOpenCancelDialog = (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const handleCloseCancelDialog = () => {
    setSelectedBooking(null);
    setDialogOpen(false);
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      const bookingRef = doc(db, 'bookings', selectedBooking.id);
      await updateDoc(bookingRef, { status: 'cancelled' });
      fetchBookings(); // Refresh the list
      handleCloseCancelDialog();
      setNotification({ open: true, message: `Cancellation successful. An email was sent to ${currentUser.email}`, severity: 'info' });
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setError("Failed to cancel booking. Please try again.");
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

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        My Appointments
      </Typography>
      {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
      <Paper elevation={3}>
          {bookings.length > 0 ? (
            <List>
              {bookings.map((booking, index) => (
                <React.Fragment key={booking.id}>
                  <ListItem sx={{ opacity: booking.status === 'cancelled' ? 0.5 : 1 }}>
                    <ListItemText
                      primary={`${booking.barbershopName} - ${booking.serviceName}`}
                      secondary={`On ${format(booking.bookingDate.toDate(), "PPP 'at' p")} - Status: ${booking.status}`}
                    />
                    {booking.status !== 'cancelled' && (
                       <Button variant="outlined" color="error" size="small" onClick={() => handleOpenCancelDialog(booking)}>
                        Cancel
                      </Button>
                    )}
                  </ListItem>
                  {index < bookings.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
             <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography>You have no appointments scheduled.</Typography>
                 <Button variant="contained" sx={{mt:2}} href="/">Find a Barbershop</Button>
             </Box>
          )}
      </Paper>

      {/* Cancellation Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseCancelDialog}
      >
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your appointment for <strong>{selectedBooking?.serviceName}</strong> at <strong>{selectedBooking?.barbershopName}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>Go Back</Button>
          <Button onClick={handleCancelBooking} color="error" variant="contained" autoFocus>
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
              {notification.message}
          </Alert>
      </Snackbar>
    </Container>
  );
};

export default ClientAppointments;
