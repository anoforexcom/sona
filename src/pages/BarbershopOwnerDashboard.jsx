
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Container, Typography, Box, CircularProgress, Alert, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import ServiceManager from '../components/ServiceManager.jsx';
import BookingList from '../components/BookingList.jsx';

const BarbershopOwnerDashboard = () => {
  const { currentUser } = useAuth();
  const [barbershop, setBarbershop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBarbershop = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'barbershops'), where('ownerId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        setBarbershop({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError('No barbershop profile found. Please create one.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch barbershop data.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchBarbershop();
  }, [fetchBarbershop]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 5, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Owner Dashboard
      </Typography>

      {error && 
        <Alert severity="warning" sx={{mb: 3}}>
            {error} 
            <Button component={Link} to="/barbershop-profile" sx={{ml: 2}} variant="outlined">Create Profile</Button>
        </Alert>
      }

      {barbershop && (
        <Box>
            <Typography variant="h6" gutterBottom>Welcome, {barbershop.name}!</Typography>

            <Grid container spacing={4}>
                <Grid xs={12} md={6}>
                    <ServiceManager barbershopId={barbershop.id} />
                </Grid>
                <Grid xs={12} md={6}>
                     <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2.5, mt: {xs: 2, md: 0} }}>
                        Appointments
                    </Typography>
                    <BookingList userType="barbershop" userId={barbershop.id} />
                </Grid>
            </Grid>
        </Box>
      )}

    </Container>
  );
};

export default BarbershopOwnerDashboard;
