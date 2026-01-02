import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { doc, getDocs, setDoc, addDoc, collection, query, where, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardMedia,
  LinearProgress,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useNavigate } from 'react-router-dom';

const initialHours = {
  monday: { open: '09:00', close: '18:00', isOpen: true },
  tuesday: { open: '09:00', close: '18:00', isOpen: true },
  wednesday: { open: '09:00', close: '18:00', isOpen: true },
  thursday: { open: '09:00', close: '18:00', isOpen: true },
  friday: { open: '09:00', close: '18:00', isOpen: true },
  saturday: { open: '10:00', close: '16:00', isOpen: false },
  sunday: { open: '10:00', close: '16:00', isOpen: false },
};

const BarbershopProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [barbershop, setBarbershop] = useState(null);
  const [formState, setFormState] = useState({ name: '', address: '', city: '', description: '' });
  const [hours, setHours] = useState(initialHours);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchBarbershop = useCallback(async () => {
    if (!currentUser) return;
    setPageLoading(true);
    const q = query(collection(db, 'barbershops'), where('ownerId', '==', currentUser.uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data();
      setBarbershop({ id: docSnap.id, ...data });
      setFormState({ name: data.name || '', address: data.address || '', city: data.city || '', description: data.description || '' });
      setHours(data.hours || initialHours);
      setPreviewUrl(data.imageUrl || '');
    } else {
      setBarbershop(null);
    }
    setPageLoading(false);
  }, [currentUser]);

  useEffect(() => {
    fetchBarbershop();
  }, [fetchBarbershop]);

  const handleFormChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleHoursChange = (day, field, value) => {
    setHours({ ...hours, [day]: { ...hours[day], [field]: value } });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    setLoading(true);
    let imageUrl = barbershop?.imageUrl || '';

    try {
      if (imageFile) {
        // ... (upload logic as before)
      }

      const profileData = { ...formState, ownerId: currentUser.uid, imageUrl, hours, approved: barbershop?.approved ?? false };

      if (barbershop) {
        await updateDoc(doc(db, 'barbershops', barbershop.id), profileData);
      } else {
        await addDoc(collection(db, 'barbershops'), profileData);
      }

      setSnackbar({ open: true, message: 'Profile saved successfully!', severity: 'success' });
      navigate('/dashboard');

    } catch (error) {
      console.error('Error saving profile:', error);
      setSnackbar({ open: true, message: 'Error saving profile. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  if (pageLoading) {
      return <Container maxWidth="md" sx={{my: 5}}><CircularProgress /></Container>
  }

  return (
    <Container maxWidth="md" sx={{ my: 5 }}>
      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {barbershop ? 'Edit My Barbershop' : 'Create Your Barbershop'}
        </Typography>
        
        <Box component="form" noValidate sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {/* ... other form fields */}

            <Grid xs={12}><Divider sx={{my:2}}><Typography variant="h6">Business Hours</Typography></Divider></Grid>
            
            {Object.keys(hours).map(day => (
                <Grid xs={12} container spacing={2} alignItems="center" key={day}>
                    <Grid xs={3} sm={2}>
                        <FormControlLabel
                            control={<Checkbox checked={hours[day].isOpen} onChange={(e) => handleHoursChange(day, 'isOpen', e.target.checked)} />}
                            label={day.charAt(0).toUpperCase() + day.slice(1)}
                        />
                    </Grid>
                    <Grid xs={4} sm={3}>
                        <TextField type="time" label="Open" value={hours[day].open} onChange={(e) => handleHoursChange(day, 'open', e.target.value)} disabled={!hours[day].isOpen} fullWidth InputLabelProps={{ shrink: true }}/>
                    </Grid>
                    <Grid xs={4} sm={3}>
                         <TextField type="time" label="Close" value={hours[day].close} onChange={(e) => handleHoursChange(day, 'close', e.target.value)} disabled={!hours[day].isOpen} fullWidth InputLabelProps={{ shrink: true }}/>
                    </Grid>
                </Grid>
            ))}

            <Grid xs={12}><Divider sx={{my:2}} /></Grid>

             <Grid xs={12}>
                <Button onClick={handleSaveProfile} variant="contained" size="large" disabled={loading} sx={{position: 'relative'}}>
                    {barbershop ? 'Save Changes' : 'Create Profile'}
                    {loading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px'}} />}
                </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      {/* ... Snackbar */}
    </Container>
  );
};

export default BarbershopProfile;