import React from 'react';
import { Box, Container, Typography, Grid, TextField, Button, Paper, InputAdornment, Stack, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/Subject';
import MessageIcon from '@mui/icons-material/Message';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Contact = () => {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#050505', py: { xs: 8, md: 16 } }}>
            <Container maxWidth="lg">
                <Grid container spacing={8} alignItems="center" justifyContent="center">
                    {/* Left Column: Info & Context */}
                    <Grid item xs={12} md={5} lg={5} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <Box sx={{ maxWidth: 480, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{ display: 'inline-block', px: 2, py: 0.5, mb: 3, borderRadius: '20px', bgcolor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                <Typography variant="caption" sx={{ color: '#3B82F6', fontWeight: 700, letterSpacing: '1px' }}>
                                    CONTACT US
                                </Typography>
                            </Box>
                            <Typography variant="h2" component="h1" sx={{ fontWeight: 900, mb: 3, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center' }}>
                                Let's Start a Conversation.
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 6, lineHeight: 1.6, fontWeight: 400, textAlign: 'center' }}>
                                Have a question about Sona? Interested in partnering? Or just want to say hi? We're here to help you elevate your style.
                            </Typography>

                            <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-start' }, justifyContent: 'space-between', gap: 2, mt: 4 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1 }}>
                                    <Box sx={{ width: 56, height: 56, mb: 1, borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <EmailIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                                    </Box>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Email</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>support@sona.com</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1 }}>
                                    <Box sx={{ width: 56, height: 56, mb: 1, borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <PhoneIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                                    </Box>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Call</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>+1 (555) 123-4567</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1 }}>
                                    <Box sx={{ width: 56, height: 56, mb: 1, borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <LocationOnIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                                    </Box>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Visit</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>888 Innovation Dr.</Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 6, display: 'flex', gap: 2 }}>
                                {[FacebookIcon, TwitterIcon, InstagramIcon].map((Icon, i) => (
                                    <IconButton key={i} sx={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'text.secondary', '&:hover': { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main' } }}>
                                        <Icon fontSize="small" />
                                    </IconButton>
                                ))}
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right Column: Premium Form */}
                    <Grid item xs={12} md={7} lg={6}>
                        <Paper elevation={24} sx={{
                            p: { xs: 4, sm: 6 },
                            borderRadius: '40px',
                            background: 'linear-gradient(145deg, rgba(23, 23, 26, 0.9) 0%, rgba(10, 10, 11, 0.95) 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)'
                        }}>
                            <Box component="form" noValidate autoComplete="off">
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <CustomTextField
                                            fullWidth
                                            placeholder="First Name"
                                            icon={<PersonIcon />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <CustomTextField
                                            fullWidth
                                            placeholder="Last Name"
                                            icon={<PersonIcon />}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CustomTextField
                                            fullWidth
                                            placeholder="Email Address"
                                            type="email"
                                            icon={<EmailIcon />}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CustomTextField
                                            fullWidth
                                            select
                                            placeholder="Subject"
                                            icon={<SubjectIcon />}
                                            options={[
                                                { value: '', label: 'Select a Subject', disabled: true },
                                                { value: 'support', label: 'Customer Support' },
                                                { value: 'sales', label: 'Sales & Partnership' },
                                                { value: 'feedback', label: 'General Feedback' }
                                            ]}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CustomTextField
                                            fullWidth
                                            placeholder="Your Message..."
                                            multiline
                                            rows={5}
                                            icon={<MessageIcon />}
                                            alignIconTop
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            sx={{
                                                py: 2.5,
                                                mt: 2,
                                                borderRadius: '16px',
                                                fontSize: '1.1rem',
                                                fontWeight: 700,
                                                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                                                boxShadow: '0 10px 30px -10px rgba(59, 130, 246, 0.6)',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.8)',
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            Send Message
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

// Reusable styled component for consistent premium look
const CustomTextField = ({ icon, select, options, alignIconTop, ...props }) => {
    return (
        <TextField
            {...props}
            select={select}
            SelectProps={select ? { native: true } : undefined}
            variant="outlined"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start" sx={{ mb: alignIconTop ? 14 : 0, color: 'text.secondary' }}>
                        {icon}
                    </InputAdornment>
                ),
                sx: {
                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '16px',
                    color: 'white',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    border: '1px solid transparent',
                    '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                    },
                    '&.Mui-focused': {
                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                        borderColor: 'primary.main',
                        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
                    },
                    '& fieldset': { border: 'none' }, // Remove default Material UI border
                    py: 1.5,
                    px: 2
                }
            }}
            sx={{
                '& .MuiInputBase-root': { padding: 0 } // Reset padding to handle inner sx better
            }}
        >
            {select && options ? (
                options.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.disabled}>
                        {option.label}
                    </option>
                ))
            ) : null}
        </TextField>
    );
};

export default Contact;
