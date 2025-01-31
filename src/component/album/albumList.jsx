import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { Link } from 'react-router-dom';  // Import Link dari react-router-dom
import { getAllAlbums } from '../../store/endpoint/album/getAllAlbum'; // Import fungsi HTTP client

const AlbumList = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const data = await getAllAlbums();
        setAlbums(data);
      } catch (error) {
        console.error('Gagal mengambil album:', error);
      }
    };
  
    fetchAlbums();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Albums
      </Typography>
      <Grid container spacing={3}>
        {albums.map((Album) => (
          <Grid item xs={12} sm={6} md={4} key={Album.AlbumID}>
            <Link to={`/album/${Album.AlbumID}`} style={{ textDecoration: 'none' }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{Album.NamaAlbum}</Typography>
                  <Typography color="textSecondary">{Album.Deskripsi}</Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AlbumList;
