import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Stack,
  Alert
} from '@mui/material';
import { Plus, Edit3, Trash2, MapPin, Eye, Power, UtensilsCrossed } from 'lucide-react';
import api from "../api/axios";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#FF4D4D' },
    background: { default: '#0A0A0A', paper: '#1A1A1A' },
  },
  typography: { fontFamily: '"Outfit", "Inter", sans-serif' },
});

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await api.get('/restaurant-service/restaurants');
      setRestaurants(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await api.put(`/restaurant-service/restaurants/${id}/status`, { available: !currentStatus });
      fetchRestaurants();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const deleteRestaurant = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;
    try {
      await api.delete(`/restaurant-service/restaurants/${id}`);
      fetchRestaurants();
    } catch (err) {
      setError('Failed to delete restaurant');
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress color="primary" />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', py: 8, background: 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
            <Box>
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>My Restaurants</Typography>
              <Typography variant="h6" color="text.secondary">Manage your culinary empire from one place.</Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<Plus />}
              onClick={() => navigate('/add-restaurant')}
              sx={{ borderRadius: 4, px: 4, py: 1.5, fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(255,77,77,0.3)' }}
            >
              Add New
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{error}</Alert>}

          {restaurants.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 12, opacity: 0.3 }}>
              <UtensilsCrossed size={80} style={{ marginBottom: 24 }} />
              <Typography variant="h4">No restaurants found yet.</Typography>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {restaurants.map((res) => {
                const id = res._id || res.id;
                return (
                  <Grid item xs={12} md={6} lg={4} key={id}>
                    <Card sx={{
                      borderRadius: 5,
                      height: '100%',
                      backgroundColor: 'background.paper',
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(255,255,255,0.05)',
                      '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderColor: 'primary.main' }
                    }}>
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
                          <Typography variant="h4" sx={{ fontWeight: 700 }}>{res.name}</Typography>
                          <Chip
                            label={res.available ? 'Active' : 'Offline'}
                            color={res.available ? 'success' : 'error'}
                            size="small"
                            sx={{ borderRadius: 2, fontWeight: 600 }}
                          />
                        </Box>

                        <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                          <MapPin size={18} /> {res.address}
                        </Typography>

                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Eye size={18} />}
                            onClick={() => navigate(`/menu/${id}`)}
                            sx={{ borderRadius: 3, textTransform: 'none' }}
                          >
                            Menu
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Plus size={18} />}
                            onClick={() => navigate(`/restaurants/${id}/add-menu`)}
                            sx={{ borderRadius: 3, textTransform: 'none' }}
                          >
                            Menu+
                          </Button>
                        </Stack>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <Box>
                            <IconButton onClick={() => navigate(`/edit-restaurant/${id}`)} color="primary">
                              <Edit3 size={20} />
                            </IconButton>
                            <IconButton onClick={() => toggleAvailability(id, res.available)} color={res.available ? 'warning' : 'success'}>
                              <Power size={20} />
                            </IconButton>
                          </Box>
                          <IconButton onClick={() => deleteRestaurant(id)} sx={{ color: 'rgba(255,255,255,0.2)' }}>
                            <Trash2 size={20} />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Restaurants;
