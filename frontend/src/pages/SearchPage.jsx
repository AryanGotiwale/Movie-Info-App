import { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Search as SearchIcon, Movie as MovieIcon } from '@mui/icons-material';
import { MovieCard } from '../components/MovieCard';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const SearchPage = ({ onEdit, onDelete }) => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const data = await api.searchMovies(searchQuery);
      setMovies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error searching:', error);
    }
    setLoading(false);
  };

  const handleSort = async (field) => {
    setSortBy(field);
    if (!field) {
      setMovies([]);
      return;
    }

    setLoading(true);
    try {
      const data = await api.getSortedMovies(field);
      setMovies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error sorting:', error);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search movies by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearch} sx={{ color: 'primary.main' }}>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel >Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => handleSort(e.target.value)}
                sx={{ bgcolor: 'background.paper' }}
                style={{"width":"100px"}}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="releaseDate">Release Date</MenuItem>
                <MenuItem value="duration">Duration</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ color: 'primary.main' }} />
        </Box>
      ) : movies.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px solid #2a2a2a'
        }}>
          <MovieIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {searchQuery || sortBy ? 'No results found' : 'Search or sort to see movies'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
              <MovieCard
                movie={movie}
                isAdmin={isAdmin}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};