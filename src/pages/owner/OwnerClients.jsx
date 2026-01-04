import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import {
    Container,
    Typography,
    Box,
    Paper,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Chip,
    IconButton,
    TextField,
    InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MessageIcon from '@mui/icons-material/Message';
import HistoryIcon from '@mui/icons-material/History';
import PhoneIcon from '@mui/icons-material/Phone';

const OwnerClients = () => {
    const { currentUser } = useAuth();
    const [barbershopId, setBarbershopId] = useState(null);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchShopId = async () => {
            if (!currentUser) return;
            try {
                const q = query(collection(db, 'barbershops'), where('ownerId', '==', currentUser.uid));
                const snap = await getDocs(q);
                if (!snap.empty) setBarbershopId(snap.docs[0].id);
            } catch (err) { console.error(err); }
        };
        fetchShopId();
    }, [currentUser]);

    const fetchClients = useCallback(async () => {
        if (!barbershopId) return;
        setLoading(true);
        try {
            // In a real scalability scenario, we wouldn't fetch ALL bookings.
            // But for a barbershop MVP, fetching recent bookings to aggregate clients is acceptable.
            // Ideally, we'd have a 'clients' subcollection or trigger.
            const q = query(collection(db, 'bookings'), where('barbershopId', '==', barbershopId));
            const snap = await getDocs(q);

            const uniqueClients = {};

            snap.docs.forEach(doc => {
                const data = doc.data();
                const clientKey = data.clientPhone || data.clientName; // Use phone as unique ID if available

                if (!uniqueClients[clientKey]) {
                    uniqueClients[clientKey] = {
                        name: data.clientName,
                        phone: data.clientPhone || 'N/A',
                        visits: 0,
                        lastVisit: null,
                        totalSpent: 0,
                        history: []
                    };
                }

                const client = uniqueClients[clientKey];
                client.visits += 1;
                client.totalSpent += parseFloat(data.servicePrice || 0);

                // Track last visit
                const bookingDate = new Date(`${data.date}T${data.time}`);
                if (!client.lastVisit || bookingDate > client.lastVisit) {
                    client.lastVisit = bookingDate;
                }
            });

            setClients(Object.values(uniqueClients));

        } catch (err) {
            console.error(err);
            setError('Failed to load clients.');
        } finally {
            setLoading(false);
        }
    }, [barbershopId]);

    useEffect(() => {
        if (barbershopId) fetchClients();
    }, [barbershopId, fetchClients]);

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
    );

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Clients Database</Typography>
                <Typography color="text.secondary">List of all customers who have booked with you.</Typography>
            </Box>

            <Paper sx={{ p: 3, mb: 3, borderRadius: '16px', bgcolor: 'background.paper' }}>
                <TextField
                    fullWidth
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                    }}
                    sx={{ mb: 0 }}
                />
            </Paper>

            {loading ? <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box> : (
                <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Contact</TableCell>
                                <TableCell align="center">Total Visits</TableCell>
                                <TableCell align="right">Total Spent</TableCell>
                                <TableCell>Last Visit</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredClients.map((client, index) => (
                                <TableRow key={index} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>{client.name[0]?.toUpperCase()}</Avatar>
                                            <Typography fontWeight="bold">{client.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {client.phone !== 'N/A' && (
                                            <Chip icon={<PhoneIcon sx={{ fontSize: 14 }} />} label={client.phone} size="small" variant="outlined" />
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip label={client.visits} color="secondary" size="small" />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography color="success.main" fontWeight="bold">${client.totalSpent.toFixed(2)}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        {client.lastVisit ? client.lastVisit.toLocaleDateString() : 'N/A'}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small"><MessageIcon /></IconButton>
                                        <IconButton size="small"><HistoryIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredClients.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">No clients found matching your search.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default OwnerClients;
