import { Box, Toolbar, Typography, Grid, Paper } from '@mui/material';



const Dashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Main content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          Welcome to Your Dashboard
        </Typography>
        <Grid container spacing={3}>
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
              }}
              elevation={3}
            >
              <Typography variant="h6">Albums</Typography>
              <Typography>Manage and view your photo albums</Typography>
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
              }}
              elevation={3}
            >
              <Typography variant="h6">Photos</Typography>
              <Typography>Upload and view your photos</Typography>
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
              }}
              elevation={3}
            >
              <Typography variant="h6">Likes</Typography>
              <Typography>View your liked photos</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
