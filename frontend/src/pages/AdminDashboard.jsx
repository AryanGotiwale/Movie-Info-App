import { Container, Button, Box, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export const AdminDashboard = ({ onAddMovie }) => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ 
        textAlign: 'center',
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid #2a2a2a',
        p: 6
      }}>
        <Typography variant="h4" sx={{ color: 'primary.main', mb: 3, fontWeight: 700 }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your movie database
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={onAddMovie}
          sx={{ px: 4, py: 1.5 }}
        >
          Add New Movie
        </Button>
      </Box>
    </Container>
  );
};