import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { getAlbumByID } from '../../store/endpoint/album/getAllAlbum';  // Fungsi HTTP untuk mengambil album dan foto

const AlbumDetail = () => {
  const { id } = useParams();  // Mengambil AlbumID dari URL
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState(null);  // Tambahkan state untuk error

  useEffect(() => {
    const fetchAlbumDetail = async () => {
      try {
        const data = await getAlbumByID(id);
        console.log("Data album dari API:", data);
        setAlbum(data);
      } catch (error) {
        setError('Gagal mengambil detail album: ' + error.message);
        console.error('Gagal mengambil detail album:', error);
      }
    };

    fetchAlbumDetail();
  }, [id]);


  console.log("album:", album);
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!album) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>{album.NamaAlbum}</Typography>
      <Typography variant="h6" color="textSecondary">{album.Deskripsi}</Typography>

      <Grid container spacing={3} sx={{ marginTop: 2 }}>
        {album?.Photos?.length > 0 ? (
          album.Photos.map((foto) => (
            <Grid item xs={12} sm={6} md={4} key={foto.FotoID}>
              <Card>
                <CardContent>
                  <img src={foto.LokasiFile} alt={foto.JudulFoto} style={{ width: '100%' }} />
                  <Typography variant="body2">{foto.JudulFoto}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {foto.DeskripsiFoto}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>Tidak ada foto dalam album ini.</Typography>
        )}


      </Grid>
    </Box>
  );
};

export default AlbumDetail;
