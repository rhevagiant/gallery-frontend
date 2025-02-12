import { Box, Toolbar, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { bluegray } from '../../themes/color';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Main content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, width: '100%', maxWidth: 800 }}
      >
        <Toolbar />
        <Typography variant="h4" gutterBottom textAlign="center">
          <strong>Welcome to Your Dashboard</strong>
        </Typography>

        {/* Container for cards */}
        <Grid container spacing={3} justifyContent="center" sx={{ marginTop: 3 }}>
          {/* Albums Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 150,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: bluegray[700],
                cursor: 'pointer',
                '&:hover': { bgcolor: bluegray[500] },
              }}
              elevation={3}
              onClick={() => navigate('/albums')}
            >
              <Typography variant="h6" sx={{ color: 'white' }}>
                <strong>Albums</strong>
              </Typography>
              <Typography sx={{ color: 'white', textAlign: 'center' }}>
                Manage and view your photo albums
              </Typography>
            </Paper>
          </Grid>

          {/* Photos Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 150,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: bluegray[700],
                cursor: 'pointer',
                '&:hover': { bgcolor: bluegray[500] },
              }}
              elevation={3}
              onClick={() => navigate('/photos')}
            >
              <Typography variant="h6" sx={{ color: 'white' }}>Photos</Typography>
              <Typography sx={{ color: 'white', textAlign: 'center' }}>
                Upload and view your photos
              </Typography>
            </Paper>
          </Grid>

          {/* Likes Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 150,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: bluegray[700],
                cursor: 'pointer',
                '&:hover': { bgcolor: bluegray[500] },
              }}
              elevation={3}
              onClick={() => navigate('/allLiked')}
            >
              <Typography variant="h6" sx={{ color: 'white' }}>Likes</Typography>
              <Typography sx={{ color: 'white', textAlign: 'center' }}>
                View your liked photos
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
