import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { Box, Button, Typography, Container, Alert, CircularProgress, Paper, Divider } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

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

    const handleGenerateBarbershop = async () => {
        setLoading(true);
        setStatus('Creating Test Barbershop...');
        setError('');

        try {
            // 1. Sign in as Owner to link data correctly
            await signOut(auth);
            await signInWithEmailAndPassword(auth, 'owner2@sona.com', 'password123');
            const ownerId = auth.currentUser.uid;

            // 2. Barbershop Data
            const shopData = {
                ownerId: ownerId,
                name: "Sona Lounge Lisbon",
                city: "Lisbon",
                address: "Rua Augusta, 100",
                phone: "+351 912 345 678",
                description: "Experience the finest grooming in Lisbon. We combine traditional techniques with modern style to give you the perfect look. Our master barbers are dedicated to providing the best service.",
                imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop",
                approved: true,
                rating: 4.8,
                reviewCount: 15,
                minPrice: 20,
                maxPrice: 50,
                priceRange: "$20 - $50",
                createdAt: new Date(),
                settings: {
                    currency: 'EUR',
                    cancellationPolicy: '24h'
                },
                gallery: [
                    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1621609764180-2ca554a9d6f2?q=80&w=1974&auto=format&fit=crop"
                ]
            };

            const shopRef = await addDoc(collection(db, 'barbershops'), shopData);

            // 3. Add Services
            const servicesRef = collection(db, 'barbershops', shopRef.id, 'services');

            const services = [
                { name: "Classic Haircut", duration: "30", price: "20", description: "Traditional scissor cut." },
                { name: "Beard Trim", duration: "20", price: "15", description: "Shape up and trim." },
                { name: "Full Service", duration: "60", price: "50", description: "Haircut + Beard + Hot Towel." }
            ];

            for (const service of services) {
                await addDoc(servicesRef, service);
            }

            await signOut(auth); // Sign out after creation
            setStatus('Test Barbershop "Sona Lounge Lisbon" Created Successfully!');
            setLoading(false);

        } catch (err) {
            console.error(err);
            setError(`Error: ${err.message}`);
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 10 }}>
            <Paper sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom>Test Data Setup</Typography>
                <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                    Generate accounts and data to test the platform.
                </Typography>

                <Box sx={{ mb: 4, bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Test Accounts:</Typography>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                        <li><strong>Admin:</strong> admin2@sona.com (password123)</li>
                        <li><strong>Owner:</strong> owner2@sona.com (password123)</li>
                        <li><strong>Client:</strong> client2@sona.com (password123)</li>
                    </ul>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {status && !error && <Alert severity={loading ? "info" : "success"} sx={{ mb: 3 }}>{status}</Alert>}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                        variant="outlined"
                        fullWidth
                        size="large"
                        onClick={handleGenerateAccounts}
                        disabled={loading}
                        startIcon={<PersonAddIcon />}
                    >
                        {loading ? 'Processing...' : '1. Generate Test Accounts'}
                    </Button>

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleGenerateBarbershop}
                        disabled={loading}
                        startIcon={<StorefrontIcon />}
                    >
                        {loading ? 'Processing...' : '2. Generate Test Barbershop'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default TestDataSetup;
