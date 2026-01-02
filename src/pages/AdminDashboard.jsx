
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
    <Box sx={{ minHeight: '90vh', bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-1px', mb: 1 }}>
              <span style={{ color: '#F59E0B' }}>Admin</span> Panel
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              System overview and approvals.
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/admin/users"
            variant="contained"
            sx={{
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              boxShadow: '0 8px 16px rgba(245, 158, 11, 0.2)',
              bgcolor: '#F59E0B',
              '&:hover': { bgcolor: '#D97706' }
            }}
          >
            Manage Users
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 4, borderRadius: '16px' }}>{error}</Alert>}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            { title: "Total Users", value: stats.users, icon: <PeopleIcon />, color: '#3B82F6', secondary: 'rgba(59, 130, 246, 0.1)' },
            { title: "Barbershops", value: stats.barbershops, icon: <StorefrontIcon />, color: '#10B981', secondary: 'rgba(16, 185, 129, 0.1)' },
            { title: "Bookings", value: stats.bookings, icon: <EventNoteIcon />, color: '#F59E0B', secondary: 'rgba(245, 158, 11, 0.1)' }
          ].map((stat, i) => (
            <Grid item key={i} xs={12} sm={6} md={4}>
              <Paper sx={{
                p: 3,
                borderRadius: '24px',
                bgcolor: 'rgba(18, 18, 20, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 3
              }}>
                <Box sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  bgcolor: stat.secondary,
                  color: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {React.cloneElement(stat.icon, { sx: { fontSize: 32 } })}
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{stat.value}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>{stat.title}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          {/* Pending Approvals */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Pending Approvals</Typography>
            <Paper sx={{
              borderRadius: '24px',
              bgcolor: 'rgba(18, 18, 20, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              overflow: 'hidden'
            }}>
              {pendingShops.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {pendingShops.map((shop, index) => (
                    <React.Fragment key={shop.id}>
                      <ListItem sx={{ p: 3, gap: 2 }}>
                        <ListItemText
                          primary={<Typography sx={{ fontWeight: 700 }}>{shop.name}</Typography>}
                          secondary={shop.city}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="contained" sx={{ borderRadius: '8px', bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }} onClick={() => handleApproval(shop.id, true)}>Approve</Button>
                          <Button size="small" variant="outlined" color="error" sx={{ borderRadius: '8px' }} onClick={() => handleApproval(shop.id, false)}>Reject</Button>
                        </Box>
                      </ListItem>
                      {index < pendingShops.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <Typography sx={{ color: 'text.secondary' }}>No barbershops awaiting approval.</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Recent Bookings */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Recent Bookings</Typography>
            <Paper sx={{
              borderRadius: '24px',
              bgcolor: 'rgba(18, 18, 20, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              overflow: 'hidden'
            }}>
              {recentBookings.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {recentBookings.map((booking, index) => (
                    <React.Fragment key={booking.id}>
                      <ListItem sx={{ p: 3 }}>
                        <ListItemText
                          primary={<Typography sx={{ fontWeight: 700 }}>{booking.barbershopName}</Typography>}
                          secondary={`On ${format(booking.bookingDate.toDate(), 'PPP')}`}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#3B82F6' }}>
                          {`$${booking.servicePrice}`}
                        </Typography>
                      </ListItem>
                      {index < recentBookings.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <Typography sx={{ color: 'text.secondary' }}>No recent bookings.</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
