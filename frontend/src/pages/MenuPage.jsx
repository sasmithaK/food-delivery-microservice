import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { ArrowLeft, Trash2, Edit3, Plus, Utensils } from 'lucide-react';
import api from "../api/axios";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#FF4D4D' },
    background: { default: '#0A0A0A', paper: '#1A1A1A' },
  },
  typography: { fontFamily: '"Outfit", "Inter", sans-serif' },
});

const MenuPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMenuAndRestaurant = async () => {
    try {
      setLoading(true);
      const restaurantRes = await api.get(`/restaurant-service/restaurants/${id}`);
      setRestaurant(restaurantRes.data);

      const menuRes = await api.get(`/restaurant-service/restaurants/${id}/menu`);
      setMenuItems(menuRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch menu data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuAndRestaurant();
  }, [id]);

  const handleDelete = async (menuId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await api.delete(`/restaurant-service/restaurants/${id}/menu/${menuId}`);
      fetchMenuAndRestaurant();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete menu item');
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
      <Box sx={{ minHeight: '100vh', py: 6, background: 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)' }}>
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowLeft />}
            onClick={() => navigate('/restaurants')}
            sx={{ mb: 4, color: 'text.secondary', textTransform: 'none' }}
          >
            Back to Restaurants
          </Button>

          {restaurant && (
            <Box sx={{ mb: 6 }}>
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                {restaurant.name}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Utensils size={18} /> {restaurant.address}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>Menu Items</Typography>
            <Button
              variant="contained"
              startIcon={<Plus />}
              onClick={() => navigate(`/restaurants/${id}/add-menu`)}
              sx={{ borderRadius: 3 }}
            >
              Add Item
            </Button>
          </Box>

          {menuItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 10, opacity: 0.5 }}>
              <Utensils size={64} style={{ marginBottom: 16 }} />
              <Typography variant="h5">No items found in this menu.</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {menuItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id || item.id}>
                  <Card sx={{
                    borderRadius: 4,
                    height: '100%',
                    backgroundColor: 'background.paper',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.02)' }
                  }}>
                    <CardContent sx={{ p: 3, display: 'flex', flexColumn: 'column' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
                          ${item.price.toFixed(2)}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                        {item.description || 'No description provided.'}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip label={item.category || 'Default'} size="small" variant="outlined" />
                        <Box>
                          <IconButton onClick={() => navigate(`/menu/${id}/edit/${item._id || item.id}`)} color="primary">
                            <Edit3 size={18} />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(item._id || item.id)} sx={{ color: 'rgba(255,255,255,0.3)' }}>
                            <Trash2 size={18} />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default MenuPage;
