import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import { Utensils, ShoppingBag, Truck, ArrowRight } from 'lucide-react';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF4D4D',
    },
    secondary: {
      main: '#4DFF88',
    },
    background: {
      default: '#0A0A0A',
      paper: '#1A1A1A',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
  },
});

const HomePage = () => {
  const navigate = useNavigate();

  const portalOptions = [
    {
      title: 'Hungry Customer',
      description: 'Find the best dishes and get them delivered fast.',
      icon: <ShoppingBag size={48} />,
      color: '#FF4D4D',
      path: '/order-login',
      label: 'Order Now'
    },
    {
      title: 'Restaurant Owner',
      description: 'Manage your menu and grow your business.',
      icon: <Utensils size={48} />,
      color: '#4DFF88',
      path: '/login',
      label: 'Manage'
    },
    {
      title: 'Delivery Hero',
      description: 'Join the fleet and deliver smiles across the city.',
      icon: <Truck size={48} />,
      color: '#4DB9FF',
      path: '/delivery',
      label: 'Get Started'
    }
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 100%)',
          display: 'flex',
          alignItems: 'center',
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography variant="h1" sx={{
              fontSize: { xs: '3rem', md: '5rem' },
              mb: 2,
              background: 'linear-gradient(to right, #FF4D4D, #FFB347)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              GourmetGo
            </Typography>
            <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 300 }}>
              The most advanced food delivery ecosystem at your fingertips.
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {portalOptions.map((opt, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: 'background.paper',
                    borderRadius: 4,
                    transition: 'all 0.3s ease-in-out',
                    border: '1px solid rgba(255,255,255,0.05)',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: `0 20px 40px ${opt.color}20`,
                      borderColor: opt.color
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{
                      mb: 3,
                      color: opt.color,
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: `${opt.color}10`
                    }}>
                      {opt.icon}
                    </Box>
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                      {opt.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>
                      {opt.description}
                    </Typography>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      onClick={() => navigate(opt.path)}
                      endIcon={<ArrowRight />}
                      sx={{
                        borderRadius: 3,
                        borderColor: opt.color,
                        color: opt.color,
                        '&:hover': {
                          backgroundColor: opt.color,
                          borderColor: opt.color,
                          color: '#000'
                        }
                      }}
                    >
                      {opt.label}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;
