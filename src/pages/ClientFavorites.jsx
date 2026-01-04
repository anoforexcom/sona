import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Rating,
    Chip,
    Button,
    CircularProgress
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import BarbershopCard from '../components/BarbershopCard';

const ClientFavorites = () => {
    const { currentUser } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!currentUser) return;
            try {
                // Fetch user's favorites list (array of IDs or subcollection)
                // Assuming we store them in a subcollection 'favorites' under the user
                const favRef = collection(db, 'users', currentUser.uid, 'favorites');
                const favSnap = await getDocs(favRef);

                if (favSnap.empty) {
                    setLoading(false);
                    return;
                }

                // Fetch details for each favorite barbershop
                const shops = [];
                for (const d of favSnap.docs) {
                    const shopId = d.id; // Assuming doc ID is shop ID
                    const shopDoc = await getDoc(doc(db, 'barbershops', shopId));
                    if (shopDoc.exists()) {
                        shops.push({ id: shopId, ...shopDoc.data() });
                    }
                }
                setFavorites(shops);
            } catch (err) {
                console.error("Error fetching favorites:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [currentUser]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>My Favorites</Typography>
                <Typography color="text.secondary">Quick access to your preferred barbershops.</Typography>
            </Box>

            {favorites.length > 0 ? (
                <Grid container spacing={3}>
                    {favorites.map((shop) => (
                        <Grid item xs={12} sm={6} md={4} key={shop.id}>
                            <BarbershopCard barbershop={shop} isFavorite={true} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Paper sx={{ py: 8, textAlign: 'center', borderRadius: '24px', bgcolor: 'transparent', border: '2px dashed rgba(255,255,255,0.1)' }}>
                    <FavoriteIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No favorites yet
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                        Start exploring barbershops and tap the heart icon to save them here for quick access.
                    </Typography>
                    <Button variant="contained" component={RouterLink} to="/" startIcon={<SearchIcon />} sx={{ borderRadius: '10px' }}>
                        Find Barbershops
                    </Button>
                </Paper>
            )}
        </Container>
    );
};

export default ClientFavorites;
