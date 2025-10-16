import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import './CreateRestaurant.css';

const CreateRestaurant = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    cuisine_type: '',
    location: '',
    address: '',
    description: '',
    image_url: '',
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
      await restaurantAPI.create(formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create restaurant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-restaurant-page">
      <div className="container">
        <div className="form-container card">
          <h1>Add Your Restaurant</h1>
          <p className="form-subtitle">Tell us about your restaurant to get started</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Restaurant Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., The Golden Spoon"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cuisine_type">Cuisine Type *</label>
                <input
                  type="text"
                  id="cuisine_type"
                  name="cuisine_type"
                  value={formData.cuisine_type}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Italian, Japanese, Mexican"
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">City/Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g., New York, NY"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Full Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street, City, State ZIP"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Tell potential investors about your restaurant, its history, and what makes it special..."
                rows="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image_url">Image URL</label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/restaurant-image.jpg"
              />
              <small className="form-help">
                Provide a URL to an image of your restaurant (optional)
              </small>
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
                {loading ? 'Creating...' : 'Create Restaurant'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRestaurant;
