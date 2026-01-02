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
        backgroundColor: '#0A0A0B',
        color: 'text.secondary',
        py: 8,
        mt: 'auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ContentCutIcon sx={{ mr: 1.5, fontSize: 32, color: 'primary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
                Sona
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6 }}>
              The ultimate solution for barbershop management.
              Modernize your business, optimize your bookings, and connect with your clients in a premium way.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[FacebookIcon, TwitterIcon, InstagramIcon].map((Icon, i) => (
                <IconButton
                  key={i}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.03)',
                    color: 'text.secondary',
                    '&:hover': { bgcolor: 'primary.main', color: 'white' }
                  }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <Grid container spacing={4}>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 3 }}>
                  Platform
                </Typography>
                {['Pricing', 'Reviews', 'FAQ'].map(text => (
                  <Link key={text} component={RouterLink} to={`/${text.toLowerCase()}`} color="inherit" underline="none" display="block" sx={{ mb: 2, '&:hover': { color: 'primary.main' } }}>
                    {text}
                  </Link>
                ))}
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 3 }}>
                  Legal
                </Typography>
                {['Terms of Service', 'Privacy Policy'].map(text => (
                  <Link key={text} component={RouterLink} to={`/${text.toLowerCase().replace(/ /g, '-')}`} color="inherit" underline="none" display="block" sx={{ mb: 2, '&:hover': { color: 'primary.main' } }}>
                    {text}
                  </Link>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box mt={8} pt={4} textAlign="center" borderTop="1px solid rgba(255, 255, 255, 0.05)">
          <Typography variant="body2" sx={{ opacity: 0.5 }}>
            &copy; {new Date().getFullYear()} Sona. Crafted for excellence.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;