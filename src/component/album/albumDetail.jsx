import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardMedia, Dialog,
  DialogTitle, DialogContent, IconButton, TextField, DialogActions, Button, Snackbar, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAlbumByID } from '../../store/endpoint/album/getAllAlbum';
import { bluegray } from '../../themes/color';
import { deleteAlbum, updateAlbum } from '../../store/endpoint/album/UDalbum'; // Import API functions
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const AlbumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Use navigate from React Router v6
  const [album, setAlbum] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // Untuk menampilkan foto di modal
  const [openEditDialog, setOpenEditDialog] = useState(false); // To control dialog open/close
  const [albumData, setAlbumData] = useState({
    NamaAlbum: '',
    Deskripsi: '',
  });

  // Snackbar states
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Default to success severity

  useEffect(() => {
    const fetchAlbumDetail = async () => {
      try {
        const data = await getAlbumByID(id);
        setAlbum(data);
        setAlbumData({
          NamaAlbum: data.NamaAlbum,
          Deskripsi: data.Deskripsi,
        });
      } catch (error) {
        console.error('Gagal mengambil detail album:', error);
      }
    };

    fetchAlbumDetail();
  }, [id]);

  const handleEditAlbum = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleSaveAlbumChanges = async () => {
    try {
      await updateAlbum(id, albumData);
      setSnackbarMessage('Album berhasil diperbarui!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true); // Open Snackbar
      setOpenEditDialog(false);
      const updatedAlbum = await getAlbumByID(id); // Fetch the updated album
      setAlbum(updatedAlbum);
    } catch (error) {
      console.error('Gagal memperbarui album:', error);
      setSnackbarMessage('Gagal memperbarui album.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true); // Open Snackbar
    }
  };

  const handleDeleteAlbum = async () => {
    try {
      await deleteAlbum(id);
      setSnackbarMessage('Album berhasil dihapus!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true); // Open Snackbar
      navigate('/albums'); // Use navigate to redirect to albums list page
    } catch (error) {
      console.error('Gagal menghapus album:', error);
      setSnackbarMessage('Gagal menghapus album.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true); // Open Snackbar
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (!album) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6" gutterBottom><strong>{album.NamaAlbum}</strong></Typography>
          <Typography color="textSecondary">{album.Deskripsi}</Typography>
        </Box>
        <Box>
          <IconButton onClick={handleEditAlbum}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleDeleteAlbum}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Grid Foto */}
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {album?.Photos?.length > 0 ? (
          album.Photos.map((foto) => (
            <Grid item xs={6} sm={4} md={3} key={foto.FotoID}>
              <Card
                sx={{
                  width: 200,
                  height: 200,
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
                onClick={() => setSelectedPhoto(foto)}
              >
                <CardMedia
                  component="img"
                  image={foto.LokasiFile}
                  alt={foto.JudulFoto}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>Tidak ada foto dalam album ini.</Typography>
        )}
      </Grid>

      {/* Dialog untuk edit album */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Album</DialogTitle>
        <DialogContent>
          <TextField
            label="Nama Album"
            variant="outlined"
            fullWidth
            value={albumData.NamaAlbum}
            onChange={(e) => setAlbumData({ ...albumData, NamaAlbum: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Deskripsi"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={albumData.Deskripsi}
            onChange={(e) => setAlbumData({ ...albumData, Deskripsi: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Batal
          </Button>
          <Button onClick={handleSaveAlbumChanges} color="primary">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog untuk detail foto */}
      {selectedPhoto && (
        <Dialog open={Boolean(selectedPhoto)} onClose={() => setSelectedPhoto(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ backgroundColor: bluegray[50] }}><strong>{selectedPhoto.JudulFoto}</strong></DialogTitle>
          <DialogContent sx={{ backgroundColor: bluegray[50] }}>
            <Grid container spacing={2} alignItems="center">
              {/* Foto di kiri */}
              <Grid item xs={5}>
                <img
                  src={selectedPhoto.LokasiFile}
                  alt={selectedPhoto.JudulFoto}
                  style={{ width: '100%', borderRadius: 8 }}
                />
              </Grid>

              {/* Deskripsi di kanan */}
              <Grid item xs={7}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Deskripsi:</strong> {selectedPhoto.DeskripsiFoto || 'Tidak ada deskripsi'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Foto ID: {selectedPhoto.FotoID}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}

      {/* Snackbar untuk feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AlbumDetail;
