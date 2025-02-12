import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia, Grid, IconButton, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, TextField, Button } from '@mui/material';
import { Favorite, Comment as CommentIcon } from '@mui/icons-material';
import { getLikedPhotos } from '../../store/endpoint/likes/likes';
import { likePhoto } from '../../store/endpoint/likes/likes';
import { getCommentsByPhoto, addCommentToPhoto } from '../../store/endpoint/komentar/komentar';

const LikedPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedPhotoComments, setSelectedPhotoComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchLikedPhotos = async () => {
      try {
        const response = await getLikedPhotos();
        setPhotos(response.data);
      } catch (error) {
        console.error('Error fetching liked photos:', error);
      }
    };
    fetchLikedPhotos();
  }, []);

  const handleLikePhoto = async (fotoID) => {
    try {
      await likePhoto(fotoID);
      setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.FotoID !== fotoID));
    } catch (error) {
      console.error('Error liking photo:', error);
    }
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
    if (!newComment.trim() || !selectedPhoto) return;
    try {
      const addedComment = await addCommentToPhoto(selectedPhoto.FotoID, newComment);
      setSelectedPhotoComments((prevComments) => [...prevComments, addedComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <Box sx={{ padding: 3, mt: 7 }}>
      <Typography variant="h4" gutterBottom>
        <strong>Liked Photos</strong>
      </Typography>
      <Grid container spacing={3}>
        {photos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} key={photo.FotoID}>
            <Card sx={{ width: 250, height: 250, position: 'relative' }}>
              <CardMedia
                component="img"
                image={photo.LokasiFile}
                alt={photo.JudulFoto}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                <IconButton color="primary" onClick={() => handleLikePhoto(photo.FotoID)}>
                  <Favorite color="error" />
                </IconButton>
                <IconButton color="primary" onClick={() => openCommentDialog(photo)}>
                  <CommentIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog Komentar */}
      <Dialog open={commentDialogOpen} onClose={() => setCommentDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Comments</DialogTitle>
        <DialogContent>
          <List>
            {selectedPhotoComments.map((comment) => (
              <ListItem key={comment.KomentarID}>
                <ListItemText primary={comment.IsiKomentar} secondary={`By: ${comment.User?.NamaLengkap || 'Unknown'}`} />
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
          <Button onClick={handleAddComment} variant="contained" sx={{ mt: 1 }}>
            Submit
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LikedPhotos;
