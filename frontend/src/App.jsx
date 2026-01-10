/**
 * ===========================================
 *            APP COMPONENT - Router Setup
 * ===========================================
 * 
 * Main application component with route definitions.
 * Includes public routes, auth pages, and admin panel.
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from "./components/Footer";

// ============================================
// PAGE IMPORTS
// ============================================
import Home from './pages/Home';
import Tests from './pages/Tests';
import Packages from './pages/Packages';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import TestDetail from './pages/TestDetail';
import PackageDetail from './pages/PackageDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import MyBookings from './pages/MyBookings';

// ============================================
// ADMIN IMPORTS
// ============================================
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTests from './pages/admin/AdminTests';
import AdminPackages from './pages/admin/AdminPackages';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOffers from './pages/admin/AdminOffers';
import AdminBanners from './pages/admin/AdminBanners';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';
import AdminHeroSettings from './pages/admin/AdminHeroSettings';

// ============================================
// APP COMPONENT
// ============================================

function App() {
  return (
    <Router>
      <Routes>
        {/* ================================ */}
        {/* PUBLIC ROUTES - With Navbar & Footer */}
        {/* ================================ */}
        <Route path="/" element={
          <div className="min-h-screen bg-[#FBFBFB] font-sans flex flex-col">
            <Navbar />
            <main className="flex-1"><Home /></main>
            <Footer />
          </div>
        } />
        <Route path="/tests" element={
          <div className="min-h-screen bg-[#FBFBFB] font-sans flex flex-col">
            <Navbar />
            <main className="flex-1"><Tests /></main>
            <Footer />
          </div>
        } />
        <Route path="/packages" element={
          <div className="min-h-screen bg-[#FBFBFB] font-sans flex flex-col">
            <Navbar />
            <main className="flex-1"><Packages /></main>
            <Footer />
          </div>
        } />
        <Route path="/about" element={
          <div className="min-h-screen bg-[#FBFBFB] font-sans flex flex-col">
            <Navbar />
            <main className="flex-1"><About /></main>
            <Footer />
          </div>
        } />
        <Route path="/contact" element={
          <div className="min-h-screen bg-[#FBFBFB] font-sans flex flex-col">
            <Navbar />
            <main className="flex-1"><Contact /></main>
            <Footer />
          </div>
        } />
        <Route path="/tests/:id" element={
          <div className="min-h-screen bg-[#FBFBFB] font-sans flex flex-col">
            <Navbar />
            <main className="flex-1"><TestDetail /></main>
            <Footer />
          </div>
        } />
        <Route path="/packages/:id" element={
          <div className="min-h-screen bg-[#FBFBFB] font-sans flex flex-col">
            <Navbar />
            <main className="flex-1"><PackageDetail /></main>
            <Footer />
          </div>
        } />
        <Route path="/cart" element={
          <div className="min-h-screen bg-[#FBFBFB] font-sans flex flex-col">
            <Navbar />
            <main className="flex-1"><Cart /></main>
            <Footer />
          </div>
        } />
        <Route path="/checkout" element={
          <div className="min-h-screen bg-[#FBFBFB] font-sans flex flex-col">
            <Navbar />
            <main className="flex-1"><Checkout /></main>
            <Footer />
          </div>
        } />
        <Route path="/order-success/:orderId" element={
          <div className="min-h-screen bg-[#FBFBFB] font-sans flex flex-col">
            <Navbar />
            <main className="flex-1"><OrderSuccess /></main>
            <Footer />
          </div>
        } />
        <Route path="/my-orders" element={
          <div className="min-h-screen bg-[#FBFBFB] font-sans flex flex-col">
            <Navbar />
            <main className="flex-1"><MyOrders /></main>
            <Footer />
          </div>
        } />
        <Route path="/bookings" element={
          <div className="min-h-screen bg-[#FBFBFB] font-sans flex flex-col">
            <Navbar />
            <main className="flex-1"><MyBookings /></main>
            <Footer />
          </div>
        } />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/profile" element={
          <div className="min-h-screen bg-[#FBFBFB] font-sans flex flex-col">
            <Navbar />
            <main className="flex-1"><Profile /></main>
            <Footer />
          </div>
        } />

        {/* ================================ */}
        {/* ADMIN ROUTES - With Admin Layout */}
        {/* ================================ */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="tests" element={<AdminTests />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="offers" element={<AdminOffers />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="hero-settings" element={<AdminHeroSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;