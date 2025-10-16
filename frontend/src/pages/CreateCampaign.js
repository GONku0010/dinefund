import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { campaignAPI } from '../services/api';
import './CreateRestaurant.css';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const [formData, setFormData] = useState({
    restaurant_id: restaurantId,
    title: '',
    description: '',
    funding_goal: '',
    interest_rate: '',
    duration_months: '',
    end_date: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await campaignAPI.create(formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-restaurant-page">
      <div className="container">
        <div className="form-container card">
          <h1>Create Funding Campaign</h1>
          <p className="form-subtitle">Set up your campaign details and funding goals</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Campaign Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Expansion to Second Location"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Campaign Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe what you'll use the funds for, your business plan, and why investors should support you..."
                rows="6"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="funding_goal">Funding Goal ($) *</label>
                <input
                  type="number"
                  id="funding_goal"
                  name="funding_goal"
                  value={formData.funding_goal}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.01"
                  placeholder="50000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="interest_rate">Interest Rate (%) *</label>
                <input
                  type="number"
                  id="interest_rate"
                  name="interest_rate"
                  value={formData.interest_rate}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="8.5"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="duration_months">Duration (Months) *</label>
                <input
                  type="number"
                  id="duration_months"
                  name="duration_months"
                  value={formData.duration_months}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="12"
                />
              </div>

              <div className="form-group">
                <label htmlFor="end_date">End Date (Optional)</label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="info-box">
              <h4>💡 Campaign Tips</h4>
              <ul>
                <li>Set a realistic funding goal based on your actual needs</li>
                <li>Offer competitive interest rates to attract investors</li>
                <li>Provide detailed information about how funds will be used</li>
                <li>Include financial projections if available</li>
              </ul>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Campaign'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
