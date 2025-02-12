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

export const getLikesByPhoto = async (photoId) => {
    try {
        const response = await api.get(`/photo/${photoId}/allLikes`);
        return response.data;
    } catch (error) {
        console.error('Error fetching like count:', error);
        throw error;
    }
};

export const getLikedPhotos = async () => {
    try {
        const response = await api.get(`/photo/liked-photos`);
        return response.data;
    } catch (error) {
        console.error('Error fetching like count:', error);
        throw error;
    }
};

