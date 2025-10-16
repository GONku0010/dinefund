import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { investmentAPI } from '../services/api';
import './MyInvestments.css';

const MyInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await investmentAPI.getMyInvestments();
      setInvestments(response.data.investments);
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your investments...</div>;
  }

  return (
    <div className="my-investments-page">
      <div className="container">
        <h1>My Investments</h1>

        {summary && (
          <div className="summary-cards">
            <div className="summary-card card">
              <div className="summary-icon">💰</div>
              <div className="summary-content">
                <span className="summary-value">
                  ${Number(summary.total_invested).toLocaleString()}
                </span>
                <span className="summary-label">Total Invested</span>
              </div>
            </div>

            <div className="summary-card card">
              <div className="summary-icon">📊</div>
              <div className="summary-content">
                <span className="summary-value">{summary.total_investments}</span>
                <span className="summary-label">Total Investments</span>
              </div>
            </div>

            <div className="summary-card card">
              <div className="summary-icon">📈</div>
              <div className="summary-content">
                <span className="summary-value">
                  ${Number(summary.potential_returns).toLocaleString()}
                </span>
                <span className="summary-label">Potential Returns</span>
              </div>
            </div>
          </div>
        )}

        {investments.length === 0 ? (
          <div className="empty-state card">
            <h2>No Investments Yet</h2>
            <p>Start investing in local restaurants to see your portfolio here.</p>
            <Link to="/campaigns" className="btn btn-primary mt-3">
              Browse Campaigns
            </Link>
          </div>
        ) : (
          <div className="investments-list">
            <h2>Investment History</h2>
            {investments.map((investment) => (
              <div key={investment.id} className="investment-card card">
                <div className="investment-header">
                  <div className="investment-info">
                    <h3>{investment.campaign_title}</h3>
                    <p className="restaurant-name">
                      📍 {investment.restaurant_name} • {investment.cuisine_type}
                    </p>
                    <p className="location">{investment.location}</p>
                  </div>
                  {investment.restaurant_image && (
                    <div className="investment-image">
                      <img src={investment.restaurant_image} alt={investment.restaurant_name} />
                    </div>
                  )}
                </div>

                <div className="investment-details">
                  <div className="detail-row">
                    <span className="detail-label">Investment Amount:</span>
                    <span className="detail-value">
                      ${Number(investment.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Interest Rate:</span>
                    <span className="detail-value">{investment.interest_rate}%</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{investment.duration_months} months</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Expected Return:</span>
                    <span className="detail-value highlight">
                      ${(Number(investment.amount) * (1 + investment.interest_rate / 100)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Investment Date:</span>
                    <span className="detail-value">
                      {new Date(investment.investment_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Campaign Status:</span>
                    <span className={`badge ${
                      investment.campaign_status === 'funded' ? 'badge-success' :
                      investment.campaign_status === 'active' ? 'badge-info' :
                      'badge-warning'
                    }`}>
                      {investment.campaign_status}
                    </span>
                  </div>
                </div>

                <div className="investment-footer">
                  <Link 
                    to={`/campaigns/${investment.campaign_id}`}
                    className="btn btn-outline btn-sm"
                  >
                    View Campaign
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInvestments;
