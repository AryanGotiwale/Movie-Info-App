import { Box, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export const AdminDashboard = ({ onAddMovie }) => {
  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '1400px',
      mx: 'auto',
      px: { xs: 2, sm: 3, md: 4 }, 
      py: { xs: 3, md: 4 }
    }}>
      <Box sx={{ 
        textAlign: 'center',
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid #2a2a2a',
        p: { xs: 4, md: 6 }
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: 'primary.main', 
            mb: 3, 
            fontWeight: 700,
            fontSize: { xs: '1.75rem', md: '2.125rem' }
          }}
        >
          Admin Dashboard
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mb: 4, fontSize: { xs: '0.9rem', md: '1rem' } }}
        >
          Manage your movie database
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={onAddMovie}
          sx={{ 
            px: { xs: 3, md: 4 }, 
            py: { xs: 1.2, md: 1.5 },
            fontSize: { xs: '0.9rem', md: '1rem' }
          }}
        >
          Add New Movie
        </Button>
      </Box>
    </Box>
  );
};