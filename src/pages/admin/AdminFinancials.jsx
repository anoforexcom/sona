import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    LinearProgress,
    Avatar,
    Divider
} from '@mui/material';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { format } from 'date-fns';

const AdminFinancials = () => {
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        platformFees: 0,
        pendingPayouts: 0,
        monthlyGrowth: 15 // Dummy data for growth
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch recent bookings as "transactions"
                const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(10));
                const querySnapshot = await getDocs(q);

                let totalRev = 0;
                const txs = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const price = parseFloat(data.servicePrice || 0);
                    totalRev += price;
                    txs.push({ id: doc.id, ...data, price });
                });

                setTransactions(txs);
                setStats(prev => ({
                    ...prev,
                    totalRevenue: totalRev,
                    platformFees: totalRev * 0.10, // Assuming 10% fee
                    pendingPayouts: totalRev * 0.90
                }));

            } catch (error) {
                console.error("Error fetching financials:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const StatCard = ({ title, value, subtext, icon, color, bg }) => (
        <Card sx={{ height: '100%', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: bg, color: color }}>
                        {icon}
                    </Box>
                    {subtext && <Chip label={subtext} size="small" color="success" sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }} />}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>${value.toLocaleString()}</Typography>
                <Typography variant="body2" color="text.secondary">{title}</Typography>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ pb: 8 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }}>Financial Overview</Typography>

            {/* Metrics Row */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="Total Revenue Volume"
                        value={stats.totalRevenue}
                        subtext="+15% vs last month"
                        icon={<AttachMoneyIcon />}
                        color="#10B981"
                        bg="rgba(16, 185, 129, 0.1)"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="Platform Fees Collected"
                        value={stats.platformFees}
                        icon={<TrendingUpIcon />}
                        color="#3B82F6"
                        bg="rgba(59, 130, 246, 0.1)"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="Pending Payouts to Owners"
                        value={stats.pendingPayouts}
                        icon={<AccountBalanceWalletIcon />}
                        color="#F59E0B"
                        bg="rgba(245, 158, 11, 0.1)"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={4}>
                {/* Revenue Breakdown (Simulated Chart) */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 4, borderRadius: '24px', height: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 4 }}>Revenue by Category</Typography>

                        {[
                            { label: "Haircuts", value: 70, color: "#3B82F6" },
                            { label: "Beard Trims", value: 20, color: "#EC4899" },
                            { label: "Products", value: 10, color: "#F59E0B" }
                        ].map((item) => (
                            <Box key={item.label} sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">{item.label}</Typography>
                                    <Typography variant="body2" fontWeight="bold">{item.value}%</Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={item.value}
                                    sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: item.color } }}
                                />
                            </Box>
                        ))}

                        <Divider sx={{ my: 3 }} />
                        <Typography variant="caption" color="text.secondary">
                            Based on recent booking data categories.
                        </Typography>
                    </Paper>
                </Grid>

                {/* Recent Transactions */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 0, borderRadius: '24px', overflow: 'hidden' }}>
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Recent Transactions</Typography>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Service</TableCell>
                                        <TableCell>Barbershop</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell align="center">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactions.map((tx) => (
                                        <TableRow key={tx.id} hover>
                                            <TableCell sx={{ color: 'text.secondary' }}>
                                                {tx.createdAt?.toDate ? format(tx.createdAt.toDate(), 'MMM dd, HH:mm') : 'N/A'}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 500 }}>{tx.serviceName || 'Service'}</TableCell>
                                            <TableCell>{tx.barbershopName || 'Unknown Shop'}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>${tx.price}</TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={tx.status || 'Completed'}
                                                    size="small"
                                                    color={tx.status === 'cancelled' ? 'error' : 'success'}
                                                    sx={{ borderRadius: '6px' }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {transactions.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                                No transactions found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminFinancials;
