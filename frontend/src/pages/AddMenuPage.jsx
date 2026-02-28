import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Alert,
  Stack,
  InputAdornment,
  MenuItem
} from '@mui/material';
import { ArrowLeft, Utensils, DollarSign, Type, Save, Tag } from 'lucide-react';
import api from "../api/axios";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#FF4D4D' },
    background: { default: '#0A0A0A', paper: '#1A1A1A' },
  },
  typography: { fontFamily: '"Outfit", "Inter", sans-serif' },
});

const categories = [
  'Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Sides', 'Snacks'
];

const AddMenuPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      setError('Name and price are required.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api.post(`/restaurant-service/restaurants/${id}/menu`, {
        ...formData,
        price: parseFloat(formData.price)
      });
      navigate(`/menu/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add menu item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', py: 8, background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 100%)' }}>
        <Container maxWidth="sm">
          <Button
            startIcon={<ArrowLeft />}
            onClick={() => navigate(`/menu/${id}`)}
            sx={{ mb: 4, color: 'text.secondary', textTransform: 'none' }}
          >
            Back to Menu
          </Button>

          <Card sx={{ borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'background.paper' }}>
            <CardContent sx={{ p: 5 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box sx={{ display: 'inline-flex', p: 2, borderRadius: 3, backgroundColor: 'primary.main', mb: 2, color: '#fff' }}>
                  <Utensils size={32} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Add Dish</Typography>
                <Typography variant="body1" color="text.secondary">Create a new masterpiece for your menu.</Typography>
              </Box>

              {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Dish Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Type size={20} color="#666" /></InputAdornment>,
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><DollarSign size={20} color="#666" /></InputAdornment>,
                    }}
                  />

                  <TextField
                    fullWidth
                    select
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Tag size={20} color="#666" /></InputAdornment>,
                    }}
                  >
                    {categories.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    multiline
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the flavors, ingredients..."
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={loading}
                    startIcon={!loading && <Save />}
                    sx={{
                      py: 2,
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      boxShadow: '0 10px 20px rgba(255,77,77,0.3)',
                      '&:hover': { boxShadow: '0 15px 25px rgba(255,77,77,0.4)' }
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Add to Menu'}
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AddMenuPage;