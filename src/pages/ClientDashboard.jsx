import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  CircularProgress
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ContentCutIcon from '@mui/icons-material/ContentCut';

const ClientDashboard = () => {
  const { currentUser } = useAuth();
  const [nextAppointment, setNextAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNextAppointment = async () => {
      if (!currentUser) return;
      try {
        const now = new Date();
        // Ideally we filter by date >= now in query, but storing dates as strings makes it tricky.
        // For MVP, fetch recent/upcoming and filter in JS or rely on simple string compare if ISO.
        // Assuming 'date' field is YYYY-MM-DD.
        const q = query(
          collection(db, 'bookings'),
          where('clientId', '==', currentUser.uid),
          where('status', '==', 'confirmed'),
          orderBy('date', 'asc'), // Get earliest dates first
          // limit(5) // Fetch a few to find the next valid one
        );

        const snap = await getDocs(q);
        const upcoming = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(b => {
            const bookingDateTime = new Date(`${b.date}T${b.time}`);
            return bookingDateTime > now;
          })
          .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

        if (upcoming.length > 0) {
          setNextAppointment(upcoming[0]);
        }
      } catch (err) {
        console.error("Error fetching appointments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNextAppointment();
  }, [currentUser]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Hello, <span style={{ color: '#3B82F6' }}>{currentUser?.displayName || currentUser?.email?.split('@')[0]}</span>
        </Typography>
        <Typography color="text.secondary">
          Welcome back to Sona.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Next Appointment Card */}
        <Grid item xs={12} md={7}>
          <Paper
            sx={{
              p: 4,
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 250,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            {loading ? <CircularProgress /> : nextAppointment ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Chip label="Upcoming" color="primary" size="small" />
                  <Typography variant="h3" fontWeight="800" sx={{ opacity: 0.1, position: 'absolute', right: 20, top: 10 }}>
                    #{nextAppointment.date.slice(-2)}
                  </Typography>
                </Box>

                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {nextAppointment.serviceName}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'text.secondary' }}>
                  <AccessTimeIcon fontSize="small" />
                  <Typography variant="body1">
                    {new Date(nextAppointment.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} at {nextAppointment.time}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, color: 'text.secondary' }}>
                  <LocationOnIcon fontSize="small" />
                  <Typography variant="body1">
                    {nextAppointment.barbershopName || 'Barbershop'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained" color="primary" sx={{ borderRadius: '10px' }} component={RouterLink} to="/my-appointments">
                    Manage Booking
                  </Button>
                  <Button variant="outlined" sx={{ borderRadius: '10px' }} component={RouterLink} to={`/barbershop/${nextAppointment.barbershopId}`}>
                    View Shop
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <EventIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" fontWeight="bold">No upcoming bookings</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Ready for a fresh look? Find a professional near you.
                </Typography>
                <Button variant="contained" startIcon={<SearchIcon />} component={RouterLink} to="/" sx={{ borderRadius: '10px' }}>
                  Find Barbershop
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={5}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: '20px', bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.05)' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: 'success.main' }}>
                    <ContentCutIcon />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">New Booking</Typography>
                    <Typography variant="caption" color="text.secondary">Explore top-rated barbers</Typography>
                  </Box>
                  <Button variant="outlined" size="small" component={RouterLink} to="/">Explore</Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: '20px', bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.05)' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(236, 72, 153, 0.1)', color: 'pink' }}>
                    <EventIcon />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">History</Typography>
                    <Typography variant="caption" color="text.secondary">View past cuts</Typography>
                  </Box>
                  <Button variant="outlined" size="small" component={RouterLink} to="/my-appointments">View</Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ClientDashboard;