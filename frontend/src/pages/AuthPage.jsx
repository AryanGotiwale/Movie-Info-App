import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const AuthPage = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const data = await api.login(email, password);
        if (data.token) {
          login(data.user, data.token);
          onSuccess();
        } else {
          setError(data.message || 'Login failed');
        }
      } else {
        const data = await api.register(name, email, password, role);
        if (data.user) {
          alert('Registration successful! Please login.');
          setIsLogin(true);
          setName('');
          setPassword('');
          setRole('user');
        } else {
          setError(data.message || 'Registration failed');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: { xs: '100%', sm: 450 },
      mx: 'auto',
      px: { xs: 2, sm: 0 },
      mt: { xs: 2, sm: 4 }
    }}>
      <Card sx={{ 
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        border: '1px solid #2a2a2a',
      }}>
        <Box sx={{ 
          bgcolor: 'rgba(255, 215, 0, 0.1)', 
          borderBottom: '2px solid',
          borderColor: 'primary.main',
          py: 2,
          px: 3,
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              color: 'primary.main',
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}
          >
            {isLogin ? '🎬 Login' : '🎬 Register'}
          </Typography>
        </Box>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <TextField
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  margin="normal"
                  required
                  sx={{ bgcolor: 'background.paper' }}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={role}
                    label="Role"
                    onChange={(e) => setRole(e.target.value)}
                    sx={{ bgcolor: 'background.paper' }}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
                <Alert severity="info" sx={{ mt: 1, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                  <Typography variant="caption">
                    Note: Role selection is enabled for demo purposes. In production, admin roles would be assigned manually.
                  </Typography>
                </Alert>
              </>
            )}
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              sx={{ bgcolor: 'background.paper' }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              sx={{ bgcolor: 'background.paper' }}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              sx={{ 
                mt: 3, 
                py: 1.5, 
                fontWeight: 700, 
                fontSize: { xs: '0.9rem', md: '1rem' }
              }}
            >
              {isLogin ? 'Login' : 'Register'}
            </Button>
          </form>
        </CardContent>
        <CardActions sx={{ px: { xs: 2, sm: 3 }, pb: 2, justifyContent: 'center' }}>
          <Button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            sx={{ 
              color: 'primary.main', 
              fontWeight: 600,
              fontSize: { xs: '0.8rem', md: '0.875rem' }
            }}
          >
            {isLogin ? 'Need an account? Register here' : 'Already have an account? Login'}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};