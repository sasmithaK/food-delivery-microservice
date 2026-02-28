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
  FormControlLabel,
  Switch,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Alert,
  Stack,
  CircularProgress
} from '@mui/material';
import { ArrowLeft, Store, MapPin, Save, Info } from 'lucide-react';
import api from "../api/axios";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#FF4D4D' },
    background: { default: '#0A0A0A', paper: '#1A1A1A' },
  },
  typography: { fontFamily: '"Outfit", "Inter", sans-serif' },
});

const EditRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    available: true
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await api.get(`/restaurant-service/restaurants/${id}`);
        const { name, address, available } = response.data;
        setFormData({ name, address, available });
      } catch (err) {
        setError('Failed to load restaurant details.');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleChange = (e) => {
    setFormData({ ...formData, available: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.put(`/restaurant-service/restaurants/${id}`, formData);
      navigate('/restaurants');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update restaurant.');
    } finally {
      setSubmitting(false);
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
      <Box sx={{ minHeight: '100vh', py: 8, background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 100%)' }}>
        <Container maxWidth="sm">
          <Button
            startIcon={<ArrowLeft />}
            onClick={() => navigate('/restaurants')}
            sx={{ mb: 4, color: 'text.secondary', textTransform: 'none' }}
          >
            Back to Hub
          </Button>

          <Card sx={{ borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'background.paper' }}>
            <CardContent sx={{ p: 5 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box sx={{ display: 'inline-flex', p: 2, borderRadius: 3, backgroundColor: 'primary.main', mb: 2, color: '#fff' }}>
                  <Store size={32} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Edit Restaurant</Typography>
                <Typography variant="body1" color="text.secondary">Update your culinary presence.</Typography>
              </Box>

              {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Restaurant Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}><Info size={20} /></Box>,
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Physical Address"
                    name="address"
                    multiline
                    rows={2}
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}><MapPin size={20} /></Box>,
                    }}
                  />

                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Active Status</Typography>
                      <Typography variant="body2" color="text.secondary">Visible to customers immediately.</Typography>
                    </Box>
                    <Switch
                      checked={formData.available}
                      onChange={handleToggleChange}
                      color="primary"
                    />
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={submitting}
                    startIcon={!submitting && <Save />}
                    sx={{
                      py: 2,
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      boxShadow: '0 10px 20px rgba(255,77,77,0.3)',
                      '&:hover': { boxShadow: '0 15px 25px rgba(255,77,77,0.4)' }
                    }}
                  >
                    {submitting ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
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

export default EditRestaurant;
