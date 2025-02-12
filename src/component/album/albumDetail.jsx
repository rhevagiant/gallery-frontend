import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardMedia, Dialog,
  DialogTitle, DialogContent, IconButton, TextField, DialogActions, Button, Snackbar, Alert,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoIcon from '@mui/icons-material/AddPhotoAlternate';
import { getAlbumByID } from '../../store/endpoint/album/getAllAlbum';
import { bluegray } from '../../themes/color';
import { deleteAlbum, updateAlbum } from '../../store/endpoint/album/UDalbum'; // Import API functions
import { uploadPhoto } from '../../store/endpoint/photo/uploadPhoto'; // Add API function for uploading photos
import { useDropzone } from 'react-dropzone'; // Import useDropzone hook
import { deletePhoto } from '../../store/endpoint/photo/deletePhoto';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Swal from 'sweetalert2';
import { addCommentToPhoto, deleteComment, getCommentsByPhoto } from '../../store/endpoint/komentar/komentar';
import { likePhoto } from '../../store/endpoint/likes/likes';
import { Favorite, FavoriteBorderOutlined } from '@mui/icons-material';
import { useLike } from '../../context/likeContext';

const AlbumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [albumData, setAlbumData] = useState({
    NamaAlbum: '',
    Deskripsi: '',
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  const [newPhoto, setNewPhoto] = useState({
    JudulFoto: '',
    DeskripsiFoto: '',
    image: null,
    preview: null,
  });
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedPhotoComments, setSelectedPhotoComments] = useState([]);
  const { likedPhotos, likeCounts, toggleLike } = useLike();

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
        console.error('Failed to fetch album details:', error);
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
      setSnackbarMessage('Album updated successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setOpenEditDialog(false);
      const updatedAlbum = await getAlbumByID(id);
      setAlbum(updatedAlbum);
    } catch (error) {
      console.error('Failed to update album:', error);
      setSnackbarMessage('Failed to update album.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleDeleteAlbum = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAlbum(id);
          setSnackbarMessage("Album deleted successfully!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
          navigate("/albums");
        } catch (error) {
          console.error("Failed to delete album:", error);
          setSnackbarMessage("Failed to delete album.");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      }
    });
  };


  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const filePreview = URL.createObjectURL(file);
      setNewPhoto({
        ...newPhoto,
        image: file,
        preview: filePreview,
      });
    }
  };

  const handleDeletePhoto = async (FotoID) => {
    // Tutup dialog sebelum SweetAlert muncul
    setOpenPhotoDialog(false);
    setSelectedPhoto(null);

    // Tunggu SweetAlert sebelum melanjutkan
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await deletePhoto(FotoID);
        setSnackbarMessage("Photo deleted successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        // Refresh album setelah menghapus foto
        const updatedAlbum = await getAlbumByID(id);
        setAlbum(updatedAlbum);
      } catch (error) {
        console.error("Failed to delete photo:", error);
        setSnackbarMessage(`Failed to delete photo: ${error.response?.data?.message || 'Unknown error'}`);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  const handleUploadPhoto = async () => {
    if (!newPhoto.image) {
      setSnackbarMessage('Please select an image.');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }



    try {
      const formData = new FormData();
      formData.append('image', newPhoto.image);
      formData.append('JudulFoto', newPhoto.JudulFoto);
      formData.append('DeskripsiFoto', newPhoto.DeskripsiFoto);
      formData.append('AlbumID', id);

      await uploadPhoto(formData);
      setSnackbarMessage('Photo uploaded successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setOpenUploadDialog(false);
      const updatedAlbum = await getAlbumByID(id);
      setAlbum(updatedAlbum);

      // Reset form after successful upload
      setNewPhoto({
        JudulFoto: '',
        DeskripsiFoto: '',
        image: null,
        preview: null,
      });
    } catch (error) {
      console.error('Failed to upload photo:', error);
      setSnackbarMessage('Failed to upload photo.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleOpenPhotoDialog = (photo) => {
    setSelectedPhoto(photo);
    setOpenPhotoDialog(true);
  };

  // Setting up the drag-and-drop area using react-dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const filePreview = URL.createObjectURL(file);
      setNewPhoto({
        ...newPhoto,
        image: file,
        preview: filePreview,
      });
    },
  });

  if (!album) {
    return <Typography>Loading...</Typography>;
  }

  const openCommentDialog = async (photo) => {
    setSelectedPhoto(photo);
    setCommentDialogOpen(true);
    try {
      const comments = await getCommentsByPhoto(photo.FotoID);
      setSelectedPhotoComments(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const addedComment = await addCommentToPhoto(selectedPhoto.FotoID, newComment);
      setSelectedPhotoComments((prevComments) => [...prevComments, addedComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (KomentarID) => {
    try {
      await deleteComment(KomentarID);

      // Update state secara langsung agar UI langsung berubah
      setSelectedPhotoComments((prevComments) =>
        prevComments.filter(comment => comment.KomentarID !== KomentarID)
      );

    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLikePhoto = async (fotoID) => {
    try {
      await likePhoto(fotoID);
      toggleLike(fotoID);
    } catch (error) {
      console.error("Error liking photo:", error);
    }
  };

  return (
    <Box
      sx={{
        padding: 3,
        mt: 7,
        height: 'calc(100vh - 64px)', // Adjust this value based on the sidebar height
        overflowY: 'auto', // Allow scrolling within the content
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6" gutterBottom>
            <strong>{album.NamaAlbum}</strong>
          </Typography>
          <Typography color="textSecondary">{album.Deskripsi}</Typography>
        </Box>
        <Box>
          <IconButton onClick={handleEditAlbum}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleDeleteAlbum}>
            <DeleteIcon />
          </IconButton>
          <Button
            variant="contained"
            sx={{
              backgroundColor: bluegray[700],
              color: 'white',
              ml: 2,
              '&:hover': { backgroundColor: bluegray[500] }
            }}
            onClick={handleOpenUploadDialog}
            startIcon={<AddPhotoIcon />}>
            Add Photo
          </Button>

        </Box>
      </Box>

      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {album?.Photos?.length > 0 ? (
          album.Photos.map((foto) => (
            <Grid item xs={6} sm={4} md={3} key={foto.FotoID}>
              <Card
                sx={{
                  width: 250,
                  height: 250,
                  cursor: 'pointer',
                  overflow: 'hidden',
                }}
                onClick={() => handleOpenPhotoDialog(foto)}
              >
                <CardMedia
                  component="img"
                  image={foto.LokasiFile}
                  alt={foto.JudulFoto}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No photos in this album.</Typography>
        )}
      </Grid>

      {/* Dialog for Viewing Photo Details */}
      {selectedPhoto && (
        <Dialog open={Boolean(selectedPhoto)} onClose={() => setSelectedPhoto(null)} maxWidth="md" fullWidth>
          <DialogContent sx={{ backgroundColor: bluegray[50] }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={5}>
                <img src={selectedPhoto.LokasiFile} alt={selectedPhoto.JudulFoto} style={{ width: '100%', borderRadius: 8 }} />
              </Grid>
              <Grid item xs={7}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ mb: 2, mt: 2 }}>
                    <strong>{selectedPhoto.JudulFoto}</strong>
                  </Typography>
                  <IconButton color="error" onClick={() => handleDeletePhoto(selectedPhoto.FotoID)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Deskripsi:</strong> {selectedPhoto.DeskripsiFoto || 'Tidak ada deskripsi'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Foto ID: {selectedPhoto.FotoID}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <IconButton color="primary" onClick={() => handleLikePhoto(selectedPhoto.FotoID)}>
                    {likedPhotos[selectedPhoto.FotoID] ? <Favorite color="error" /> : <FavoriteBorderOutlined />}
                  </IconButton>
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {likeCounts[selectedPhoto.FotoID] || 0} Likes
                  </Typography>
                </Box>
                <Button onClick={() => openCommentDialog(selectedPhoto)} sx={{ mt: 2 }} variant="outlined">
                  View & Add Comments
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog Komentar */}
      <Dialog open={commentDialogOpen} onClose={() => setCommentDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Comments</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", height: 400 }}>
          <List sx={{ flexGrow: 1, overflow: "auto" }}>
            {selectedPhotoComments.map((comment) => (
              <ListItem
                key={comment.KomentarID}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteComment(comment.KomentarID)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={comment.IsiKomentar}
                  secondary={`By: ${comment.User?.NamaLengkap || comment.NamaUser || "Unknown"}`}
                />
              </ListItem>
            ))}
          </List>
          <TextField
            fullWidth
            label="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            onClick={() => {
              handleAddComment();
              setSelectedPhotoComments((prevComments) => [
                ...prevComments,
                { KomentarID: Date.now(), IsiKomentar: newComment, User: { NamaLengkap: "You" } },
              ]);
              setNewComment("");
            }}
            variant="contained"
            sx={{ mt: 1, backgroundColor: bluegray[700], '&:hover': { backgroundColor: bluegray[500] } }}
          >
            Submit
          </Button>
        </DialogContent>
      </Dialog>


      {/* Dialog for Uploading Photo */}
      <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog}>
        <DialogTitle>Upload Photo</DialogTitle>
        <DialogContent sx={{ display: 'flex', overflowY: 'auto', maxHeight: '100vh' }}>
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed #ccc',
              padding: 2,
              width: '50%',
              marginRight: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <input {...getInputProps()} />
            <Typography>Drag & Drop Image Here</Typography>

            {newPhoto.preview && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  src={newPhoto.preview}
                  alt="Preview"
                  style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: 8 }}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ width: '50%' }}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={newPhoto.JudulFoto}
              onChange={(e) => setNewPhoto({ ...newPhoto, JudulFoto: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={newPhoto.DeskripsiFoto}
              onChange={(e) => setNewPhoto({ ...newPhoto, DeskripsiFoto: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog} color="primary">Cancel</Button>
          <Button onClick={handleUploadPhoto} color="primary">Upload</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Album</DialogTitle>
        <DialogContent>
          <TextField
            label="Album Name"
            variant="outlined"
            fullWidth
            value={albumData.NamaAlbum}
            onChange={(e) => setAlbumData({ ...albumData, NamaAlbum: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={albumData.Deskripsi}
            onChange={(e) => setAlbumData({ ...albumData, Deskripsi: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">Cancel</Button>
          <Button onClick={handleSaveAlbumChanges} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Feedback */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AlbumDetail;
