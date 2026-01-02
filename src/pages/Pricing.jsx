
import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardHeader, Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { Link as RouterLink } from 'react-router-dom';

const tiers = [
  {
    title: 'Basic Plan',
    price: '0',
    description: [
      'List your barbershop',
      'Manage your profile and services',
      'Accept online bookings',
    ],
    commission: '5%', // Comissão por reserva
    buttonText: 'Get Started',
    buttonVariant: 'outlined',
  },
  {
    title: 'Pro Plan',
    subheader: 'Most Popular',
    price: '29',
    description: [
        'All features from the Basic Plan',
        'Advanced analytics and reports',
        'Featured listing on our homepage',
        'Priority support',
    ],
    commission: '2%', // Comissão reduzida
    buttonText: 'Upgrade to Pro',
    buttonVariant: 'contained',
  },
];

const Pricing = () => {
  return (
    <Container maxWidth="md" sx={{ my: 8 }}>
      <Typography variant="h2" component="h1" align="center" gutterBottom>
        Pricing
      </Typography>
      <Typography variant="h5" align="center" color="text.secondary" component="p" sx={{ mb: 6 }}>
        Choose the plan that best fits your barbershop's needs. No hidden fees.
      </Typography>

      <Grid container spacing={4} alignItems="flex-end">
        {tiers.map((tier) => (
          <Grid
            item
            key={tier.title}
            xs={12}
            sm={tier.title === 'Pro Plan' ? 12 : 6}
            md={6}
          >
            <Card>
              <CardHeader
                title={tier.title}
                subheader={tier.subheader}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{
                  align: 'center',
                  color: 'warning.main',
                }}
                sx={{ backgroundColor: 'background.default' }}
              />
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                    mb: 2,
                  }}
                >
                  <Typography component="h2" variant="h3" color="text.primary">
                    ${tier.price}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    /mo
                  </Typography>
                </Box>
                <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>
                  <b>{tier.commission}</b> commission per booking
                </Typography>
                <ul>
                  {tier.description.map((line) => (
                    <Typography
                      component="li"
                      variant="subtitle1"
                      align="left"
                      key={line}
                       sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1.5 }}
                    >
                        <CheckIcon color="success"/> {line}
                    </Typography>
                  ))}
                </ul>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button component={RouterLink} to="/barbershop-signup" fullWidth variant={tier.buttonVariant}>
                  {tier.buttonText}
                </Button>
               </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Pricing;
