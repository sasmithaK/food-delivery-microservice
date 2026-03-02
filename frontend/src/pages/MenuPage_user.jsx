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
  Stack,
  Alert,
  Divider
} from '@mui/material';
import { ArrowLeft, ShoppingCart, Plus, Minus, Utensils, Info } from 'lucide-react';
import api from "../api/axios";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#FF4D4D' },
    background: { default: '#0A0A0A', paper: '#1A1A1A' },
  },
  typography: { fontFamily: '"Outfit", "Inter", sans-serif' },
});

const MenuPageUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resInfo, resMenu] = await Promise.all([
          api.get(`/restaurant-service/restaurants/${id}`),
          api.get(`/restaurant-service/restaurants/${id}/menu`)
        ]);
        setRestaurant(resInfo.data);
        setMenuItems(resMenu.data);
      } catch (err) {
        setError('Failed to load this delicious menu.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const updateCart = (itemId, delta) => {
    setCart(prev => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [itemId]: next };
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

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
            onClick={() => navigate('/restaurants_user')}
            sx={{ mb: 4, color: 'text.secondary', textTransform: 'none' }}
          >
            Find more restaurants
          </Button>

          {restaurant && (
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant="h1" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
                {restaurant.name}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ opacity: 0.7 }}>
                {restaurant.address}
              </Typography>
            </Box>
          )}

          <Divider sx={{ mb: 6, borderColor: 'rgba(255,255,255,0.05)' }} />

          {error ? (
            <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{error}</Alert>
          ) : menuItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 10, opacity: 0.3 }}>
              <Utensils size={64} style={{ marginBottom: 16 }} />
              <Typography variant="h5">No items available at the moment.</Typography>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {menuItems.map((item) => {
                const itemId = item._id || item.id;
                const quantity = cart[itemId] || 0;
                return (
                  <Grid item xs={12} sm={6} key={itemId}>
                    <Card sx={{
                      borderRadius: 5,
                      backgroundColor: 'background.paper',
                      border: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': { borderColor: 'primary.main', transform: 'translateY(-4px)' }
                    }}>
                      <CardContent sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mr: 2 }}>{item.description || 'A signature dish crafted with passion.'}</Typography>
                          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>${item.price.toFixed(2)}</Typography>
                        </Box>

                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          borderRadius: 4,
                          p: 1
                        }}>
                          <IconButton onClick={() => updateCart(itemId, 1)} color="primary"><Plus size={20} /></IconButton>
                          <Typography sx={{ fontWeight: 700, my: 1 }}>{quantity}</Typography>
                          <IconButton onClick={() => updateCart(itemId, -1)} disabled={quantity === 0}><Minus size={20} /></IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {totalItems > 0 && (
            <Box sx={{
              position: 'fixed',
              bottom: 40,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'auto',
              minWidth: 300,
              zIndex: 1000
            }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                sx={{
                  borderRadius: 6,
                  py: 2,
                  boxShadow: '0 20px 40px rgba(255,77,77,0.4)',
                  fontSize: '1.2rem',
                  fontWeight: 800
                }}
              >
                Checkout ({totalItems} items)
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default MenuPageUser;
