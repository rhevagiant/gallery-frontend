import api from '../../API/HttpClient';

export const getAllAlbums = async () => {
    try {
        const response = await api.get('/album/allAlbum');
        return response.data.data; // Mengembalikan data album saja
    } catch (error) {
        console.error('Error fetching albums:', error);
        throw error;
    }
};

export const getAlbumByID = async (AlbumID) => {
    try {
        const response = await api.get(`/album/${AlbumID}`);
        return response?.data; // Mengembalikan data album saja
    } catch (error) {
        console.error('Error fetching albums:', error);
        throw error;
    }
};


export default { getAllAlbums, getAlbumByID };