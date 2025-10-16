import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignAPI, investmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './CampaignDetail.css';

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isInvestor } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investing, setInvesting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const response = await campaignAPI.getById(id);
      setCampaign(response.data.campaign);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      setMessage({ type: 'error', text: 'Failed to load campaign details' });
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (!isInvestor()) {
      setMessage({ type: 'error', text: 'Only investors can make investments' });
      return;
    }

    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    const remaining = parseFloat(campaign.funding_goal) - parseFloat(campaign.current_funding);
    if (amount > remaining) {
      setMessage({ type: 'error', text: `Maximum investment amount is $${remaining.toLocaleString()}` });
      return;
    }

    setInvesting(true);
    setMessage({ type: '', text: '' });

    try {
      await investmentAPI.create({
        campaign_id: id,
        amount: amount,
      });

      setMessage({ type: 'success', text: 'Investment successful! Thank you for your support.' });
      setInvestmentAmount('');
      
      // Refresh campaign data
      setTimeout(() => {
        fetchCampaign();
      }, 1000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to process investment',
      });
    } finally {
      setInvesting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading campaign details...</div>;
  }

  if (!campaign) {
    return (
      <div className="container" style={{ padding: '40px 0' }}>
        <div className="card text-center">
          <h2>Campaign not found</h2>
          <button onClick={() => navigate('/campaigns')} className="btn btn-primary mt-3">
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  const fundingPercentage = Math.min(
    ((campaign.current_funding / campaign.funding_goal) * 100).toFixed(1),
    100
  );

  const remainingAmount = Math.max(
    parseFloat(campaign.funding_goal) - parseFloat(campaign.current_funding),
    0
  );

  return (
    <div className="campaign-detail-page">
      <div className="container">
        <button onClick={() => navigate('/campaigns')} className="back-button">
          ← Back to Campaigns
        </button>

        <div className="campaign-detail-grid">
          {/* Main Content */}
          <div className="campaign-main">
            {campaign.restaurant_image && (
              <div className="campaign-detail-image">
                <img src={campaign.restaurant_image} alt={campaign.restaurant_name} />
              </div>
            )}

            <div className="card">
              <h1 className="campaign-detail-title">{campaign.title}</h1>
              
              <div className="restaurant-info">
                <h2>📍 {campaign.restaurant_name}</h2>
                <p className="cuisine-location">
                  {campaign.cuisine_type} • {campaign.location}
                </p>
                {campaign.address && <p className="address">{campaign.address}</p>}
              </div>

              <div className="campaign-description">
                <h3>About This Campaign</h3>
                <p>{campaign.description}</p>
              </div>

              {campaign.restaurant_description && (
                <div className="restaurant-description">
                  <h3>About the Restaurant</h3>
                  <p>{campaign.restaurant_description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="campaign-sidebar">
            <div className="card investment-card">
              <div className="funding-stats">
                <div className="stat-large">
                  <span className="stat-value">${Number(campaign.current_funding).toLocaleString()}</span>
                  <span className="stat-label">raised of ${Number(campaign.funding_goal).toLocaleString()}</span>
                </div>

                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${fundingPercentage}%` }}
                  ></div>
                </div>
                <p className="progress-text">{fundingPercentage}% funded</p>

                <div className="stats-row">
                  <div className="stat">
                    <span className="stat-value">{campaign.investor_count || 0}</span>
                    <span className="stat-label">Investors</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{campaign.interest_rate}%</span>
                    <span className="stat-label">Interest Rate</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{campaign.duration_months}</span>
                    <span className="stat-label">Months</span>
                  </div>
                </div>
              </div>

              {campaign.status === 'active' && remainingAmount > 0 ? (
                <>
                  <div className="remaining-amount">
                    <strong>${remainingAmount.toLocaleString()}</strong> remaining
                  </div>

                  <form onSubmit={handleInvest} className="investment-form">
                    <div className="form-group">
                      <label htmlFor="amount">Investment Amount ($)</label>
                      <input
                        type="number"
                        id="amount"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="1"
                        max={remainingAmount}
                        step="0.01"
                        required
                      />
                    </div>

                    {message.text && (
                      <div className={`message ${message.type}`}>
                        {message.text}
                      </div>
                    )}

                    <button 
                      type="submit" 
                      className="btn btn-primary btn-block"
                      disabled={investing}
                    >
                      {investing ? 'Processing...' : 'Invest Now'}
                    </button>
                  </form>

                  {investmentAmount && !isNaN(parseFloat(investmentAmount)) && (
                    <div className="investment-preview">
                      <p className="preview-title">Estimated Returns</p>
                      <p className="preview-amount">
                        ${(parseFloat(investmentAmount) * (1 + campaign.interest_rate / 100)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="preview-note">
                        After {campaign.duration_months} months
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="campaign-closed">
                  <span className={`badge ${campaign.status === 'funded' ? 'badge-success' : 'badge-warning'}`}>
                    {campaign.status === 'funded' ? 'Fully Funded' : 'Campaign Closed'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
