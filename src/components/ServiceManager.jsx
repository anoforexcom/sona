
import React, { useState, useEffect } from 'react';
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Alert,
  Grid,
  InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const ServiceManager = ({ barbershopId }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [formState, setFormState] = useState({ name: '', duration: '', price: '' });

  useEffect(() => {
    const fetchServices = async () => {
      if (!barbershopId) return;
      try {
        setLoading(true);
        const servicesRef = collection(db, 'barbershops', barbershopId, 'services');
        const q = query(servicesRef);
        const querySnapshot = await getDocs(q);
        const servicesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(servicesList);
        setError(null);
      } catch (err) {
        console.error("Error fetching services: ", err);
        setError('Failed to load services. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [barbershopId]);

  const handleClickOpen = (service = null) => {
    setCurrentService(service);
    setFormState(service ? { name: service.name, duration: service.duration, price: service.price } : { name: '', duration: '', price: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentService(null);
  };

  const handleSave = async () => {
    if (!formState.name || !formState.duration || !formState.price) {
        setError('All fields are required.');
        return;
    }

    try {
        const servicesRef = collection(db, 'barbershops', barbershopId, 'services');
        if (currentService) {
            // Update existing service
            const serviceDoc = doc(db, 'barbershops', barbershopId, 'services', currentService.id);
            await updateDoc(serviceDoc, formState);
            setServices(services.map(s => s.id === currentService.id ? { ...s, ...formState } : s));
        } else {
            // Add new service
            const docRef = await addDoc(servicesRef, formState);
            setServices([...services, { id: docRef.id, ...formState }]);
        }
        handleClose();
    } catch (err) {
        console.error("Error saving service: ", err);
        setError('Failed to save service. Please try again.');
    }
  };

  const handleDelete = async (serviceId) => {
      if (!window.confirm("Are you sure you want to delete this service?")) return;
      try {
          const serviceDoc = doc(db, 'barbershops', barbershopId, 'services', serviceId);
          await deleteDoc(serviceDoc);
          setServices(services.filter(s => s.id !== serviceId));
      } catch (err) {
          console.error("Error deleting service: ", err);
          setError('Failed to delete service. Please try again.');
      }
  }

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          Manage Services
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => handleClickOpen()}
        >
          Add Service
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {services.length === 0 ? (
            <Typography>No services added yet. Click "Add Service" to get started.</Typography>
          ) : (
            services.map((service) => (
              <ListItem key={service.id} divider sx={{ bgcolor: 'background.paper', borderRadius: 1, mb: 1 }}>
                <ListItemText
                  primary={service.name}
                  secondary={`${service.duration} min - $${service.price}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleClickOpen(service)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(service.id)} sx={{ml: 1}}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{currentService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        <DialogContent>
            <Grid container spacing={2} sx={{mt: 1}}>
                <Grid item xs={12}>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Service Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formState.name}
                        onChange={(e) => setFormState({...formState, name: e.target.value})}
                    />
                </Grid>
                <Grid item xs={6}>
                     <TextField
                        margin="dense"
                        name="duration"
                        label="Duration"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={formState.duration}
                        onChange={(e) => setFormState({...formState, duration: e.target.value})}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">min</InputAdornment>,
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                     <TextField
                        margin="dense"
                        name="price"
                        label="Price"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={formState.price}
                        onChange={(e) => setFormState({...formState, price: e.target.value})}
                         InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                    />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions sx={{ p: '0 24px 16px'}}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ServiceManager;
