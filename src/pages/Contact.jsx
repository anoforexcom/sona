import React from 'react';
import { Box, Container, Typography, Grid, TextField, Button, Paper, InputAdornment, Stack, IconButton, MenuItem } from '@mui/material';
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
                            background: 'linear-gradient(145deg, rgba(23, 23, 26, 0.6) 0%, rgba(10, 10, 11, 0.8) 100%)', // More transparency for aesthetics
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(40px)', // Stronger blur
                            boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)'
                        }}>
                            <Box component="form" noValidate autoComplete="off">
                                <Box sx={{ mb: 4, textAlign: 'left' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>Send us a message</Typography>
                                    <Typography variant="body2" color="text.secondary">We typically reply within 2 hours.</Typography>
                                </Box>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <CustomTextField
                                            placeholder="First Name"
                                            icon={<PersonIcon fontSize="small" />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <CustomTextField
                                            placeholder="Last Name"
                                            icon={<PersonIcon fontSize="small" />}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CustomTextField
                                            placeholder="Email Address"
                                            type="email"
                                            icon={<EmailIcon fontSize="small" />}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CustomTextField
                                            select
                                            defaultValue=""
                                            placeholder="Select Subject"
                                            icon={<SubjectIcon fontSize="small" />}
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
                                            placeholder="Your Message..."
                                            multiline
                                            rows={4}
                                            icon={<MessageIcon fontSize="small" />}
                                            alignIconTop
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            sx={{
                                                py: 2,
                                                mt: 2,
                                                borderRadius: '16px',
                                                fontSize: '1rem',
                                                fontWeight: 700,
                                                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                                                boxShadow: '0 8px 20px -4px rgba(59, 130, 246, 0.5)',
                                                textTransform: 'none',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 12px 24px -4px rgba(59, 130, 246, 0.6)',
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
// Improved CustomTextField with better spacing and standard MUI Select
const CustomTextField = ({ icon, select, options, alignIconTop, ...props }) => {
    return (
        <TextField
            {...props}
            select={select}
            variant="filled"
            fullWidth
            InputProps={{
                disableUnderline: true,
                startAdornment: (
                    <InputAdornment position="start" sx={{ mt: alignIconTop ? '16px' : 0, alignSelf: alignIconTop ? 'flex-start' : 'center', color: 'text.secondary' }}>
                        {icon}
                    </InputAdornment>
                ),
                sx: {
                    borderRadius: '16px',
                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.2s ease-in-out',
                    color: 'white',
                    '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.06)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&.Mui-focused': {
                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                        borderColor: '#3B82F6',
                        boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.15)',
                    },
                    p: 0,
                    overflow: 'hidden'
                },
                ...props.InputProps
            }}
            // Correctly handle select spacing
            SelectProps={{
                MenuProps: {
                    PaperProps: {
                        sx: {
                            bgcolor: '#18181b', // Dark background for dropdown
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            '& .MuiMenuItem-root': {
                                py: 1.5,
                                '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.1)' },
                                '&.Mui-selected': { bgcolor: 'rgba(59, 130, 246, 0.2) !important' }
                            }
                        }
                    }
                }
            }}
            sx={{
                '& .MuiFilledInput-root': {
                    paddingTop: '16px', // Restore standard padding
                    paddingBottom: '16px',
                    paddingLeft: '12px',
                },
                '& .MuiFilledInput-input': {
                    paddingTop: '0',
                    paddingBottom: '0'
                }
            }}
        >
            {select && options ? (
                options.map((option) => (
                    <MenuItem key={option.value} value={option.value} disabled={option.disabled} sx={{ color: option.disabled ? 'text.disabled' : 'text.primary' }}>
                        {option.label}
                    </MenuItem>
                ))
            ) : null}
        </TextField>
    );
};

export default Contact;
