import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, updatePassword, updateEmail } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ open: false, text: '', severity: 'success' });

  // Form State
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fetch additional user data (like phone) from Firestore
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.phone) setPhone(data.phone);
          // Sync display name if not set locally yet but exists in DB
          if (!currentUser.displayName && data.displayName) setDisplayName(data.displayName);
        }
      }
    };
    fetchData();
  }, [currentUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    let errorMsg = '';

    try {
      const updates = [];

      // 1. Update Authentication Profile (Name)
      if (displayName !== currentUser.displayName) {
        updates.push(updateProfile(currentUser, { displayName }));
      }

      // 2. Update Email (if changed)
      if (email !== currentUser.email) {
        updates.push(updateEmail(currentUser, email));
      }

      // 3. Update Password (if provided)
      if (password) {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        updates.push(updatePassword(currentUser, password));
      }

      // 4. Update Firestore (Phone + Mirror Auth Data)
      const userRef = doc(db, 'users', currentUser.uid);
      updates.push(setDoc(userRef, {
        displayName,
        phone,
        email,
        updatedAt: new Date()
      }, { merge: true }));

      await Promise.all(updates);
      setMessage({ open: true, text: 'Profile updated successfully!', severity: 'success' });
      setPassword('');
      setConfirmPassword('');

    } catch (error) {
      console.error(error);
      setMessage({ open: true, text: 'Failed to update profile: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mr: 3, fontSize: 32 }}>
            {displayName ? displayName[0].toUpperCase() : <PersonIcon />}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">{displayName || 'User Profile'}</Typography>
            <Typography color="text.secondary">Manage your personal information</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleUpdateProfile}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 000-0000"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                helperText="Changing email may require re-verification."
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LockIcon fontSize="small" /> Security
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="password"
                label="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Leave blank to keep current password"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={!password}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={!loading && <SaveIcon />}
              disabled={loading}
              sx={{ borderRadius: '10px', px: 4 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar open={message.open} autoHideDuration={6000} onClose={() => setMessage({ ...message, open: false })}>
        <Alert severity={message.severity} onClose={() => setMessage({ ...message, open: false })}>
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserProfile;
