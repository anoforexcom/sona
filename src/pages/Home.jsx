import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Container,
  Typography,
  Box,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import StorefrontIcon from '@mui/icons-material/Storefront';


const Home = () => {
  const [barbershops, setBarbershops] = useState([]);
  const [cityFilter, setCityFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    
    const fetchBarbershops = async () => {
      try {
        let q = query(
          collection(db, 'barbershops'),
          where('approved', '==', true)
        );

        if (cityFilter) {
          q = query(q, where('city', '==', cityFilter));
        }

        if (nameFilter) {
          q = query(q, where('name', '>=', nameFilter), where('name', '<=', nameFilter + '\uf8ff'));
        }

        const querySnapshot = await getDocs(q);
        const barbershopsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBarbershops(barbershopsData);
      } catch (error) {
        console.error('Error fetching barbershops:', error);
      }
    };

    fetchBarbershops();
  }, [cityFilter, nameFilter]);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          background: 'url(https://images.unsplash.com/photo-1621607512221-f0bc33364ad4?q=80&w=2070&auto=format&fit=crop) no-repeat center center/cover',
          backgroundAttachment: 'scroll',
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)' }} />
        <Container maxWidth="lg" sx={{ zIndex: 1 }} >
          <Typography
            variant={isMobile ? "h3" : "h2"}
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold', lineHeight: 1.2 }}
          >
            Book Your Style
          </Typography>
          <Typography variant={isMobile ? "h6" : "h5"} component="p" sx={{ mb: 4, maxWidth: '700px', margin: 'auto' }}>
            Find the best barbershops in your city and book your next appointment with ease.
          </Typography>
          <Button component={Link} to="/signup" variant="contained" color="secondary" size="large" sx={{ borderRadius: '50px', px: 5, py: 1.5 }}>
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Barbershop Listing Section */}
      <Container sx={{ py: 8 }}>
        <Box >
            <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}>
            Our Partner Barbershops
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center', mb: 5 }}>
                Explore top-rated barbershops near you.
            </Typography>
        </Box>
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 5 }}>
          <Grid xs={12} md={4}>
            <TextField
              label="Filter by city"
              variant="filled"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              sx={{ bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 1, boxShadow: 1, width: '100%' }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                  startAdornment: (
                  <InputAdornment position="start">
                      <LocationCityIcon />
                  </InputAdornment>
                  ),
              }}
            />
          </Grid>
          <Grid xs={12} md={8}>
            <TextField
              label="Filter by name"
              variant="filled"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              sx={{ bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 1, boxShadow: 1, width: '100%' }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                  startAdornment: (
                  <InputAdornment position="start">
                      <SearchIcon />
                  </InputAdornment>
                  ),
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          {barbershops.map((barbershop) => (
            <Grid key={barbershop.id} xs={12} sm={6} md={4} >
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[10],
                },
                elevation: 3,
                borderRadius: 2,
              }}>
                <CardMedia
                  component="img"
                  height="220px"
                  image={barbershop.imageUrl || 'https://via.placeholder.com/400x220?text=Barbershop'}
                  alt={barbershop.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    {barbershop.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 2 }}>
                    <LocationCityIcon sx={{ mr: 1, fontSize: '1rem' }} />
                    <Typography variant="body2" >
                        {barbershop.address}, {barbershop.city}
                    </Typography>
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                    <Button component={Link} to={`/barbershop/${barbershop.id}`} variant="contained" color="primary" fullWidth sx={{ borderRadius: '50px' }}>
                        View Details
                    </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

       {/* Call to Action Section for Barbershop Owners */}
      <Paper
        elevation={0}
        sx={{
          py: 8,
          textAlign: 'center',
          bgcolor: 'secondary.main',
          color: 'white',
          borderRadius: 0,
        }}
      >
        <Container maxWidth="md" >
            <Grid container spacing={4} alignItems="center" justifyContent="center">
                <Grid xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <StorefrontIcon sx={{ fontSize: 100, color: 'primary.contrastText' }}/>
                </Grid>
                <Grid xs={12} md={8} sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Are you a barbershop owner?
                    </Typography>
                    <Typography variant="h6" component="p" sx={{ mb: 4 }}>
                        Join our platform and connect with thousands of customers looking for their next haircut.
                    </Typography>
                    <Button component={Link} to="/barbershop-signup" variant="contained" color="primary" size="large" sx={{ borderRadius: '50px', px: 5, py: 1.5 }}>
                        List Your Barbershop
                    </Button>
                </Grid>
            </Grid>
        </Container>
      </Paper>
    </Box>
  );
};

export default Home;