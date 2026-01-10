import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Box,
  Rating,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, CalendarToday as CalendarIcon, AccessTime as TimeIcon } from '@mui/icons-material';

export const MovieCard = ({ movie, onEdit, onDelete, isAdmin }) => {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
      }
    }}>
      <CardContent sx={{ flexGrow: 1, pt: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
          {movie.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating 
            value={movie.rating / 2} 
            readOnly 
            precision={0.1} 
            size="small"
            sx={{
              '& .MuiRating-iconFilled': {
                color: '#FFD700',
              },
            }}
          />
          <Typography variant="body2" sx={{ ml: 1, fontWeight: 600, color: 'primary.main' }}>
            {movie.rating}/10
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
          {movie.description || 'No description available'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {movie.duration && (
            <Chip 
              icon={<TimeIcon sx={{ fontSize: 16 }} />}
              label={`${movie.duration} min`} 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(255, 215, 0, 0.1)', 
                color: 'primary.main',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                fontWeight: 600,
              }} 
            />
          )}
          {movie.releaseDate && (
            <Chip
              icon={<CalendarIcon sx={{ fontSize: 16 }} />}
              label={new Date(movie.releaseDate).getFullYear()}
              size="small"
              sx={{ 
                bgcolor: 'rgba(255, 215, 0, 0.1)', 
                color: 'primary.main',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                fontWeight: 600,
              }}
            />
          )}
        </Box>
      </CardContent>
      {isAdmin && (
        <CardActions sx={{ 
          justifyContent: 'flex-end', 
          px: 2, 
          py: 1.5,
          bgcolor: 'rgba(0, 0, 0, 0.2)',
          borderTop: '1px solid #2a2a2a'
        }}>
          <IconButton 
            onClick={() => onEdit(movie)} 
            size="small"
            sx={{ 
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'rgba(255, 215, 0, 0.1)',
              }
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            onClick={() => onDelete(movie._id)} 
            size="small"
            sx={{ 
              color: 'error.main',
              '&:hover': {
                bgcolor: 'rgba(211, 47, 47, 0.1)',
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      )}
    </Card>
  );
};