import api from '../../API/HttpClient';

export const createAlbum = async (albumData) => {
    try {
        const response = await api.post('/album/createAlbum', albumData);
        return response.data.data; // Mengembalikan album yang baru dibuat
    } catch (error) {
        console.error('Error creating album:', error);
        throw error;
    }
};
