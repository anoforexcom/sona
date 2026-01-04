import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Box, Button, Typography, Container, Alert, CircularProgress, Paper } from '@mui/material';

const TestDataSetup = () => {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const createAccount = async (email, password, role, name) => {
        let user;
        try {
            // 1. Try to Create User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            user = userCredential.user;
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                // 2. If exists, Sign In to update data
                console.warn(`${email} already exists. Signing in to update...`);
                try {
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    user = userCredential.user;
                } catch (loginErr) {
                    throw new Error(`Could not create or login to ${email}: ${loginErr.message}`);
                }
            } else {
                throw err;
            }
        }

        // 3. Create/Update User Doc in Firestore
        if (user) {
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                role: role,
                name: name,
                updatedAt: new Date().toISOString()
            }, { merge: true });
        }

        return true;
    };

    const handleGenerateAccounts = async () => {
        setLoading(true);
        setStatus('Starting...');
        setError('');

        try {
            // Ensure clean slate by signing out first
            await signOut(auth);

            // 1. Create Admin
            setStatus('Creating Admin account (admin2@sona.com)...');
            await createAccount('admin2@sona.com', 'password123', 'admin', 'Test Admin V2');
            await signOut(auth); // Sign out specifically to allow next creation

            // 2. Create Owner
            setStatus('Creating Owner account (owner2@sona.com)...');
            await createAccount('owner2@sona.com', 'password123', 'barbershop_owner', 'Test Owner V2');
            await signOut(auth);

            // 3. Create Client
            setStatus('Creating Client account (client2@sona.com)...');
            await createAccount('client2@sona.com', 'password123', 'client', 'Test Client V2');
            await signOut(auth);

            setStatus('All test accounts (V2) created successfully! You can now log in.');
            setLoading(false);

        } catch (err) {
            console.error(err);
            setError(`Error: ${err.message}`);
            setLoading(false);
            setStatus('');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 10 }}>
            <Paper sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom>Test Data Setup</Typography>
                <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                    Click the button below to generate NEW standard test accounts (V2).
                </Typography>

                <Box sx={{ mb: 4, bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>New Accounts to be created:</Typography>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                        <li><strong>Admin:</strong> admin2@sona.com (password123)</li>
                        <li><strong>Owner:</strong> owner2@sona.com (password123)</li>
                        <li><strong>Client:</strong> client2@sona.com (password123)</li>
                    </ul>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {status && !error && <Alert severity={loading ? "info" : "success"} sx={{ mb: 3 }}>{status}</Alert>}

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleGenerateAccounts}
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                    {loading ? 'Generating...' : 'Generate Test Accounts'}
                </Button>
            </Paper>
        </Container>
    );
};

export default TestDataSetup;
