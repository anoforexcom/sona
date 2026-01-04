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
import BarbershopCard from '../components/BarbershopCard';


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
              letterSpacing: { xs: '-1px', md: '-2.5px' },
              fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
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

      {/* Features Section */}
      <Container sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
          <Box sx={{
            display: 'inline-block',
            px: 2,
            py: 0.5,
            mb: 3,
            borderRadius: '20px',
            bgcolor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <Typography variant="caption" sx={{ color: '#3B82F6', fontWeight: 700, letterSpacing: '1px' }}>
              THE SONA ADVANTAGE
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '2rem', md: '3.5rem' } }}>Why Choose Sona?</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>Experience the future of grooming with our cutting-edge platform.</Typography>
        </Box>
        <Grid container spacing={4}>
          {[
            { title: "Instant Booking", desc: "Book your appointment in seconds, 24/7.", icon: "⚡" },
            { title: "Top Rated Barbers", desc: "Curated selection of the best professionals.", icon: "⭐" },
            { title: "Smart Reminders", desc: "Never miss an appointment again.", icon: "🔔" },
            { title: "Cashless Payment", desc: "Pay securely within the app.", icon: "💳" }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper sx={{
                p: { xs: 4, md: 5 },
                height: '100%',
                borderRadius: '32px',
                bgcolor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center', // Centered text
                transition: 'all 0.3s ease',
                cursor: 'default',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  bgcolor: 'rgba(255,255,255,0.04)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  borderColor: 'rgba(59, 130, 246, 0.3)'
                }
              }}>
                <Box sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  bgcolor: 'rgba(59, 130, 246, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  fontSize: '1.5rem',
                  mx: 'auto' // Added mx auto
                }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>{feature.title}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>{feature.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Value Proposition Section */}
      <Box sx={{ py: { xs: 8, md: 16 }, bgcolor: '#0A0A0B', position: 'relative', overflow: 'hidden' }}>
        {/* Background Gradients */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)' }} />

        <Container sx={{ position: 'relative', zIndex: 1 }}>
          {/* Section 1: Clients */}
          <Grid container spacing={{ xs: 8, md: 12 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -20,
                    borderRadius: '40px',
                    background: 'linear-gradient(45deg, #3B82F6 0%, transparent 100%)',
                    opacity: 0.2,
                    zIndex: -1
                  }
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1599351431202-6e0005fc6df5?q=80&w=2070&auto=format&fit=crop"
                  sx={{ width: '100%', borderRadius: '32px', boxShadow: '0 40px 80px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
                  alt="Client experience"
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'inline-block', px: 2, py: 0.5, mb: 3, borderRadius: '20px', bgcolor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 700, letterSpacing: '1px' }}>
                  FOR CLIENTS
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, lineHeight: 1.1 }}>
                Look Your Best,<br />
                <Box component="span" sx={{ color: 'primary.main' }}>Without the Hassle.</Box>
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6, fontWeight: 400 }}>
                Say goodbye to waiting on hold. Find the perfect barber, check their real-time availability, and book instantly.
                Read verified reviews and browse portfolios to ensure you get the style you want.
              </Typography>
              <Button component={Link} to="/admin" variant="contained" size="large" sx={{ px: 5, py: 2, borderRadius: '16px', fontSize: '1.05rem', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)' }}>
                Book Your Cut
              </Button>
            </Grid>
          </Grid>

          {/* Section 2: Barbershops */}
          <Grid container spacing={{ xs: 8, md: 12 }} alignItems="center" sx={{ mt: { xs: 8, md: 16 }, flexDirection: { xs: 'column-reverse', md: 'row' } }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'inline-block', px: 2, py: 0.5, mb: 3, borderRadius: '20px', bgcolor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 700, letterSpacing: '1px' }}>
                  FOR PARTNERS
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, lineHeight: 1.1 }}>
                Grow Your Business,<br />
                <Box component="span" sx={{ color: 'primary.main' }}>Simplify Your Life.</Box>
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6, fontWeight: 400 }}>
                Stop chasing no-shows and managing a paper calendar. Sona gives you powerful tools to manage your schedule,
                showcase your work, and grow your clientele effortlessly.
              </Typography>
              <Button component={Link} to="/signup" variant="outlined" size="large" sx={{ px: 5, py: 2, borderRadius: '16px', fontSize: '1.05rem', borderColor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(59, 130, 246, 0.05)' } }}>
                Become a Partner
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -20,
                    borderRadius: '40px',
                    background: 'linear-gradient(-45deg, #3B82F6 0%, transparent 100%)',
                    opacity: 0.2,
                    zIndex: -1
                  }
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1585747833206-75b1d8a1d4b3?q=80&w=2070&auto=format&fit=crop"
                  sx={{ width: '100%', borderRadius: '32px', boxShadow: '0 40px 80px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
                  alt="Barbershop management"
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>How It Works</Typography>
          <Typography variant="h6" color="text.secondary">Your best look in three simple steps.</Typography>
        </Box>
        <Grid container spacing={4} sx={{ textAlign: 'center' }}>
          {[
            { step: "01", title: "Search", desc: "Discover top-rated barbers in your area." },
            { step: "02", title: "Choose", desc: "Select services and a time that fits you." },
            { step: "03", title: "Book", desc: "Confirm instantly. No phone calls needed." }
          ].map((item, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Box sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative'
              }}>
                <Typography variant="h1" sx={{
                  color: 'rgba(255,255,255,0.03)',
                  fontWeight: 900,
                  fontSize: '8rem',
                  lineHeight: 1,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  width: '100%',
                  textAlign: 'center',
                  zIndex: 0
                }}>
                  {item.step}
                </Typography>
                <Box sx={{ position: 'relative', zIndex: 1, mt: 4, width: '100%', textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>{item.title}</Typography>
                  <Typography color="text.secondary" sx={{ maxWidth: '250px', lineHeight: 1.6, mx: 'auto' }}>{item.desc}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>


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
              <BarbershopCard barbershop={barbershop} />
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