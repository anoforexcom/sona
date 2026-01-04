import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import {
    Container,
    Typography,
    Box,
    Paper,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const OwnerFinancials = () => {
    const { currentUser } = useAuth();
    const [barbershopId, setBarbershopId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        monthlyRevenue: 0,
        todayRevenue: 0,
        pendingPayout: 0
    });
    const [transactions, setTransactions] = useState([]);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchShop = async () => {
            if (!currentUser) return;
            try {
                const q = query(collection(db, 'barbershops'), where('ownerId', '==', currentUser.uid));
                const snap = await getDocs(q);
                if (!snap.empty) setBarbershopId(snap.docs[0].id);
            } catch (error) { console.error(error); }
        };
        fetchShop();
    }, [currentUser]);

    const fetchData = useCallback(async () => {
        if (!barbershopId) return;
        setLoading(true);
        try {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const todayStr = now.toISOString().split('T')[0];

            // Fetch completed bookings
            // In a real app, use backend aggregation. Here we sum locally.
            const q = query(collection(db, 'bookings'), where('barbershopId', '==', barbershopId));
            const snap = await getDocs(q);

            let total = 0;
            let monthly = 0;
            let today = 0;
            const dailyData = {};
            const recentTx = [];

            snap.docs.forEach(doc => {
                const data = doc.data();
                const price = parseFloat(data.servicePrice || 0);
                const date = new Date(`${data.date}T${data.time}`);
                const dayKey = data.date.substring(5); // MM-DD

                total += price;

                if (date >= startOfMonth) {
                    monthly += price;
                }
                if (data.date === todayStr) {
                    today += price;
                }

                // Chart Data Aggregation
                if (!dailyData[dayKey]) dailyData[dayKey] = 0;
                dailyData[dayKey] += price;

                recentTx.push({ id: doc.id, ...data, amount: price, dateObj: date });
            });

            // Sort transactions desc
            recentTx.sort((a, b) => b.dateObj - a.dateObj);
            setTransactions(recentTx.slice(0, 10)); // Top 10

            // Format Chart Data
            const chart = Object.keys(dailyData).sort().map(key => ({
                name: key,
                amount: dailyData[key]
            })).slice(-7); // Last 7 active days

            setStats({
                totalRevenue: total,
                monthlyRevenue: monthly,
                todayRevenue: today,
                pendingPayout: total // Simplified for demo
            });
            setChartData(chart);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [barbershopId]);

    useEffect(() => {
        if (barbershopId) fetchData();
    }, [barbershopId, fetchData]);

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Financial Overview</Typography>
                <Typography color="text.secondary">Track your earnings and transactions.</Typography>
            </Box>

            {loading ? <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box> : (
                <Grid container spacing={4}>
                    {/* KPI Cards */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ borderRadius: 4, height: '100%', bgcolor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}><AttachMoneyIcon /></Avatar>
                                    <Typography variant="h6" fontWeight="bold">Total Revenue</Typography>
                                </Box>
                                <Typography variant="h3" fontWeight="800" sx={{ color: 'success.main' }}>
                                    ${stats.totalRevenue.toLocaleString()}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>All time earnings</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ borderRadius: 4, height: '100%', bgcolor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}><TrendingUpIcon /></Avatar>
                                    <Typography variant="h6" fontWeight="bold">This Month</Typography>
                                </Box>
                                <Typography variant="h3" fontWeight="800" sx={{ color: 'primary.main' }}>
                                    ${stats.monthlyRevenue.toLocaleString()}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>Current period performance</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ borderRadius: 4, height: '100%', bgcolor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}><AccountBalanceWalletIcon /></Avatar>
                                    <Typography variant="h6" fontWeight="bold">Today</Typography>
                                </Box>
                                <Typography variant="h3" fontWeight="800" sx={{ color: 'warning.main' }}>
                                    ${stats.todayRevenue.toLocaleString()}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>Daily earnings</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Chart */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3, borderRadius: 4, height: 400 }}>
                            <Typography variant="h6" gutterBottom fontWeight="bold">Revenue Trend (Last 7 Active Days)</Typography>
                            <ResponsiveContainer width="100%" height="90%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                                    <YAxis stroke="rgba(255,255,255,0.5)" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                                        itemStyle={{ color: '#10B981' }}
                                    />
                                    <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Recent Transactions */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 0, borderRadius: 4, height: 400, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <Typography variant="h6" fontWeight="bold">Recent Transactions</Typography>
                            </Box>
                            <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                                {transactions.map((tx) => (
                                    <ListItem key={tx.id} divider>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: 'background.default', color: 'text.secondary', fontSize: 14 }}>
                                                {tx.serviceName[0]}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={tx.clientName}
                                            secondary={`${tx.serviceName} • ${tx.date}`}
                                            primaryTypographyProps={{ fontWeight: 600 }}
                                        />
                                        <Typography color="success.main" fontWeight="bold">
                                            +${tx.amount.toFixed(0)}
                                        </Typography>
                                    </ListItem>
                                ))}
                                {transactions.length === 0 && (
                                    <ListItem>
                                        <ListItemText primary="No transactions yet" />
                                    </ListItem>
                                )}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default OwnerFinancials;
