import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { campaignAPI } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import './Home.css';

const Home = () => {
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCampaigns();
  }, []);

  const fetchFeaturedCampaigns = async () => {
    try {
      const response = await campaignAPI.getAll({ status: 'active' });
      setFeaturedCampaigns(response.data.campaigns.slice(0, 3));
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Invest in Your Favorite Local Restaurants
            </h1>
            <p className="hero-subtitle">
              Support local food businesses and earn returns while helping your community thrive
            </p>
            <div className="hero-buttons">
              <Link to="/campaigns" className="btn btn-primary btn-lg">
                Browse Campaigns
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How DineFund Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Discover</h3>
              <p>Browse local restaurants seeking funding for growth and expansion</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Invest</h3>
              <p>Choose campaigns that align with your interests and investment goals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Grow Together</h3>
              <p>Earn returns as restaurants succeed and strengthen your community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="featured-campaigns">
        <div className="container">
          <h2 className="section-title">Featured Campaigns</h2>
          {loading ? (
            <div className="loading">Loading campaigns...</div>
          ) : featuredCampaigns.length > 0 ? (
            <div className="grid grid-3">
              {featuredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No active campaigns at the moment. Check back soon!</p>
            </div>
          )}
          {featuredCampaigns.length > 0 && (
            <div className="text-center mt-4">
              <Link to="/campaigns" className="btn btn-primary">
                View All Campaigns
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* For Restaurant Owners */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Are You a Restaurant Owner?</h2>
            <p>
              Get the funding you need to expand your business, renovate your space, 
              or launch new menu items. Join DineFund today!
            </p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Your Campaign
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
