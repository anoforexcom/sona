import React from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
  {
    question: "How do I list my business on Sona?",
    answer: "It's simple! Click on 'List Your Barbershop' in the navigation menu, create an account, and fill in your business details. Once approved, you can start accepting bookings immediately."
  },
  {
    question: "Is there a free trial for barbershop owners?",
    answer: "Yes, we offer a 14-day free trial for our Pro plan so you can experience all the premium features before committing."
  },
  {
    question: "How do I book an appointment?",
    answer: "Search for a barbershop in your city or by name on the homepage. Browse their services, select a time slot that works for you, and confirm your booking. You'll receive a confirmation email instantly."
  },
  {
    question: "Can I cancel or reschedule my appointment?",
    answer: "Yes, you can manage your appointments from your dashboard. Most barbershops allow cancellations up to 24 hours before the scheduled time."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We support major credit cards and debit cards. Some barbershops may also accept cash payments at the venue."
  },
  {
    question: "Is Sona available in my city?",
    answer: "We are rapidly expanding! You can search for your city on the homepage to see available barbershops. If we're not there yet, we will be soon."
  },
  {
    question: "How do review ratings work?",
    answer: "Only verified customers who have completed an appointment can leave a review. This ensures all ratings on our platform are authentic and trustworthy."
  },
  {
    question: "Do I need an account to book?",
    answer: "Yes, creating an account helps us manage your bookings and send you reminders. It also allows you to save your favorite barbershops."
  },
  {
    question: "How can I contact support?",
    answer: "You can reach our 24/7 support team via the 'Contact Us' link in the footer or by emailing support@sona.com."
  },
  {
    question: "Are my payment details secure?",
    answer: "Absolutely. We use industry-standard encryption and trusted payment processors (like Stripe) to ensure your financial data is always safe."
  },
  {
    question: "Can I book for someone else?",
    answer: "Yes, you can book an appointment for a friend or family member. Just make sure to enter their name in the notes section or let the barber know."
  },
  {
    question: "What if the barber cancels my appointment?",
    answer: "In the rare event of a cancellation by the barber, you will be notified immediately and offered a reschedule or a full refund."
  },
  {
    question: "How do I reset my password?",
    answer: "Click 'Forgot Password' on the login page and follow the instructions sent to your email address."
  },
  {
    question: "Can I add multiple services to a single booking?",
    answer: "Currently, you need to book services individually or select a combo package if the barbershop offers one."
  },
  {
    question: "Is there a mobile app?",
    answer: "We offer a fully responsive web application that works perfectly on all mobile devices. A native app is coming soon!"
  }
];

const FAQ = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 12 }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 900 }}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Everything you need to know about Sona.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              sx={{
                bgcolor: 'rgba(18, 18, 20, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px !important',
                '&:before': { display: 'none' },
                mb: 2,
                boxShadow: 'none',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                sx={{ px: 3, py: 1 }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 4 }}>
                <Typography color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FAQ;
