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
  const { currentUser } = useAuth();

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Welcome, {currentUser?.email}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        This is your personal dashboard. From here, you can manage your appointments and explore new barbershops.
      </Typography>

      <Grid container spacing={4}>
        <Grid xs={12} md={6}>
          <Card elevation={2} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                    <EventIcon color="primary" sx={{mr: 1}}/>
                    <Typography variant="h6" component="h2" sx={{fontWeight: 'bold'}}>
                        My Appointments
                    </Typography>
                </Box>
              <Typography color="text.secondary">
                View, manage, or cancel your upcoming and past appointments.
              </Typography>
            </CardContent>
            <CardActions sx={{px: 2, pb: 2}}>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/my-appointments"
              >
                View My Appointments
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
           <Card elevation={2} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                    <SearchIcon color="primary" sx={{mr: 1}}/>
                    <Typography variant="h6" component="h2" sx={{fontWeight: 'bold'}}>
                        Find a Barbershop
                    </Typography>
                </Box>
              <Typography color="text.secondary">
                Explore our listed barbershops and book your next haircut.
              </Typography>
            </CardContent>
            <CardActions sx={{px: 2, pb: 2}}>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/"
              >
                Find a Barbershop
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ClientDashboard;