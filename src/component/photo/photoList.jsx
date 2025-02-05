import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia, Grid } from '@mui/material';
import { getAllPhotos } from '../../store/endpoint/photo/AllPhoto'; // Pastikan path sesuai

const PhotoList = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await getAllPhotos();
        setPhotos(data);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <Box sx={{ padding: 3, mt: 7 }}>
      <Typography variant="h4" gutterBottom>
        <strong>Photos</strong>
      </Typography>
      <Typography  color="textSecondary" sx={{ mb: 6 }}>
        This all your photos
      </Typography>
      <Grid container spacing={3}>
        {photos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} key={photo.FotoID}>
            <Card
            sx={{
              width: 200,
              height: 200,
              cursor: 'pointer'
            }}
            >
              <CardMedia
                component="img"
                image={photo.LokasiFile} // Sesuaikan dengan struktur backend
                alt={photo.JudulFoto}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PhotoList;
