import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import Dashboard from './pages/Dashboard';
import CreateRestaurant from './pages/CreateRestaurant';
import CreateCampaign from './pages/CreateCampaign';
import MyInvestments from './pages/MyInvestments';

// Protected Route Component
const ProtectedRoute = ({ children, requireRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:id" element={<CampaignDetail />} />
            
            {/* Restaurant Owner Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requireRole="restaurant_owner">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/create-restaurant"
              element={
                <ProtectedRoute requireRole="restaurant_owner">
                  <CreateRestaurant />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/create-campaign/:restaurantId"
              element={
                <ProtectedRoute requireRole="restaurant_owner">
                  <CreateCampaign />
                </ProtectedRoute>
              }
            />

            {/* Investor Routes */}
            <Route
              path="/my-investments"
              element={
                <ProtectedRoute requireRole="investor">
                  <MyInvestments />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
