import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, List, ListItem, IconButton, ListItemText, Select } from '@mui/material';
import { getAllPhotos } from '../../store/endpoint/photo/AllPhoto';
import { getUserAlbums } from '../../store/endpoint/album/getAllAlbum';
import { uploadPhoto } from '../../store/endpoint/photo/uploadPhoto';
import { useDropzone } from 'react-dropzone';
import AddPhotoIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { bluegray } from '../../themes/color';
import Swal from 'sweetalert2';
import { deletePhoto } from '../../store/endpoint/photo/deletePhoto';
import { addCommentToPhoto, getCommentsByPhoto, deleteComment } from '../../store/endpoint/komentar/komentar';
import { Favorite, FavoriteBorderOutlined } from '@mui/icons-material';
import { likePhoto, getLikesByPhoto } from '../../store/endpoint/likes/likes';
import { useLike } from "../../context/likeContext";
import { movePhotoToAlbum } from '../../store/endpoint/photo/moveAlbum';
import CommentIcon from '@mui/icons-material/Comment';


const PhotoList = () => {
  const [photos, setPhotos] = useState([]);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [judulFoto, setJudulFoto] = useState('');
  const [deskripsiFoto, setDeskripsiFoto] = useState('');
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedPhotoComments, setSelectedPhotoComments] = useState([]);
  const { likedPhotos, likeCounts, toggleLike, setLikeCounts } = useLike();



  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await getAllPhotos();
        setPhotos(data);

        // Ambil jumlah likes untuk setiap foto
        const likeData = {};
        for (const photo of data) {
          const response = await getLikesByPhoto(photo.FotoID);
          likeData[photo.FotoID] = response.data.likeCount;
        }
        setLikeCounts(likeData);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };
    fetchPhotos();
  }, []);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const data = await getUserAlbums();
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
      toggleLike(fotoID); // Gunakan fungsi dari Context API
    } catch (error) {
      console.error("Error liking photo:", error);
    }
  };

  const handleMovePhoto = async (fotoID) => {
    try {
      await movePhotoToAlbum(fotoID, selectedAlbum);
      alert('Photo moved successfully');
    } catch (error) {
      alert('Failed to move photo');
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
            <Card sx={{ width: 250, height: 250, cursor: 'pointer' }} onClick={() => setSelectedPhoto(photo)}>
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
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton onClick={() => openCommentDialog(selectedPhoto)} sx={{ p: 1 }}>
                    <CommentIcon />
                  </IconButton>
                  <Select
                    value={selectedAlbum}
                    onChange={(e) => setSelectedAlbum(e.target.value)}
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    {albums.map((album) => (
                      <MenuItem key={album.AlbumID} value={album.AlbumID}>
                        {album.NamaAlbum}
                      </MenuItem>
                    ))}
                  </Select>
                  <Button onClick={() => handleMovePhoto(selectedPhoto.FotoID)} variant="contained" size="small">
                    Move
                  </Button>
                </Box>
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
    </Box >
  );
};

export default PhotoList;
