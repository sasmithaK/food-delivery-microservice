import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/restaurant-service/restaurants');
      setRestaurants(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch restaurants');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleAddMenu = (id) => {
    if (!id) {
      setError('Invalid restaurant ID');
      return;
    }
    navigate(`/restaurants/${id}/add-menu`);
  };

  const handleViewMenu = (id) => {
    if (!id) {
      setError('Invalid restaurant ID');
      return;
    }
    navigate(`/menu/${id}`);
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await api.put(`/restaurant-service/restaurants/${id}/status`, { available: !currentStatus });
      fetchRestaurants();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
      console.error('Toggle error:', err);
    }
  };

  const deleteRestaurant = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;

    try {
      await api.delete(`/restaurant-service/restaurants/${id}`);
      fetchRestaurants();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete restaurant');
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <button
          onClick={() => navigate('/add-restaurant')}
          className="btn btn-primary"
        >
          Add Restaurant
        </button>

        <h1 className="fw-bold text-primary">Restaurants</h1>

        <div className="w-25"></div> {/* Spacer */}
      </div>

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {restaurants.length === 0 ? (
        <div className="text-center py-5">
          <h5 className="text-muted">No restaurants found. Add one to get started!</h5>
        </div>
      ) : (
        <div className="row g-4">
          {restaurants.map((restaurant) => {
            const restaurantId = restaurant._id || restaurant.id;
            if (!restaurantId) return null;

            return (
              <div key={restaurantId} className="col-12 col-md-6 col-lg-4">
                <div className="card shadow-sm h-100 border-0">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title">{restaurant.name}</h5>
                      <span className={`badge ${restaurant.available ? 'bg-success' : 'bg-danger'}`}>
                        {restaurant.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>

                    <p className="card-text text-muted">{restaurant.address}</p>

                    <div className="mt-auto">
                      <div className="d-flex flex-wrap gap-2">
                        <button
                          onClick={() => handleViewMenu(restaurantId)}
                          className="btn btn-outline-primary btn-sm"
                        >
                          View Menu
                        </button>

                        <button
                          onClick={() => handleAddMenu(restaurantId)}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          Add Menu
                        </button>

                        <button
                          onClick={() => toggleAvailability(restaurantId, restaurant.available)}
                          className={`btn btn-sm ${restaurant.available ? 'btn-outline-warning' : 'btn-outline-success'
                            }`}
                        >
                          {restaurant.available ? 'Mark Unavailable' : 'Mark Available'}
                        </button>

                        <button
                          onClick={() => navigate(`/edit-restaurant/${restaurantId}`)}
                          className="btn btn-outline-dark btn-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteRestaurant(restaurantId)}
                          className="btn btn-outline-danger btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Restaurants;
