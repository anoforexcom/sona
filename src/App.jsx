import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Removed BrowserRouter
import { AuthProvider } from './contexts/AuthContext.jsx';

// Core Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import BarbershopDetails from './pages/BarbershopDetails.jsx';
import UserProfile from './pages/UserProfile.jsx';

// Dashboards
import ClientDashboard from './pages/ClientDashboard.jsx';
import BarbershopOwnerDashboard from './pages/BarbershopOwnerDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

// Feature Pages
import BarbershopProfile from './pages/BarbershopProfile.jsx';
import ClientAppointments from './pages/ClientAppointments.jsx';
import AdminUsers from './pages/AdminUsers.jsx';

// New Public Pages
import FAQ from './pages/FAQ.jsx';
import Pricing from './pages/Pricing.jsx';
import Testimonials from './pages/Testimonials.jsx';
import TermsOfService from './pages/TermsOfService.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';

// Route Protection
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx'; // Import Footer
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import OwnerRoute from './components/OwnerRoute.jsx';

function App() {
  return (
    <AuthProvider>
      {/* Removed BrowserRouter */}
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/barbershop/:barbershopId" element={<BarbershopDetails />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/reviews" element={<Testimonials />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Generic Private Routes (for all authenticated users) */}
        <Route path="/my-profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />

        {/* Client-Specific Routes */}
        <Route path="/dashboard" element={<PrivateRoute><ClientDashboard /></PrivateRoute>} />
        <Route path="/my-appointments" element={<PrivateRoute><ClientAppointments /></PrivateRoute>} />

        {/* Barbershop Owner Routes */}
        <Route path="/owner-dashboard" element={<OwnerRoute><BarbershopOwnerDashboard /></OwnerRoute>} />
        <Route path="/barbershop-profile" element={<OwnerRoute><BarbershopProfile /></OwnerRoute>} />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

      </Routes>
      <Footer /> {/* Render Footer */}
      {/* Removed BrowserRouter */}
    </AuthProvider>
  );
}

export default App;