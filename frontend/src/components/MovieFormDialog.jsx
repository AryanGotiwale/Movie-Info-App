import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

export const MovieFormDialog = ({ open, onClose, movie, onSave }) => {  // ← Add 'export' here!
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rating: '',
    duration: '',
    releaseDate: '',
  });

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || '',
        description: movie.description || '',
        rating: movie.rating || '',
        duration: movie.duration || '',
        releaseDate: movie.releaseDate ? movie.releaseDate.split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        rating: '',
        duration: '',
        releaseDate: '',
      });
    }
  }, [movie, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{movie ? 'Edit Movie' : 'Add New Movie'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Rating (0-10)"
            type="number"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
            margin="normal"
            inputProps={{ min: 0, max: 10, step: 0.1 }}
          />
          <TextField
            fullWidth
            label="Duration (minutes)"
            type="number"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Release Date"
            type="date"
            value={formData.releaseDate}
            onChange={(e) =>
              setFormData({ ...formData, releaseDate: e.target.value })
            }
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {movie ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};