import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Grid } from '@mui/material';
import axios from 'axios';

const PhotoList = () => {
  const [photos, setPhotos] = useState([]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Photos
      </Typography>
      <Grid container spacing={3}>
        {photos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} key={photo.FotoID}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={photo.LokasiFile} // Adjust with your backend's image URL
                alt={photo.JudulFoto}
              />
              <CardContent>
                <Typography variant="h6">{photo.JudulFoto}</Typography>
                <Typography color="textSecondary">{photo.DeskripsiFoto}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PhotoList;
