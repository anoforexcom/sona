import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    CircularProgress
} from '@mui/material';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { format } from 'date-fns';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setBookings(data);
                setFilteredBookings(data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    useEffect(() => {
        let result = bookings;

        // Filter by Status
        if (statusFilter !== 'all') {
            result = result.filter(b => (b.status || 'confirmed') === statusFilter);
        }

        // Filter by Search (Shop Name or Client Name placeholder)
        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(b =>
                (b.barbershopName && b.barbershopName.toLowerCase().includes(lowerSearch)) ||
                (b.serviceName && b.serviceName.toLowerCase().includes(lowerSearch))
            );
        }

        setFilteredBookings(result);
    }, [statusFilter, search, bookings]);

    if (loading) return <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box>;

    return (
        <Box sx={{ pb: 8 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }}>Global Bookings</Typography>

            <Paper sx={{ p: 3, mb: 4, borderRadius: '20px' }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        label="Search Barbershop or Service"
                        variant="outlined"
                        size="small"
                        sx={{ flexGrow: 1 }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Status"
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="all">All Statuses</MenuItem>
                            <MenuItem value="confirmed">Confirmed</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Paper>

            <Paper sx={{ borderRadius: '24px', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                                <TableCell>ID / Date</TableCell>
                                <TableCell>Service</TableCell>
                                <TableCell>Barbershop</TableCell>
                                <TableCell>Client</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="center">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredBookings.map((booking) => (
                                <TableRow key={booking.id} hover>
                                    <TableCell>
                                        <Typography variant="caption" display="block" color="text.secondary">{booking.id.substring(0, 6)}...</Typography>
                                        <Typography variant="body2">
                                            {booking.bookingDate?.toDate ? format(booking.bookingDate.toDate(), 'PPP p') : 'Invalid Date'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{booking.serviceName}</TableCell>
                                    <TableCell>{booking.barbershopName}</TableCell>
                                    <TableCell>{booking.clientId ? `Client (${booking.clientId.substring(0, 4)}...)` : 'Guest'}</TableCell>
                                    <TableCell align="right">${booking.servicePrice}</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={booking.status || 'confirmed'}
                                            size="small"
                                            color={booking.status === 'cancelled' ? 'error' : 'success'}
                                            sx={{ textTransform: 'capitalize' }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredBookings.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                        No bookings found matching your filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default AdminBookings;
