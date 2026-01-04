import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import {
    Container,
    Typography,
    Box,
    TextField,
    Grid,
    Paper,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BarbershopCard from '../components/BarbershopCard';

const Barbershops = () => {
    const [barbershops, setBarbershops] = useState([]);
    const [filteredBarbershops, setFilteredBarbershops] = useState([]);
    const [cityFilter, setCityFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBarbershops = async () => {
            setLoading(true);
            try {
                const q = query(
                    collection(db, 'barbershops'),
                    where('approved', '==', true)
                );

                const querySnapshot = await getDocs(q);
                const barbershopsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setBarbershops(barbershopsData);
                setFilteredBarbershops(barbershopsData);
            } catch (error) {
                console.error('Error fetching barbershops:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBarbershops();
    }, []);

    useEffect(() => {
        let result = barbershops;

        if (cityFilter) {
            result = result.filter(shop =>
                shop.city?.toLowerCase().includes(cityFilter.toLowerCase())
            );
        }

        if (nameFilter) {
            result = result.filter(shop =>
                shop.name?.toLowerCase().includes(nameFilter.toLowerCase())
            );
        }

        setFilteredBarbershops(result);
    }, [cityFilter, nameFilter, barbershops]);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 4, pb: 12 }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h2" component="h1" sx={{ fontWeight: 800, mb: 2 }}>
                        Find Your Barber
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                        Discover the best local barbershops and book your next cut in seconds.
                    </Typography>
                </Box>

                {/* Filter Bar */}
                <Paper
                    sx={{
                        p: 2,
                        mb: 8,
                        borderRadius: '24px',
                        bgcolor: 'rgba(18, 18, 20, 0.6)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2
                    }}
                >
                    <TextField
                        placeholder="Filter by city..."
                        variant="standard"
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        fullWidth
                        InputProps={{
                            disableUnderline: true,
                            startAdornment: <LocationCityIcon sx={{ mr: 1.5, color: 'primary.main' }} />,
                            sx: {
                                p: '12px 16px',
                                bgcolor: 'rgba(255,255,255,0.03)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }
                        }}
                    />
                    <TextField
                        placeholder="Search by barbershop name..."
                        variant="standard"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        fullWidth
                        InputProps={{
                            disableUnderline: true,
                            startAdornment: <SearchIcon sx={{ mr: 1.5, color: 'primary.main' }} />,
                            sx: {
                                p: '12px 16px',
                                bgcolor: 'rgba(255,255,255,0.03)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }
                        }}
                    />
                </Paper>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {filteredBarbershops.length > 0 ? (
                            <Grid container spacing={4}>
                                {filteredBarbershops.map((barbershop) => (
                                    <Grid item key={barbershop.id} xs={12} sm={6} md={4}>
                                        <BarbershopCard barbershop={barbershop} />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 12 }}>
                                <Typography variant="h6" color="text.secondary">
                                    No barbershops found matching your criteria.
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
};

export default Barbershops;
