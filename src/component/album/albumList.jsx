import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';


const AlbumList = () => {
  const [albums, setAlbums] = useState([]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Albums
      </Typography>
      <Grid container spacing={3}>
        {albums.map((album) => (
          <Grid item xs={12} sm={6} md={4} key={album.AlbumID}>
            <Card>
              <CardContent>
                <Typography variant="h6">{album.NamaAlbum}</Typography>
                <Typography color="textSecondary">{album.Deskripsi}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AlbumList;
