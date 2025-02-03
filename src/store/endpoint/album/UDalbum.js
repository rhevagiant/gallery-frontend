import api from '../../API/HttpClient';

export const deleteAlbum = async (albumID) => {
  try {
    const response = await api.delete(`/album/deleteAlbum/${albumID}`);
    return response.data; // Return success message
  } catch (error) {
    console.error('Error deleting album:', error);
    throw error;
  }
};

export const updateAlbum = async (albumID, albumData) => {
  try {
    const response = await api.put(`/album/updateAlbum/${albumID}`, albumData);
    return response.data; // Return updated album data
  } catch (error) {
    console.error('Error updating album:', error);
    throw error;
  }
};
