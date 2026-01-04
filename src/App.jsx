import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Removed BrowserRouter
import { AuthProvider } from './contexts/AuthContext.jsx';

// Core Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import BarbershopDetails from './pages/BarbershopDetails.jsx';
import UserProfile from './pages/UserProfile.jsx';

// Client Pages
import ClientLayout from './components/ClientLayout.jsx';
import ClientDashboard from './pages/ClientDashboard.jsx';
import ClientAppointments from './pages/ClientAppointments.jsx';
import ClientFavorites from './pages/ClientFavorites.jsx';
import ClientProfile from './pages/UserProfile.jsx';
import ClientReviews from './pages/ClientReviews.jsx';

// Dashboards & Features
import BarbershopOwnerDashboard from './pages/BarbershopOwnerDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import BarbershopProfile from './pages/BarbershopProfile.jsx';

// Admin Pages
import AdminFinancials from './pages/admin/AdminFinancials.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';
import AdminBookings from './pages/admin/AdminBookings.jsx';
import AdminPlatformInfo from './pages/admin/AdminPlatformInfo.jsx';
import AdminUsers from './pages/AdminUsers.jsx';

// Owner Pages
import OwnerAppointments from './pages/owner/OwnerAppointments.jsx';
import OwnerServices from './pages/owner/OwnerServices.jsx';
import OwnerStaff from './pages/owner/OwnerStaff.jsx';
import OwnerClients from './pages/owner/OwnerClients.jsx';
import OwnerFinancials from './pages/owner/OwnerFinancials.jsx';
import OwnerSettings from './pages/owner/OwnerSettings.jsx';

// Public Pages
import FAQ from './pages/FAQ.jsx';
import Pricing from './pages/Pricing.jsx';
import Testimonials from './pages/Testimonials.jsx';
import TermsOfService from './pages/TermsOfService.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import Contact from './pages/Contact.jsx';
import TestDataSetup from './pages/TestDataSetup.jsx';

// Components & Layouts
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import OwnerRoute from './components/OwnerRoute.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import OwnerLayout from './components/OwnerLayout.jsx';

// Contexts
import { BarbershopProvider } from './contexts/BarbershopContext.jsx';

import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/owner') ||
    location.pathname === '/admin-dashboard' ||
    location.pathname === '/owner-dashboard' ||
    location.pathname === '/dashboard' ||
    location.pathname.startsWith('/my-'); // Hide for all client dashboard routes

  return (
    <AuthProvider>
      {/* Removed BrowserRouter */}
      {!isDashboard && <Navbar />}
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
        <Route path="/contact" element={<Contact />} />
        <Route path="/test-setup" element={<TestDataSetup />} />

        {/* Client Routes with Layout */}
        <Route element={<PrivateRoute><ClientLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<ClientDashboard />} />
          <Route path="/my-appointments" element={<ClientAppointments />} />
          <Route path="/my-profile" element={<ClientProfile />} />
          <Route path="/my-favorites" element={<ClientFavorites />} />
          <Route path="/my-reviews" element={<ClientReviews />} />
        </Route>

        {/* Barbershop Owner Routes */}
        <Route element={<OwnerRoute><BarbershopProvider><OwnerLayout /></BarbershopProvider></OwnerRoute>}>
          <Route path="/owner-dashboard" element={<BarbershopOwnerDashboard />} />
          <Route path="/owner/appointments" element={<OwnerAppointments />} />
          <Route path="/owner/services" element={<OwnerServices />} />
          <Route path="/owner/staff" element={<OwnerStaff />} />
          <Route path="/owner/clients" element={<OwnerClients />} />
          <Route path="/owner/financials" element={<OwnerFinancials />} />
          <Route path="/owner/settings" element={<OwnerSettings />} />
        </Route>

        <Route path="/barbershop-profile" element={<OwnerRoute><BarbershopProfile /></OwnerRoute>} />

        {/* Admin Routes */}
        {/* Admin Routes with Layout */}
        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/financials" element={<AdminFinancials />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/platform" element={<AdminPlatformInfo />} />
        </Route>

      </Routes>
      {!isDashboard && <Footer />} {/* Render Footer only on non-dashboard pages */}
      {/* Removed BrowserRouter */}
    </AuthProvider>
  );
}

export default App;