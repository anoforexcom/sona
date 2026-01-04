import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import {
    Container,
    Typography,
    Box,
    Paper,
    Rating,
    Avatar,
    Divider,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';

const ClientReviews = () => {
    const { currentUser } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!currentUser) return;
            try {
                // Assuming 'reviews' top-level collection or similar structure. 
                // For this demo, let's query the 'reviews' collection where userId matches
                const q = query(collection(db, 'reviews'), where('userId', '==', currentUser.uid));
                const snap = await getDocs(q);
                const userReviews = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setReviews(userReviews);
            } catch (err) {
                console.error("Error fetching reviews", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [currentUser]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="md">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>My Reviews</Typography>
                <Typography color="text.secondary">History of your feedback.</Typography>
            </Box>

            <Paper sx={{ borderRadius: '16px' }}>
                {reviews.length > 0 ? (
                    <List>
                        {reviews.map((review, index) => (
                            <React.Fragment key={review.id}>
                                <ListItem alignItems="flex-start" sx={{ p: 3 }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                            <CommentIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography fontWeight="bold">{review.barbershopName || 'Barbershop'}</Typography>
                                                <Typography variant="caption" color="text.secondary">{new Date(review.date?.toDate()).toLocaleDateString()}</Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 1 }}>
                                                <Rating value={review.rating} size="small" readOnly sx={{ mb: 1 }} />
                                                <Typography variant="body2" color="text.primary">
                                                    {review.text}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < reviews.length - 1 && <Divider component="li" />}
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                        <CommentIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                        <Typography color="text.secondary">You haven't posted any reviews yet.</Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default ClientReviews;
