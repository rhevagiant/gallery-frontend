import api from '../../API/HttpClient';

export const getAllPhotos = async () => {
    try {
        const response = await api.get('/photo/allPhotos');
        return response.data.data; // Mengembalikan data foto saja
    } catch (error) {
        console.error('Error fetching photos:', error);
        throw error;
    }
};
