import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Login as LoginIcon,
  Movie as MovieIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Dashboard as DashboardIcon,
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

  const { user, token, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();

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
      window.location.reload(); // Reload to show new movie
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

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    if (newValue === 0) navigate('/');
    if (newValue === 1) navigate('/search');
    if (newValue === 2) navigate('/admin');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
        <Toolbar sx={{ py: 1 }}>
          <MovieIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700, color: 'primary.main' }}>
            Movie Database
          </Typography>

          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            sx={{ 
              mr: 3,
              '& .MuiTab-root': { color: 'text.secondary' },
              '& .Mui-selected': { color: 'primary.main' },
            }}
          >
            <Tab icon={<HomeIcon />} label="Home" />
            <Tab icon={<SearchIcon />} label="Search" />
            {isAdmin && <Tab icon={<DashboardIcon />} label="Admin" />}
          </Tabs>

          {user && (
            <Box sx={{ 
              mr: 2, 
              px: 2, 
              py: 0.5, 
              bgcolor: 'rgba(255, 215, 0, 0.1)', 
              borderRadius: 2,
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}>
              <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                {user.name} ({user.role})
              </Typography>
            </Box>
          )}

          {!user ? (
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={() => setShowAuthForm(true)}
            >
              Login
            </Button>
          ) : (
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={logout}
              sx={{ 
                borderColor: 'primary.main', 
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.light',
                  bgcolor: 'rgba(255, 215, 0, 0.1)',
                }
              }}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {alert && (
        <Box sx={{ maxWidth: 'xl', mx: 'auto', px: 4, pt: 2 }}>
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