
import React from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqData = [
    {
      question: 'How much does it cost to list my barbershop?',
      answer:
        'Listing your barbershop is completely free under our Basic Plan! You only pay a small commission on successful bookings. For more advanced features, you can upgrade to our Pro Plan.',
    },
    {
      question: 'How do I receive payments from clients?',
      answer:
        'Payments are processed securely through our platform. Payouts are sent to your connected bank account on a regular basis, minus the commission fee.',
    },
    {
      question: 'Can I manage my services and prices?',
      answer:
        'Yes! From your barbershop dashboard, you have full control to add, edit, or remove services, set prices, and manage your availability.',
    },
    {
      question: 'What happens if a client cancels an appointment?',
      answer:
        'You can set your own cancellation policy. For example, you can choose to charge a cancellation fee for late cancellations. This can be configured in your barbershop\'s dashboard.',
    },
  ];

const FAQ = () => {
  return (
    <Container maxWidth="md" sx={{ my: 8 }}>
      <Typography variant="h2" component="h1" align="center" gutterBottom>
        Frequently Asked Questions
      </Typography>
      <Box sx={{ mt: 4 }}>
        {faqData.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}a-content`}
              id={`panel${index}a-header`}
            >
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

export default FAQ;
