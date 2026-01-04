
import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { format } from 'date-fns';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setSelectedRole('');
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !selectedRole) return;

    const setUserRole = httpsCallable(functions, 'setUserRole');
    try {
      const result = await setUserRole({ uid: selectedUser.id, role: selectedRole });
      if (result.data.error) {
        throw new Error(result.data.error)
      }
      setNotification({ open: true, message: `User role updated successfully!`, severity: 'success' });
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error("Error updating user role:", err);
      setNotification({ open: true, message: `Error: ${err.message}`, severity: 'error' });
    } finally {
      handleCloseDialog();
    }
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  if (loading) {
    return <Container sx={{ py: 5, textAlign: 'center' }}><CircularProgress /></Container>;
  }

  return (
    <Box sx={{ minHeight: '90vh', bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-1px', mb: 6 }}>
          <span style={{ color: '#F59E0B' }}>User</span> Management
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 4, borderRadius: '16px' }}>{error}</Alert>}

        <Paper sx={{
          borderRadius: '24px',
          bgcolor: 'rgba(18, 18, 20, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'hidden'
        }}>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                  <TableCell sx={{ fontWeight: 800, color: 'text.secondary', p: 3 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: 'text.secondary', p: 3 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: 'text.secondary', p: 3 }}>Member Since</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: 'text.secondary', p: 3, textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.01)' } }}>
                    <TableCell sx={{ p: 3, fontWeight: 600 }}>{user.email}</TableCell>
                    <TableCell sx={{ p: 3 }}>
                      <Box sx={{
                        display: 'inline-block',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '8px',
                        bgcolor: user.role === 'admin' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.05)',
                        color: user.role === 'admin' ? '#F59E0B' : 'text.primary',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                      }}>
                        {user.role}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ p: 3, color: 'text.secondary' }}>
                      {user.createdAt && user.createdAt.toDate ? format(user.createdAt.toDate(), 'PPP') : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ p: 3, textAlign: 'right' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenDialog(user)}
                        sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                      >
                        Change Role
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Role Management Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          PaperProps={{
            sx: {
              borderRadius: '24px',
              bgcolor: '#121214',
              backgroundImage: 'none',
              p: 2
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 800 }}>Change role for {selectedUser?.email}</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Select the new access level for this user.
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                value={selectedRole}
                label="Role"
                onChange={(e) => setSelectedRole(e.target.value)}
                sx={{ borderRadius: '12px' }}
              >
                <MenuItem value="client">Client</MenuItem>
                <MenuItem value="barbershop_owner">Barbershop Owner</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button onClick={handleCloseDialog} sx={{ color: 'text.secondary' }}>Cancel</Button>
            <Button onClick={handleRoleChange} variant="contained" sx={{ borderRadius: '10px', px: 3 }}>Confirm</Button>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%', borderRadius: '12px' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AdminUsers;
