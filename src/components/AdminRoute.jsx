
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Container,
    CircularProgress,
    Box,
    Alert
} from '@mui/material';

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
        <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Container>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'admin') {
    return (
        <Container maxWidth="sm" sx={{py: 5}}>
            <Alert severity="error">
                You do not have permission to access this page.
            </Alert>
        </Container>
    );
  }

  return children;
};

export default AdminRoute;
