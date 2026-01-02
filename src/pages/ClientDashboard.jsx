import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import SearchIcon from '@mui/icons-material/Search';

const ClientDashboard = () => {
  const { currentUser: authUser } = useAuth();
  const isPreview = window.location.pathname === '/preview-client';
  const currentUser = isPreview ? { email: 'cliente_demo@exemplo.com' } : authUser;

  return (
    <Box sx={{ minHeight: '90vh', bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-1px', mb: 1 }}>
            Hello, <span style={{ color: '#3B82F6' }}>{currentUser?.email?.split('@')[0]}</span>
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
            Manage your appointments and discover new experiences.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '24px',
                bgcolor: 'rgba(18, 18, 20, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-8px)' }
              }}
            >
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                bgcolor: 'rgba(59, 130, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3
              }}>
                <EventIcon sx={{ color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                My Appointments
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, flexGrow: 1 }}>
                View, reschedule, or cancel your upcoming haircuts.
              </Typography>
              <Button
                variant="contained"
                component={RouterLink}
                to="/my-appointments"
                fullWidth
                sx={{ py: 1.5, borderRadius: '12px' }}
              >
                View Appointments
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '24px',
                bgcolor: 'rgba(18, 18, 20, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-8px)' }
              }}
            >
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                bgcolor: 'rgba(139, 92, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3
              }}>
                <SearchIcon sx={{ color: 'secondary.main' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Find Barbershop
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, flexGrow: 1 }}>
                Explore our full catalog and book your next haircut now.
              </Typography>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/"
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: 'text.primary',
                  '&:hover': { borderColor: 'secondary.main', bgcolor: 'rgba(255,255,255,0.05)' }
                }}
              >
                Explore Catalog
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ClientDashboard;