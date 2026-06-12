import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RootLayout from '../layouts/RootLayout';
import AdminLayout from '../layouts/AdminLayout';

// Customer Pages
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Wishlist from '../pages/Wishlist';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';

// Admin Pages
import AdminDashboard from '../pages/AdminDashboard';
import AdminProducts from '../pages/AdminProducts';
import AdminAddProduct from '../pages/AdminAddProduct';
import AdminEditProduct from '../pages/AdminEditProduct';
import AdminOrders from '../pages/AdminOrders';
import AdminUsers from '../pages/AdminUsers';

// Route guards
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <RouteSpinner />;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <RouteSpinner />;
  return user && user.role === 'admin' ? children : <Navigate to="/" replace />;
};

const RouteSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 dark:bg-slate-900 transition-colors">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-amazon-gold border-r-transparent border-solid"></div>
    <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm">Loading ShopSphere...</p>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Customer Routes */}
      <Route path="/" element={<RootLayout><Home /></RootLayout>} />
      <Route path="/products" element={<RootLayout><Products /></RootLayout>} />
      <Route path="/product/:id" element={<RootLayout><ProductDetails /></RootLayout>} />
      <Route path="/cart" element={<RootLayout><Cart /></RootLayout>} />
      <Route path="/wishlist" element={<RootLayout><Wishlist /></RootLayout>} />
      
      {/* Auth Gateways */}
      <Route path="/login" element={<RootLayout><Login /></RootLayout>} />
      <Route path="/register" element={<RootLayout><Register /></RootLayout>} />
      
      {/* Protected Customer Routes */}
      <Route path="/checkout" element={
        <ProtectedRoute>
          <RootLayout><Checkout /></RootLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <RootLayout><Profile /></RootLayout>
        </ProtectedRoute>
      } />

      {/* Protected Admin Console Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout><AdminDashboard /></AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/products" element={
        <AdminRoute>
          <AdminLayout><AdminProducts /></AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/add-product" element={
        <AdminRoute>
          <AdminLayout><AdminAddProduct /></AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/edit-product/:id" element={
        <AdminRoute>
          <AdminLayout><AdminEditProduct /></AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/orders" element={
        <AdminRoute>
          <AdminLayout><AdminOrders /></AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/users" element={
        <AdminRoute>
          <AdminLayout><AdminUsers /></AdminLayout>
        </AdminRoute>
      } />

      {/* Wildcard 404 redirection */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
