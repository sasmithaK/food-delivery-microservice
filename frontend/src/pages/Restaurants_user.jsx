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
  CardMedia,
  Chip,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  InputBase,
  Paper,
  IconButton
} from '@mui/material';
import { Search, MapPin, Star, Utensils, ArrowRight } from 'lucide-react';
import api from "../api/axios";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#FF4D4D' },
    background: { default: '#0A0A0A', paper: '#1A1A1A' },
  },
  typography: { fontFamily: '"Outfit", "Inter", sans-serif' },
});

const RestaurantsUser = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await api.get('/restaurant-service/restaurants');
      setRestaurants(response.data.filter(r => r.available));
    } catch (err) {
      setError('Failed to load amazing restaurants near you.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.address.toLowerCase().includes(search.toLowerCase())
  );

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
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>Discover Excellence</Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 6 }}>The finest kitchens in the city, delivered to your door.</Typography>

            <Paper
              component="form"
              sx={{
                p: '4px 12px',
                display: 'flex',
                alignItems: 'center',
                maxWidth: 600,
                mx: 'auto',
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <IconButton sx={{ p: '10px' }}>
                <Search size={24} color="#666" />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1, py: 1 }}
                placeholder="Search restaurants, cuisines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Paper>
          </Box>

          <Grid container spacing={4}>
            {filtered.map((res) => {
              const id = res._id || res.id;
              return (
                <Grid item xs={12} sm={6} md={4} key={id}>
                  <Card sx={{
                    borderRadius: 5,
                    height: '100%',
                    backgroundColor: 'background.paper',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    '&:hover': { transform: 'scale(1.03)', boxShadow: '0 20px 40px rgba(255,77,77,0.1)', borderColor: 'primary.main' }
                  }} onClick={() => navigate(`/menu_user/${id}`)}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>{res.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#FFD700' }}>
                          <Star size={18} fill="#FFD700" />
                          <Typography sx={{ fontWeight: 700 }}>4.8</Typography>
                        </Box>
                      </Box>

                      <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                        <MapPin size={18} /> {res.address}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip label="20-30 min" size="small" sx={{ borderRadius: 2 }} />
                          <Chip label="Free Delivery" size="small" variant="outlined" sx={{ borderRadius: 2 }} />
                        </Box>
                        <IconButton color="primary">
                          <ArrowRight size={20} />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default RestaurantsUser;
