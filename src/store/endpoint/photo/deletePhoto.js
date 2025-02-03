import api from '../../API/HttpClient';

export const deletePhoto = async (FotoID) => {
  try {
    const response = await api.delete(`/photo/deletePhoto/${FotoID}`);
    return response.data; // Return success message
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
};

