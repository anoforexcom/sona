import React from 'react';
import { Box, Container, Typography, Grid, Paper, Avatar, Rating } from '@mui/material';

// Function to generate dummy testimonials
const generateTestimonials = () => {
    const names = ["Alex Johnson", "Michael Smith", "Sarah Williams", "David Brown", "Emily Davis", "James Wilson", "Jessica Garcia", "Robert Miller", "Lisa Martinez", "William Anderson", "Daniel Thomas", "Sophie Clark", "Ryan White", "Olivia Lewis", "Lucas Walker", "Chloe Hall", "Ethan Allen", "Mia Young", "Noah King", "Ava Scott", "Liam Wright", "Ella Green", "Mason Baker", "Grace Adams", "Logan Nelson", "Harper Carter", "Elijah Mitchell", "Avery Perez", "Lucas Roberts", "Scarlett Turner", "Benjamin Phillips", "Amelia Campbell", "Henry Parker", "Victoria Evans", "Jackson Edwards", "Madison Collins", "Sebastian Stewart", "Penelope Sanchez", "Jack Morris", "Riley Rogers", "Owen Reed", "Zoey Cook", "Gabriel Morgan", "Nora Bell", "Carter Murphy", "Lily Bailey", "Luke Rivera", "Hannah Cooper", "Brayden Richardson", "Stella Cox"];

    const comments = [
        "Best haircut I've ever had! The service was impeccable.",
        "Sona made booking so easy. Highly recommended!",
        "Great atmosphere and professional barbers.",
        "I love the convenience of finding a shop near me.",
        "Premium experience from start to finish.",
        "Finally, an app that actually works for booking appointments.",
        "My barber was amazing, will definitely return.",
        "Clean, modern, and efficient. 5 stars.",
        "The dark mode design of this site is sleek!",
        "Booking took less than a minute. Fantastic.",
        "Top-notch service and great prices.",
        "I found my new favorite barbershop thanks to Sona.",
        "User-friendly interface and fast performance.",
        "Reliable and trustworthy reviews helped me choose.",
        "Excellent platform for discovering local talent.",
        "Saved me so much time avoiding phone calls.",
        "The reminders are a lifesaver.",
        "High quality cuts and great conversation.",
        "Professionalism at its finest.",
        "Would recommend to all my friends.",
        "The best way to manage my grooming schedule.",
        "Love the cashless payment option.",
        "Super convenient for my busy lifestyle.",
        "Great selection of barbershops in my area.",
        "Easy to compare prices and services.",
        "The verified reviews gave me confidence.",
        "Slick design and smooth user experience.",
        "Found a hidden gem of a barbershop!",
        "Exceptional customer support when I had a question.",
        "Booking for my son was a breeze.",
        "No more waiting in line effortlessly.",
        "The loyalty program potential is huge.",
        "A game-changer for the barber industry.",
        "Cleanest fade I've gotten in years.",
        "Detailed profiles made choosing easy.",
        "Notifications keep me on track.",
        "Simply the best booking app out there.",
        "Fast, reliable, and looks great.",
        "Connecting clients with pros seamlessly.",
        "I use it for all my appointments now.",
        "Support local businesses with Sona.",
        "Effortless scheduling every time.",
        "Great for last-minute bookings.",
        "Transparency in pricing is appreciated.",
        "A must-have for anyone who cares about their style.",
        "Innovative and user-centric.",
        "Takes the hassle out of getting a haircut.",
        "Consistently good experiences.",
        "Highly efficient and effective.",
        "10/10 would use again."
    ];

    return Array.from({ length: 50 }, (_, i) => ({
        id: i,
        name: names[i % names.length],
        comment: comments[i % comments.length],
        rating: 5,
        avatar: `https://i.pravatar.cc/150?img=${i + 1}`
    }));
};

const testimonials = generateTestimonials();

const Testimonials = () => {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 12 }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 10 }}>
                    <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 900 }}>
                        What Our Clients Say
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
                        Join thousands of satisfied customers who have elevated their style with Sona.
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {testimonials.map((t) => (
                        <Grid item key={t.id} xs={12} sm={6} md={4}>
                            <Paper
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: '24px',
                                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.04)',
                                        transform: 'translateY(-4px)',
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar src={t.avatar} sx={{ width: 48, height: 48, mr: 2, border: '2px solid #3B82F6' }} />
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{t.name}</Typography>
                                        <Rating value={t.rating} readOnly size="small" sx={{ color: '#FBBF24' }} />
                                    </Box>
                                </Box>
                                <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    "{t.comment}"
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Testimonials;
