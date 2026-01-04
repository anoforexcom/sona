
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
  Link,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      try {
        // Fetch user role to determine redirect
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const role = userDocSnap.data().role;

          if (role === 'admin') {
            navigate('/admin-dashboard');
          } else if (role === 'barbershop_owner') {
            navigate('/owner-dashboard');
          } else {
            navigate('/dashboard');
          }
        } else {
          // Document doesn't exist? Default to client dashboard
          console.warn("User document not found, defaulting to client dashboard.");
          navigate('/dashboard');
        }
      } catch (dbError) {
        // DB error? authenticate anyway to default dashboard
        console.error("Error fetching user role, defaulting to dashboard:", dbError);
        navigate('/dashboard');
      }
      setLoading(false); // Set loading to false after successful authentication and navigation
    } catch (err) {
      // Only show "Failed to log in" if the actual Auth failed (wrong password/email)
      setError('Failed to log in. Please check your email and password.');
      console.error('Error logging in:', err);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, #1a1a1e 0%, #0A0A0B 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 400,
          height: 400,
          bgcolor: 'primary.main',
          opacity: 0.05,
          filter: 'blur(100px)',
          borderRadius: '50%'
        }}
      />

      <Container maxWidth="xs" sx={{ zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: '32px',
            bgcolor: 'rgba(18, 18, 20, 0.6)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '14px',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)'
            }}
          >
            <LockOutlinedIcon sx={{ color: 'white' }} />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-1px' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            Sign in to your Sona account
          </Typography>

          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                sx: { borderRadius: '14px', bgcolor: 'rgba(255,255,255,0.02)' }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                sx: { borderRadius: '14px', bgcolor: 'rgba(255,255,255,0.02)' }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 4,
                mb: 3,
                height: 54,
                borderRadius: '14px',
                fontSize: '1rem',
                fontWeight: 700
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/signup" variant="body2" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Don't have an account? <span style={{ color: '#3B82F6', fontWeight: 600 }}>Sign up now</span>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
