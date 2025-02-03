import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Dialog, DialogTitle, DialogContent, 
  TextField, DialogActions 
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getAllAlbums } from '../../store/endpoint/album/getAllAlbum';
import { createAlbum } from '../../store/endpoint/album/createAlbum';
import { bluegray } from '../../themes/color';

const AlbumList = () => {
  const [albums, setAlbums] = useState([]);
  const [open, setOpen] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ NamaAlbum: '', Deskripsi: '' });

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const data = await getAllAlbums();
      setAlbums(data);
    } catch (error) {
      console.error('Gagal mengambil album:', error);
    }
  };

  const handleCreateAlbum = async () => {
    try {
      await createAlbum(newAlbum);
      setOpen(false);
      setNewAlbum({ NamaAlbum: '', Deskripsi: '' });
      fetchAlbums(); // Refresh daftar album setelah create
    } catch (error) {
      console.error('Gagal membuat album:', error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Albums
      </Typography>

      {/* Tombol di sebelah kanan */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          variant="contained" 
          sx={{ backgroundColor: bluegray[500], color: 'white' }}
          onClick={() => setOpen(true)}
        >
          Create Album
        </Button>
      </Box>

      {/* Grid Album */}
      <Grid container spacing={2}>
        {albums.map((Album) => (
          <Grid item xs={12} sm={6} md={4} key={Album.AlbumID}>
            <Link to={`/album/${Album.AlbumID}`} style={{ textDecoration: 'none' }}>
              <Card sx={{ maxWidth: 300, margin: 'auto', padding: 2 }}>
                <CardContent>
                  <Typography variant="h6">{Album.NamaAlbum}</Typography>
                  <Typography color="textSecondary">{Album.Deskripsi}</Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      {/* Dialog Create Album */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle >Create New Album</DialogTitle>
        <DialogContent>
          <TextField
            label="Nama Album"
            fullWidth
            margin="dense"
            value={newAlbum.NamaAlbum}
            onChange={(e) => setNewAlbum({ ...newAlbum, NamaAlbum: e.target.value })}
          />
          <TextField
            label="Deskripsi"
            fullWidth
            margin="dense"
            value={newAlbum.Deskripsi}
            onChange={(e) => setNewAlbum({ ...newAlbum, Deskripsi: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateAlbum} sx={{ backgroundColor: bluegray[500], color: 'white' }}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AlbumList;
