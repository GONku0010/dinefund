import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout, isRestaurantOwner, isInvestor } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          🍽️ DineFund
        </Link>

        <div className="navbar-menu">
          <Link to="/campaigns" className="navbar-link">
            Browse Campaigns
          </Link>

          {isAuthenticated ? (
            <>
              {isRestaurantOwner() && (
                <Link to="/dashboard" className="navbar-link">
                  Dashboard
                </Link>
              )}
              {isInvestor() && (
                <Link to="/my-investments" className="navbar-link">
                  My Investments
                </Link>
              )}
              <div className="navbar-user">
                <span className="navbar-username">{user.full_name}</span>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
