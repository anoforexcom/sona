
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ my: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Privacy Policy
      </Typography>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          1. Information We Collect
        </Typography>
        <Typography paragraph>
          We collect information that you provide directly to us when you create an account, such as your name, email address, and phone number. When you use our Service to book appointments, we also collect information about your bookings.
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          2. How We Use Your Information
        </Typography>
        <Typography paragraph>
          We use the information we collect to provide, maintain, and improve our services, including to process transactions, send you confirmations and reminders, and respond to your comments, questions, and requests.
        </Typography>
      </Box>

       <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          3. Information Sharing
        </Typography>
        <Typography paragraph>
        We do not share your personal information with third parties except as necessary to provide our services (e.g., with payment processors) or as required by law.
        </Typography>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          4. Security
        </Typography>
        <Typography paragraph>
          We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. We use Firebase Authentication and other security features to protect your data.
        </Typography>
      </Box>

        <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          5. Contact Us
        </Typography>
        <Typography paragraph>
         If you have any questions about this Privacy Policy, please contact us.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
