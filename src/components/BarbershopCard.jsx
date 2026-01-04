import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Box,
    Typography,
    Button,
    Rating,
    Chip
} from '@mui/material';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';

const BarbershopCard = ({ barbershop, isFavorite }) => {
    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            bgcolor: 'background.paper',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            '&:hover': {
                transform: 'translateY(-12px)',
                borderColor: 'primary.main',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            },
        }}>
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="240"
                    image={barbershop.imageUrl || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop'}
                    alt={barbershop.name}
                    sx={{ filter: 'brightness(0.9)', transition: '0.3s', '&:hover': { filter: 'brightness(1)' } }}
                />
                <Box sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(8px)',
                    px: 1.5, py: 0.5,
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>
                        {barbershop.priceRange || 'Prices Varies'}
                    </Typography>
                </Box>
                {isFavorite && (
                    <Box sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        bgcolor: 'rgba(239, 68, 68, 0.9)',
                        backdropFilter: 'blur(4px)',
                        p: 0.8,
                        borderRadius: '50%',
                        display: 'flex',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }}>
                        <FavoriteIcon sx={{ color: 'white', fontSize: 18 }} />
                    </Box>
                )}
            </Box>
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography gutterBottom variant="h5" sx={{ fontWeight: 800, mb: 0.5, maxWidth: '100%' }}>
                        {barbershop.name}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 1, mb: 2 }}>
                    <LocationCityIcon sx={{ fontSize: '1.2rem', color: 'primary.main' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {barbershop.city || 'Location Unknown'}
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{
                    mb: 2,
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                    opacity: 0.8
                }}>
                    {barbershop.description || 'No description available for this barbershop.'}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {['Haircut', 'Beard', 'Styling'].map(tag => (
                        <Chip key={tag} label={tag} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'text.secondary', border: '1px solid rgba(255,255,255,0.05)' }} />
                    ))}
                </Box>

            </CardContent>
            <Box sx={{ p: 3, pt: 0 }}>
                <Button
                    component={Link}
                    to={`/barbershop/${barbershop.id}`}
                    variant="contained"
                    fullWidth
                    sx={{
                        borderRadius: '14px',
                        py: 1.5,
                        boxShadow: 'none',
                        fontSize: '1rem',
                        fontWeight: 700,
                        '&:hover': { boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)' }
                    }}
                >
                    Book Appointment
                </Button>
            </Box>
        </Card>
    );
};

export default BarbershopCard;
