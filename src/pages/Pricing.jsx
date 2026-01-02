import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from 'react-router-dom';

const tiers = [
  {
    title: 'Basic',
    price: '0',
    description: ['Basic listing', 'Online booking', 'Standard support', 'Up to 3 barbers'],
    buttonText: 'Get Started for Free',
    buttonVariant: 'outlined',
  },
  {
    title: 'Pro',
    subheader: 'Most Popular',
    price: '29',
    description: [
      'Everything in Basic',
      'Priority support',
      'Analytics dashboard',
      'Unlimited barbers',
      'Marketing tools',
    ],
    buttonText: 'Get Started',
    buttonVariant: 'contained',
  },
  {
    title: 'Enterprise',
    price: '99',
    description: [
      'Everything in Pro',
      'Dedicated account manager',
      'Custom branding',
      'API access',
      'Multi-location management',
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outlined',
  },
];

const Pricing = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 12 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 900, mb: 3 }}>
            Simple, Transparent Pricing
          </Typography>
          <Typography variant="h5" color="text.secondary" component="p" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Choose the perfect plan for your barbershop. No hidden fees. Cancel anytime.
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="flex-end">
          {tiers.map((tier) => (
            <Grid item key={tier.title} xs={12} sm={6} md={4}>
              <Paper
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  p: 4,
                  height: '100%',
                  borderRadius: '32px',
                  bgcolor: tier.title === 'Pro' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(18, 18, 20, 0.6)',
                  backdropFilter: 'blur(24px)',
                  border: tier.title === 'Pro' ? '2px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.08)',
                  position: 'relative',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  }
                }}
              >
                {tier.title === 'Pro' && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      bgcolor: 'primary.main',
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                    }}
                  >
                    POPULAR
                  </Box>
                )}
                <Box sx={{ mb: 4 }}>
                  <Typography component="h2" variant="h4" color="text.primary" sx={{ fontWeight: 800 }}>
                    {tier.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 2 }}>
                    <Typography component="h3" variant="h2" color="text.primary" sx={{ fontWeight: 900 }}>
                      ${tier.price}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      /mo
                    </Typography>
                  </Box>
                </Box>

                <List sx={{ mb: 4, flexGrow: 1 }}>
                  {tier.description.map((line) => (
                    <ListItem key={line} disableGutters sx={{ py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon sx={{ color: 'primary.main' }} />
                      </ListItemIcon>
                      <ListItemText primary={line} primaryTypographyProps={{ variant: 'body1' }} />
                    </ListItem>
                  ))}
                </List>

                <Button
                  component={Link}
                  to="/signup"
                  fullWidth
                  variant={tier.buttonVariant}
                  size="large"
                  sx={{
                    py: 1.5,
                    borderRadius: '16px',
                    fontSize: '1rem',
                    fontWeight: 700
                  }}
                >
                  {tier.buttonText}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Pricing;
