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
  Avatar,
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

  const testimonials = [
    { id: 1, name: "Alex Johnson", comment: "Best haircut I've ever had! The service was impeccable.", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Michael Smith", comment: "Sona made booking so easy. Highly recommended!", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Sarah Williams", comment: "Great atmosphere and professional barbers.", avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, name: "David Brown", comment: "I love the convenience of finding a shop near me.", avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 5, name: "Emily Davis", comment: "Premium experience from start to finish.", avatar: "https://i.pravatar.cc/150?img=5" },
    { id: 6, name: "James Wilson", comment: "Finally, an app that actually works for booking appointments.", avatar: "https://i.pravatar.cc/150?img=6" },
    { id: 7, name: "Jessica Garcia", comment: "My barber was amazing, will definitely return.", avatar: "https://i.pravatar.cc/150?img=7" },
    { id: 8, name: "Robert Miller", comment: "Clean, modern, and efficient. 5 stars.", avatar: "https://i.pravatar.cc/150?img=8" },
    { id: 9, name: "Lisa Martinez", comment: "The dark mode design of this site is sleek!", avatar: "https://i.pravatar.cc/150?img=9" },
    { id: 10, name: "William Anderson", comment: "Booking took less than a minute. Fantastic.", avatar: "https://i.pravatar.cc/150?img=10" }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          bgcolor: '#0A0A0B',
        }}
      >
        {/* Background Image with Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/hero-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(10, 10, 11, 0.4) 0%, rgba(10, 10, 11, 0.9) 100%)',
            }
          }}
        />

        {/* Glowing Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '40vw',
            height: '40vw',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <Container maxWidth="lg" sx={{ zIndex: 1, textAlign: 'center' }} >
          <Typography
            variant={isMobile ? "h2" : "h1"}
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-2.5px',
              mb: 3,
              background: 'linear-gradient(to bottom, #fff 30%, #94A3B8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            Your Style, <br />Elevated to the Max.
          </Typography>
          <Typography
            variant={isMobile ? "body1" : "h5"}
            sx={{
              mb: 6,
              maxWidth: '600px',
              mx: 'auto',
              color: 'text.secondary',
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            Discover and book the best barbershops with a premium, seamless experience.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              size="large"
              sx={{
                height: 56,
                px: 6,
                fontSize: '1.1rem',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)'
              }}
            >
              Get Started
            </Button>
            <Button
              component={Link}
              to="#listings"
              variant="outlined"
              size="large"
              sx={{
                height: 56,
                px: 6,
                fontSize: '1.1rem',
                borderColor: 'rgba(255,255,255,0.1)',
                color: 'text.primary',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(255,255,255,0.05)' }
              }}
            >
              Explore
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Barbershop Listing Section */}
      <Container id="listings" sx={{ py: 12 }}>
        <Box sx={{ mb: 10, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, letterSpacing: '-1px' }}>
            Meet Our Partners
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
            Selected barbershops that value excellence and your comfort.
          </Typography>
        </Box>

        {/* Search & Filter Glassmorphic Bar */}
        <Paper
          sx={{
            p: 2,
            mb: 8,
            borderRadius: '24px',
            bgcolor: 'rgba(18, 18, 20, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}
        >
          <TextField
            placeholder="Filter by city..."
            variant="standard"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            fullWidth
            InputProps={{
              disableUnderline: true,
              startAdornment: <LocationCityIcon sx={{ mr: 1.5, color: 'primary.main' }} />,
              sx: {
                p: '12px 16px',
                bgcolor: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)'
              }
            }}
          />
          <TextField
            placeholder="Search by barbershop name..."
            variant="standard"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            fullWidth
            InputProps={{
              disableUnderline: true,
              startAdornment: <SearchIcon sx={{ mr: 1.5, color: 'primary.main' }} />,
              sx: {
                p: '12px 16px',
                bgcolor: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)'
              }
            }}
          />
        </Paper>

        <Grid container spacing={4}>
          {barbershops.map((barbershop) => (
            <Grid item key={barbershop.id} xs={12} sm={6} md={4} >
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                bgcolor: 'background.paper',
                borderRadius: '24px',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-12px)',
                  borderColor: 'primary.main',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                },
              }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="240"
                    image={barbershop.imageUrl || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop'}
                    alt={barbershop.name}
                    sx={{ filter: 'brightness(0.9)' }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(8px)',
                    px: 1.5, py: 0.5,
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>PREMIUM</Typography>
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography gutterBottom variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                    {barbershop.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 1 }}>
                    <LocationCityIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {barbershop.city}
                    </Typography>
                  </Box>
                </CardContent>
                <Box sx={{ p: 3, pt: 0 }}>
                  <Button
                    component={Link}
                    to={`/barbershop/${barbershop.id}`}
                    variant="contained"
                    fullWidth
                    sx={{
                      borderRadius: '14px',
                      py: 1.5,
                      boxShadow: 'none',
                      '&:hover': { boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Scrolling Testimonials Section */}
      <Box sx={{ py: 12, bgcolor: 'rgba(255, 255, 255, 0.02)', overflow: 'hidden' }}>
        <Container maxWidth="xl" sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>What Our Clients Say</Typography>
          <Button component={Link} to="/reviews" color="primary">View All 50+ Reviews</Button>
        </Container>

        <Box sx={{
          display: 'flex',
          width: 'max-content',
          animation: 'scroll 60s linear infinite',
          '&:hover': { animationPlayState: 'paused' },
          '@keyframes scroll': {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-50%)' }
          }
        }}>
          {[...Array(2)].map((_, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 4, px: 2 }}>
              {testimonials.slice(0, 10).map((t) => (
                <Paper key={t.id} sx={{
                  p: 3,
                  minWidth: 350,
                  maxWidth: 350,
                  flexShrink: 0,
                  borderRadius: '24px',
                  bgcolor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  whiteSpace: 'normal'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={t.avatar} sx={{ width: 48, height: 48, mr: 2 }} />
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{t.name}</Typography>
                      <Typography variant="caption" color="text.secondary">Verified Client</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    "{t.comment}"
                  </Typography>
                </Paper>
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      {/* FAQ Section (Preview) */}
      <Container sx={{ py: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>Have Questions?</Typography>
          <Typography sx={{ color: 'text.secondary', mb: 4 }}>We have answers.</Typography>
          <Button component={Link} to="/faq" variant="outlined" size="large">Visit FAQ Page</Button>
        </Box>
      </Container>


      {/* Owner Call to Action */}
      <Box sx={{ pb: 12 }}>
        <Container>
          <Paper
            sx={{
              p: { xs: 4, md: 8 },
              borderRadius: '32px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              textAlign: 'center',
            }}
          >
            <StorefrontIcon sx={{ fontSize: 64, color: 'primary.main', mb: 3 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Own a Barbershop?
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 6, maxWidth: '600px', mx: 'auto' }}>
              Join the elite. Digitize your business and offer your clients the convenience they deserve.
            </Typography>
            <Button
              component={Link}
              to="/signup" // Changed to signup as barbershop-signup might not exist or be separate
              variant="contained"
              size="large"
              sx={{
                borderRadius: '16px',
                px: 6,
                py: 2,
                bgcolor: 'white',
                color: 'black',
                fontWeight: 700,
                '&:hover': { bgcolor: '#f0f0f0', color: 'black' }
              }}
            >
              Register My Barbershop
            </Button>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;