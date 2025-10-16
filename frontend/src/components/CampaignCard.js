import React from 'react';
import { Link } from 'react-router-dom';
import './CampaignCard.css';

const CampaignCard = ({ campaign }) => {
  const fundingPercentage = Math.min(
    ((campaign.current_funding / campaign.funding_goal) * 100).toFixed(1),
    100
  );

  const getStatusBadge = (status) => {
    const badges = {
      active: { class: 'badge-info', text: 'Active' },
      funded: { class: 'badge-success', text: 'Funded' },
      closed: { class: 'badge-warning', text: 'Closed' },
    };
    return badges[status] || badges.active;
  };

  const statusBadge = getStatusBadge(campaign.status);

  return (
    <div className="campaign-card card">
      {campaign.restaurant_image && (
        <div className="campaign-image">
          <img src={campaign.restaurant_image} alt={campaign.restaurant_name} />
        </div>
      )}
      
      <div className="campaign-content">
        <div className="campaign-header">
          <h3 className="campaign-title">{campaign.title}</h3>
          <span className={`badge ${statusBadge.class}`}>{statusBadge.text}</span>
        </div>

        <p className="campaign-restaurant">
          📍 {campaign.restaurant_name} • {campaign.cuisine_type}
        </p>
        <p className="campaign-location">{campaign.location}</p>

        <div className="campaign-stats">
          <div className="stat">
            <span className="stat-label">Goal</span>
            <span className="stat-value">${Number(campaign.funding_goal).toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Raised</span>
            <span className="stat-value">${Number(campaign.current_funding).toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Interest</span>
            <span className="stat-value">{campaign.interest_rate}%</span>
          </div>
        </div>

        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${fundingPercentage}%` }}
          ></div>
        </div>
        <p className="progress-text">{fundingPercentage}% funded</p>

        <div className="campaign-footer">
          <span className="investor-count">👥 {campaign.investor_count || 0} investors</span>
          <Link to={`/campaigns/${campaign.id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
