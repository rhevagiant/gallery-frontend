import api from '../../API/HttpClient';

export const likePhoto = async (photoId) => {
    try {
        const response = await api.post(`/photo/${photoId}/like`);
        return response.data;
    } catch (error) {
        console.error('Error liking photo:', error);
        throw error;
    }
};
