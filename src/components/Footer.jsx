import React from 'react';
import { Container, Grid, Typography, Link, Box, IconButton, TextField, Button, Divider, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#050505',
        color: 'text.secondary',
        pt: 12,
        pb: 6,
        mt: 'auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={8} sx={{ mb: 8 }}>
          {/* Brand & Newsletter Section */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ContentCutIcon sx={{ mr: 1.5, fontSize: 32, color: 'primary.main' }} />
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'white', letterSpacing: '-1px' }}>
                  Sona
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 4, maxWidth: 360, lineHeight: 1.7 }}>
                Elevating the barbershop experience. We connect premium grooming services with clients who value quality and style.
              </Typography>

              <Box sx={{
                p: 0.5,
                bgcolor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                display: 'flex',
                maxWidth: 400
              }}>
                <TextField
                  placeholder="Enter your email"
                  variant="standard"
                  fullWidth
                  InputProps={{
                    disableUnderline: true,
                    sx: { px: 2, color: 'white' }
                  }}
                />
                <Button variant="contained" sx={{ borderRadius: '12px', px: 3, fontWeight: 700 }}>
                  Subscribe
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Links Sections - Simplified to 3 Columns */}
          <Grid item xs={12} lg={8}>
            <Grid container spacing={4}>
              {/* 2. Explore Column - Centered */}
              <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'center' } }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'white', mb: 3, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>
                    Explore
                  </Typography>
                  <Stack spacing={2}>
                    {["Pricing", "Reviews", "FAQ", "Login", "Sign Up"].map((link) => (
                      <Link
                        key={link}
                        component={RouterLink}
                        to={link === "Reviews" ? "/reviews" : link === "FAQ" ? "/faq" : link === "Pricing" ? "/pricing" : link === "Login" ? "/login" : link === "Sign Up" ? "/signup" : "#"}
                        underline="none"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.95rem',
                          transition: 'color 0.2s',
                          '&:hover': { color: 'primary.main' }
                        }}
                      >
                        {link}
                      </Link>
                    ))}
                  </Stack>
                </Box>
              </Grid>

              {/* 3. Legal & Connect Column - Right Aligned */}
              <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'white', mb: 3, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem', textAlign: { xs: 'left', sm: 'right' } }}>
                    Legal
                  </Typography>
                  <Stack spacing={2} alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
                    <Link component={RouterLink} to="/terms-of-service" underline="none" sx={{ color: 'text.secondary', fontSize: '0.95rem', '&:hover': { color: 'primary.main' } }}>
                      Terms of Service
                    </Link>
                    <Link component={RouterLink} to="/privacy-policy" underline="none" sx={{ color: 'text.secondary', fontSize: '0.95rem', '&:hover': { color: 'primary.main' } }}>
                      Privacy Policy
                    </Link>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 6 }} />

        {/* Bottom Section */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} Sona Inc. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, i) => (
              <IconButton key={i} size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                <Icon fontSize="small" />
              </IconButton>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;