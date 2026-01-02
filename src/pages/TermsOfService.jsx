
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const TermsOfService = () => {
  return (
    <Container maxWidth="md" sx={{ my: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Terms of Service
      </Typography>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          1. Introduction
        </Typography>
        <Typography paragraph>
          Welcome to Barber Shop Booking ("we", "our", "us"). These Terms of Service ("Terms") govern your use of our web application (the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Service.
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          2. Accounts
        </Typography>
        <Typography paragraph>
          When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
        </Typography>
         <Typography paragraph>
          You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.
        </Typography>
      </Box>

       <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          3. Bookings and Payments
        </Typography>
        <Typography paragraph>
         For barbershop owners, we charge a commission on each booking made through the platform as detailed on our Pricing page. You are responsible for honoring all appointments made through the Service.
        </Typography>
         <Typography paragraph>
         For clients, you agree to pay for the services you book through the platform. All payments are processed through a secure third-party payment processor.
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          4. Termination
        </Typography>
        <Typography paragraph>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          5. Changes to Terms
        </Typography>
        <Typography paragraph>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
        </Typography>
      </Box>
        <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          6. Contact Us
        </Typography>
        <Typography paragraph>
         If you have any questions about these Terms, please contact us.
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsOfService;
