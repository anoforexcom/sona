
import React, { useState, useEffect, useCallback } from 'react';
import { collection, collectionGroup, getDocs, doc, updateDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Alert
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { format } from 'date-fns';
import { Link } from 'react-router-dom'; // Import Link

const StatCard = ({ title, value, icon, color }) => (
    <Card elevation={3}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: color, mr: 2 }}>{icon}</Avatar>
                <Box>
                    <Typography variant="h5" component="div">{value}</Typography>
                    <Typography color="text.secondary">{title}</Typography>
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, barbershops: 0, bookings: 0 });
  const [pendingShops, setPendingShops] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch stats
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const barbershopsSnapshot = await getDocs(collection(db, 'barbershops'));
      const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
      setStats({ users: usersSnapshot.size, barbershops: barbershopsSnapshot.size, bookings: bookingsSnapshot.size });

      // Fetch pending barbershops
      const pendingQuery = query(collection(db, 'barbershops'), where('approved', '==', false));
      const pendingSnapshot = await getDocs(pendingQuery);
      setPendingShops(pendingSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

      // Fetch recent bookings
      const recentBookingsQuery = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(5));
      const recentBookingsSnapshot = await getDocs(recentBookingsQuery);
      setRecentBookings(recentBookingsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApproval = async (shopId, isApproved) => {
    try {
      const shopRef = doc(db, 'barbershops', shopId);
      await updateDoc(shopRef, { approved: isApproved });
      fetchData(); // Refresh data after action
    } catch (err) {
        console.error("Error updating barbershop status:", err);
        setError("Failed to update barbershop status.")
    }
  };

  if (loading) {
    return <Container sx={{ py: 5, textAlign: 'center' }}><CircularProgress /></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>Admin Dashboard</Typography>
            <Button component={Link} to="/admin/users" variant="contained">
                Manage Users
            </Button>
        </Box>
      {error && <Alert severity="error" sx={{mb:2}}>{error}</Alert>}
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Total Users" value={stats.users} icon={<PeopleIcon />} color="#2196f3"/></Grid>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Total Barbershops" value={stats.barbershops} icon={<StorefrontIcon />} color="#4caf50"/></Grid>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Total Bookings" value={stats.bookings} icon={<EventNoteIcon />} color="#ff9800"/></Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Pending Approvals */}
        <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{fontWeight: 'bold', mb: 2}}>Pending Approvals</Typography>
            <Paper elevation={2}>
                {pendingShops.length > 0 ? (
                    <List>
                        {pendingShops.map((shop, index) => (
                            <React.Fragment key={shop.id}>
                                <ListItem>
                                    <ListItemText primary={shop.name} secondary={shop.city} />
                                    <Button size="small" variant="outlined" sx={{mr:1}} onClick={() => handleApproval(shop.id, true)}>Approve</Button>
                                    <Button size="small" variant="outlined" color="error" onClick={() => handleApproval(shop.id, false)}>Reject</Button>
                                </ListItem>
                                {index < pendingShops.length -1 && <Divider/>}
                            </React.Fragment>
                        ))}
                    </List>
                ) : <Typography sx={{p:3, textAlign:'center'}}>No barbershops awaiting approval.</Typography>}
            </Paper>
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{fontWeight: 'bold', mb: 2}}>Recent Bookings</Typography>
            <Paper elevation={2}>
                 {recentBookings.length > 0 ? (
                    <List>
                        {recentBookings.map((booking, index) => (
                           <React.Fragment key={booking.id}>
                                <ListItem>
                                    <ListItemText primary={booking.barbershopName} secondary={`On ${format(booking.bookingDate.toDate(), 'PPP')}`} />
                                    <Typography variant="body2">{`$${booking.servicePrice}`}</Typography>
                                </ListItem>
                                {index < recentBookings.length -1 && <Divider/>}
                           </React.Fragment>
                        ))}
                    </List>
                ) : <Typography sx={{p:3, textAlign:'center'}}>No recent bookings.</Typography>}
            </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
