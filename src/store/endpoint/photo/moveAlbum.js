import api from '../../API/HttpClient';

export const movePhotoToAlbum = async (fotoID, newAlbumID) => {
    try {
        const response = await api.put(`/photo/${fotoID}/move`, { newAlbumID });
        return response.data;
    } catch (error) {
        console.error('Error moving photo:', error);
        throw error;
    }
};