import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI, campaignAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantAPI.getMyRestaurants();
      setRestaurants(response.data.restaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Restaurant Owner Dashboard</h1>
          <Link to="/dashboard/create-restaurant" className="btn btn-primary">
            + Add Restaurant
          </Link>
        </div>

        {restaurants.length === 0 ? (
          <div className="empty-state card">
            <h2>Welcome to DineFund!</h2>
            <p>Get started by adding your restaurant and creating your first funding campaign.</p>
            <Link to="/dashboard/create-restaurant" className="btn btn-primary mt-3">
              Add Your Restaurant
            </Link>
          </div>
        ) : (
          <div className="restaurants-list">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="restaurant-card card">
                <div className="restaurant-header">
                  <div>
                    <h2>{restaurant.name}</h2>
                    <p className="restaurant-meta">
                      {restaurant.cuisine_type} • {restaurant.location}
                    </p>
                  </div>
                  <Link 
                    to={`/dashboard/create-campaign/${restaurant.id}`}
                    className="btn btn-primary"
                  >
                    + New Campaign
                  </Link>
                </div>

                <div className="restaurant-stats">
                  <div className="stat">
                    <span className="stat-value">{restaurant.campaign_count || 0}</span>
                    <span className="stat-label">Campaigns</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">
                      ${Number(restaurant.total_funding || 0).toLocaleString()}
                    </span>
                    <span className="stat-label">Total Raised</span>
                  </div>
                </div>

                <Link 
                  to={`/restaurants/${restaurant.id}`}
                  className="btn btn-outline btn-sm"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
