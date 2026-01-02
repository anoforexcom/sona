import React from 'react';
import { Container, Grid, Typography, Link, Box, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'secondary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Left Column: Branding/About */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ContentCutIcon sx={{ mr: 1.5, fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Barber Booking
                </Typography>
            </Box>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              The modern solution for managing your barbershop and connecting with clients. Streamline your bookings, manage your services, and grow your business with us.
            </Typography>
          </Grid>

          {/* Right Column: Links and Social Media */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={5}>
              {/* Company Links */}
              <Grid item xs={6} sm={6} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Company
                </Typography>
                <Link component={RouterLink} to="/faq" color="inherit" display="block" sx={{ mb: 1, '&:hover': { color: 'primary.main' } }}>
                  FAQ
                </Link>
                <Link component={RouterLink} to="/pricing" color="inherit" display="block" sx={{ mb: 1, '&:hover': { color: 'primary.main' } }}>
                  Pricing
                </Link>
              </Grid>
              {/* Legal Links */}
              <Grid item xs={6} sm={6} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Legal
                </Typography>
                <Link component={RouterLink} to="/terms-of-service" color="inherit" display="block" sx={{ mb: 1, '&:hover': { color: 'primary.main' } }}>
                  Terms of Service
                </Link>
                <Link component={RouterLink} to="/privacy-policy" color="inherit" display="block" sx={{ '&:hover': { color: 'primary.main' } }}>
                  Privacy Policy
                </Link>
              </Grid>
              {/* Follow Us */}
              <Grid item xs={12} sm={12} md={12} sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Follow Us
                </Typography>
                <Box>
                  <IconButton href="#" color="inherit" aria-label="Facebook" sx={{ '&:hover': { color: 'primary.main' } }}>
                    <FacebookIcon />
                  </IconButton>
                  <IconButton href="#" color="inherit" aria-label="Twitter" sx={{ '&:hover': { color: 'primary.main' } }}>
                    <TwitterIcon />
                  </IconButton>
                  <IconButton href="#" color="inherit" aria-label="Instagram" sx={{ '&:hover': { color: 'primary.main' } }}>
                    <InstagramIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Copyright Section (Full Width) */}
        <Box mt={5} textAlign="center" pt={3} borderTop={1} borderColor="rgba(255,255,255,0.1)">
          <Typography variant="body2" color="rgba(255,255,255,0.5)">
            &copy; {new Date().getFullYear()} Barber Booking. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;