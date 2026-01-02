
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Grid,
  Chip,
  Divider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { format } from 'date-fns';

const UserProfile = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // This should technically be handled by PrivateRoute, but as a fallback:
    return <Typography>Please log in to see your profile.</Typography>;
  }

  const creationDate = currentUser.metadata?.creationTime 
    ? format(new Date(currentUser.metadata.creationTime), 'PPP') 
    : 'Not available';

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={3} sx={{ textAlign: 'center' }}>
            <Avatar sx={{ width: 100, height: 100, margin: 'auto', bgcolor: 'primary.main' }}>
              <PersonIcon sx={{ fontSize: 60 }} />
            </Avatar>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              {currentUser.email}
            </Typography>
            <Chip 
              label={currentUser.role ? currentUser.role.replace('_', ' ').toUpperCase() : 'CLIENT'} 
              color="secondary" 
              size="small" 
              sx={{ mt: 1, fontWeight: 'bold' }}
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Box>
            <Typography variant="h6" sx={{fontWeight: 600, mb: 2}}>Account Details</Typography>
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
                <Typography color="text.secondary">Email Address:</Typography>
                <Typography sx={{fontWeight: 'medium'}}>{currentUser.email}</Typography>
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography color="text.secondary">Member Since:</Typography>
                <Typography sx={{fontWeight: 'medium'}}>{creationDate}</Typography>
            </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserProfile;
