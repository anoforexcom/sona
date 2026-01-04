
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Container, Typography, Box, CircularProgress, Alert, Button, Grid, Paper, List, ListItem, ListItemText, Tabs, Tab } from '@mui/material';
import { Link } from 'react-router-dom';
// import ServiceManager from '../components/ServiceManager.jsx'; // Moved to /owner/services
// import BookingList from '../components/BookingList.jsx'; // Moved to /owner/appointments

const BarbershopOwnerDashboard = () => {
  const { currentUser } = useAuth();
  const isPreview = window.location.pathname === '/preview-owner';
  const [barbershop, setBarbershop] = useState(isPreview ? { id: 'mock-id', name: 'Barbearia Demo' } : null);
  const [loading, setLoading] = useState(!isPreview);
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
    <Box sx={{ minHeight: '90vh', bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-1px', mb: 1 }}>
              <span style={{ color: '#8B5CF6' }}>Owner</span> Dashboard
            </Typography>
            {barbershop && (
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                Managing: <span style={{ color: 'text.primary', fontWeight: 600 }}>{barbershop.name}</span>
              </Typography>
            )}
          </Box>
          <Button
            component={Link}
            to="/barbershop-profile"
            variant="outlined"
            sx={{
              borderRadius: '12px',
              px: 3,
              borderColor: 'rgba(255,255,255,0.1)',
              color: 'text.primary',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(255,255,255,0.05)' }
            }}
          >
            Edit Profile
          </Button>
        </Box>

        {error &&
          <Alert severity="warning" sx={{ mb: 4, borderRadius: '16px', bgcolor: 'rgba(255, 152, 0, 0.1)', border: '1px solid rgba(255, 152, 0, 0.2)' }}>
            {error}
            <Button component={Link} to="/barbershop-profile" sx={{ ml: 2, borderRadius: '10px' }} variant="contained" size="small">Create Profile</Button>
          </Alert>
        }

        {barbershop && (
          <Grid container spacing={4}>
            {/* Quick Actions / Summary Placeholders */}
            <Grid item xs={12}>
              <Paper sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="h6">Overview coming soon...</Typography>
                <Typography>Use the sidebar to manage Services, Staff, and Appointments.</Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default BarbershopOwnerDashboard;
