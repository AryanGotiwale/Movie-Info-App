import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Pagination,
  CircularProgress,
  Typography,
} from '@mui/material';
import { MovieCard } from '../components/MovieCard';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Movie as MovieIcon } from '@mui/icons-material';

export const HomePage = ({ onEdit, onDelete }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadMovies();
  }, [page]);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const data = await api.getMovies(page);
      setMovies(data.movies || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error loading movies:', error);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
            No movies found
          </Typography>
        </Box>
      ) : (
        <>
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

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: 'text.primary',
                    borderColor: '#3a3a3a',
                  },
                  '& .Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'black',
                    fontWeight: 700,
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};