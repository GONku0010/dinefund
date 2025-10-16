import React, { useEffect, useState } from 'react';
import { campaignAPI } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import './Campaigns.css';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    cuisine_type: '',
    location: '',
  });

  useEffect(() => {
    fetchCampaigns();
  }, [filters]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.cuisine_type) params.cuisine_type = filters.cuisine_type;
      if (filters.location) params.location = filters.location;

      const response = await campaignAPI.getAll(params);
      setCampaigns(response.data.campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      cuisine_type: '',
      location: '',
    });
  };

  return (
    <div className="campaigns-page">
      <div className="container">
        <div className="page-header">
          <h1>Browse Campaigns</h1>
          <p>Discover local restaurants seeking investment</p>
        </div>

        {/* Filters */}
        <div className="filters-section card">
          <h3>Filter Campaigns</h3>
          <div className="filters-grid">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="funded">Funded</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cuisine_type">Cuisine Type</label>
              <input
                type="text"
                id="cuisine_type"
                name="cuisine_type"
                value={filters.cuisine_type}
                onChange={handleFilterChange}
                placeholder="e.g., Italian, Japanese"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="e.g., New York, Los Angeles"
              />
            </div>

            <div className="form-group">
              <label>&nbsp;</label>
              <button onClick={clearFilters} className="btn btn-secondary btn-block">
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="campaigns-results">
          <div className="results-header">
            <h2>
              {loading ? 'Loading...' : `${campaigns.length} Campaign${campaigns.length !== 1 ? 's' : ''} Found`}
            </h2>
          </div>

          {loading ? (
            <div className="loading">Loading campaigns...</div>
          ) : campaigns.length > 0 ? (
            <div className="grid grid-3">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <div className="empty-state card">
              <h3>No campaigns found</h3>
              <p>Try adjusting your filters or check back later for new opportunities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
