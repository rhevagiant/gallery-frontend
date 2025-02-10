import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, List, ListItem, IconButton, ListItemText } from '@mui/material';
import { getAllPhotos } from '../../store/endpoint/photo/AllPhoto';
import { getAllAlbums } from '../../store/endpoint/album/getAllAlbum';
import { uploadPhoto } from '../../store/endpoint/photo/uploadPhoto';
import { useDropzone } from 'react-dropzone';
import AddPhotoIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { bluegray } from '../../themes/color';
import Swal from 'sweetalert2';
import { deletePhoto } from '../../store/endpoint/photo/deletePhoto';
import { addCommentToPhoto, getCommentsByPhoto, deleteComment } from '../../store/endpoint/komentar/komentar';
import { DeleteOutline, Favorite, FavoriteBorderOutlined } from '@mui/icons-material';
import { likePhoto } from '../../store/endpoint/likes/likes';


const PhotoList = () => {
  const [photos, setPhotos] = useState([]);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [judulFoto, setJudulFoto] = useState('');
  const [deskripsiFoto, setDeskripsiFoto] = useState('');
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likedPhotos, setLikedPhotos] = useState({});


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

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const data = await getAllAlbums();
        setAlbums(data);
        if (data.length > 0) {
          setSelectedAlbum(data[0].AlbumID);
        }
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };
    fetchAlbums();
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFile(Object.assign(acceptedFiles[0], { preview: URL.createObjectURL(acceptedFiles[0]) }));
    },
  });

  const handleUpload = async () => {
    if (!file || !judulFoto || !selectedAlbum) {
      alert('Please complete all fields and select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('JudulFoto', judulFoto);
    formData.append('DeskripsiFoto', deskripsiFoto);
    formData.append('AlbumID', selectedAlbum);
    formData.append('image', file, file.name);  // Change 'file' to 'image'


    console.log('File sent:', formData.get('file'));

    try {
      const uploadedPhoto = await uploadPhoto(formData);
      setPhotos((prevPhotos) => [uploadedPhoto, ...prevPhotos]);
      setOpen(false);
      setFile(null);
      setJudulFoto('');
      setDeskripsiFoto('');
      setSelectedAlbum(albums.length > 0 ? albums[0].AlbumID : '');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo.');
    }
  };

  const handleDeletePhoto = async (fotoID) => {
    setSelectedPhoto(null);
    Swal.fire({
      title: 'Are you sure?',
      text: 'This photo will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePhoto(fotoID);
          setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.FotoID !== fotoID));
          setSelectedPhoto(null);
          Swal.fire('Deleted!', 'Your photo has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting photo:', error);
          Swal.fire('Error!', 'Failed to delete photo.', 'error');
        }
      }
    });
  };


  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const addedComment = await addCommentToPhoto(selectedPhoto.FotoID, newComment);
      setComments([...comments, addedComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter(comment => comment.KomentarID !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLikePhoto = async (fotoID) => {
    try {
      await likePhoto(fotoID);
      setLikedPhotos((prev) => ({ ...prev, [fotoID]: !prev[fotoID] }));
    } catch (error) {
      console.error('Error liking photo:', error);
    }
  };


  return (
    <Box sx={{ padding: 3, mt: 7 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          <strong>Photos</strong>
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)} sx={{
          backgroundColor: bluegray[700],
          color: 'white',
          ml: 2,
          '&:hover': { backgroundColor: bluegray[500] }
        }} startIcon={<AddPhotoIcon />}>
          Add Photo
        </Button>
      </Box>
      <Typography color="textSecondary" sx={{ mb: 6 }}>
        This all your photos
      </Typography>
      <Grid container spacing={3}>
        {photos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} key={photo.FotoID}>
            <Card sx={{ width: 200, height: 200, cursor: 'pointer' }} onClick={() => setSelectedPhoto(photo)}>
              <CardMedia
                component="img"
                image={photo.LokasiFile}
                alt={photo.JudulFoto}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

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
                  <Box>
                  <Button variant="outlined" color="error" onClick={() => handleDeletePhoto(selectedPhoto.FotoID)}>
                    <DeleteOutlineIcon />
                  </Button>
                </Box>
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Deskripsi:</strong> {selectedPhoto.DeskripsiFoto || 'Tidak ada deskripsi'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Foto ID: {selectedPhoto.FotoID}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <IconButton color="primary" onClick={() => handleLikePhoto(selectedPhoto.FotoID)}>
                    {likedPhotos[selectedPhoto.FotoID] ? <Favorite color="error" /> : <FavoriteBorderOutlined />}
                  </IconButton>
                </Box>
                <List>
                  {comments.map((comment) => (
                    <ListItem key={comment.KomentarID} secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteComment(comment.KomentarID)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    }>
                      <ListItemText primary={comment.IsiKomentar} secondary={`By: ${comment.User?.NamaLengkap || 'Unknown'}`} />
                    </ListItem>
                  ))}
                </List>
                <TextField fullWidth label="Add a comment" value={newComment} onChange={(e) => setNewComment(e.target.value)} sx={{ mt: 2 }} />
                <Button onClick={handleAddComment} variant="contained" sx={{ mt: 1 }}>Submit</Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog Upload Foto */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Upload Photo</DialogTitle>
        <DialogContent sx={{ display: 'flex', gap: 2 }}>
          <Box
            {...getRootProps()}
            sx={{ width: '50%', height: 200, border: '2px dashed gray', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
          >
            <input {...getInputProps()} />
            {file ? (
              <img src={file.preview} alt="Preview" width="100%" height="100%" style={{ objectFit: 'cover' }} />
            ) : (
              <Typography>Drag & drop an image here</Typography>
            )}
          </Box>
          <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Photo Name" fullWidth value={judulFoto} onChange={(e) => setJudulFoto(e.target.value)} />
            <TextField label="Description" fullWidth multiline rows={2} value={deskripsiFoto} onChange={(e) => setDeskripsiFoto(e.target.value)} />
            <TextField select label="Select Album" fullWidth value={selectedAlbum} onChange={(e) => setSelectedAlbum(e.target.value)}>
              {albums.map((album) => (
                <MenuItem key={album.AlbumID} value={album.AlbumID}>
                  {album.NamaAlbum}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleUpload} color="primary" variant="contained">Upload</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PhotoList;
