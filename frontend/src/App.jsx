import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Alert,
  CssBaseline,
  ThemeProvider,
  createTheme,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Login as LoginIcon,
  Movie as MovieIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';
import { MovieFormDialog } from './components/MovieFormDialog';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD700',
      light: '#FFED4E',
      dark: '#C7A600',
      contrastText: '#000000',
    },
    secondary: {
      main: '#FFA500',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(255, 215, 0, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          border: '1px solid #2a2a2a',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(255, 215, 0, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#3a3a3a',
            },
            '&:hover fieldset': {
              borderColor: '#FFD700',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
        },
      },
    },
  },
});

function AppContent() {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [movieFormOpen, setMovieFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [alert, setAlert] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { user, token, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const showAlert = (message, severity = 'success') => {
    setAlert({ message, severity });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSaveMovie = async (movieData) => {
    try {
      if (editingMovie) {
        await api.updateMovie(editingMovie._id, movieData, token);
        showAlert('Movie updated successfully');
      } else {
        await api.addMovie(movieData, token);
        showAlert('Movie added to queue');
      }
      setMovieFormOpen(false);
      setEditingMovie(null);
      window.location.reload();
    } catch (error) {
      showAlert('Failed to save movie', 'error');
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;

    try {
      await api.deleteMovie(id, token);
      showAlert('Movie deleted');
      window.location.reload();
    } catch (error) {
      showAlert('Failed to delete movie', 'error');
    }
  };

  const handleNavigation = (index) => {
    setCurrentTab(index);
    setDrawerOpen(false);
    if (index === 0) navigate('/');
    if (index === 1) navigate('/search');
    if (index === 2) navigate('/admin');
  };

  const navigationItems = [
    { label: 'Home', icon: <HomeIcon />, index: 0 },
    { label: 'Search', icon: <SearchIcon />, index: 1 },
    ...(isAdmin ? [{ label: 'Admin', icon: <DashboardIcon />, index: 2 }] : []),
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: isMobile ? 7 : 0 }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
        <Toolbar sx={{ py: 1 }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2, color: 'primary.main' }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <MovieIcon sx={{ mr: { xs: 1, md: 2 }, fontSize: { xs: 28, md: 32 }, color: 'primary.main' }} />
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700, 
              color: 'primary.main',
              fontSize: { xs: '1.1rem', md: '1.5rem' }
            }}
          >
            {isMobile ? 'Movies' : 'Movie Database'}
          </Typography>

          {user && !isMobile && (
            <Box sx={{ 
              mr: 2, 
              px: 2, 
              py: 0.5, 
              bgcolor: 'rgba(255, 215, 0, 0.1)', 
              borderRadius: 2,
              border: '1px solid rgba(255, 215, 0, 0.3)',
            }}>
              <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                {user.name} ({user.role})
              </Typography>
            </Box>
          )}

          {!user ? (
            <Button
              variant="contained"
              startIcon={!isMobile && <LoginIcon />}
              onClick={() => setShowAuthForm(true)}
              size={isMobile ? 'small' : 'medium'}
            >
              {isMobile ? <LoginIcon /> : 'Login'}
            </Button>
          ) : (
            <Button
              variant="outlined"
              startIcon={!isMobile && <LogoutIcon />}
              onClick={logout}
              size={isMobile ? 'small' : 'medium'}
              sx={{ 
                borderColor: 'primary.main', 
                color: 'primary.main',
                minWidth: isMobile ? 'auto' : 'inherit',
                px: isMobile ? 1 : 2,
                '&:hover': {
                  borderColor: 'primary.light',
                  bgcolor: 'rgba(255, 215, 0, 0.1)',
                }
              }}
            >
              {isMobile ? <LogoutIcon /> : 'Logout'}
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            width: 250,
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
            Menu
          </Typography>
          {user && (
            <Box sx={{ 
              mb: 2,
              p: 1.5, 
              bgcolor: 'rgba(255, 215, 0, 0.1)', 
              borderRadius: 1,
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}>
              <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                {user.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {user.role}
              </Typography>
            </Box>
          )}
        </Box>
        <List>
          {navigationItems.map((item) => (
            <ListItem 
              button 
              key={item.label}
              onClick={() => handleNavigation(item.index)}
              selected={currentTab === item.index}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'rgba(255, 215, 0, 0.1)',
                  borderRight: '3px solid',
                  borderColor: 'primary.main',
                }
              }}
            >
              <ListItemIcon sx={{ color: currentTab === item.index ? 'primary.main' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                sx={{ 
                  '& .MuiTypography-root': { 
                    color: currentTab === item.index ? 'primary.main' : 'text.primary' 
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {isMobile && (
        <Paper 
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0,
            zIndex: 1000,
            borderTop: '1px solid #2a2a2a'
          }} 
          elevation={3}
        >
          <BottomNavigation
            value={currentTab}
            onChange={(event, newValue) => handleNavigation(newValue)}
            showLabels
            sx={{
              bgcolor: 'background.paper',
              '& .MuiBottomNavigationAction-root': {
                color: 'text.secondary',
                minWidth: 'auto',
              },
              '& .Mui-selected': {
                color: 'primary.main',
              }
            }}
          >
            {navigationItems.map((item) => (
              <BottomNavigationAction
                key={item.label}
                label={item.label}
                icon={item.icon}
                value={item.index}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}

      {alert && (
        <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, md: 4 }, pt: 2 }}>
          <Alert severity={alert.severity} sx={{ borderRadius: 2 }}>
            {alert.message}
          </Alert>
        </Box>
      )}

      {showAuthForm && (
        <AuthPage onSuccess={() => setShowAuthForm(false)} />
      )}

      {!showAuthForm && (
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                onEdit={(m) => {
                  setEditingMovie(m);
                  setMovieFormOpen(true);
                }}
                onDelete={handleDeleteMovie}
              />
            } 
          />
          <Route 
            path="/search" 
            element={
              <SearchPage 
                onEdit={(m) => {
                  setEditingMovie(m);
                  setMovieFormOpen(true);
                }}
                onDelete={handleDeleteMovie}
              />
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard 
                  onAddMovie={() => {
                    setEditingMovie(null);
                    setMovieFormOpen(true);
                  }}
                />
              </ProtectedRoute>
            } 
          />
        </Routes>
      )}

      <MovieFormDialog
        open={movieFormOpen}
        onClose={() => {
          setMovieFormOpen(false);
          setEditingMovie(null);
        }}
        movie={editingMovie}
        onSave={handleSaveMovie}
      />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;