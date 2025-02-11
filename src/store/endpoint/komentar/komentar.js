import api from '../../API/HttpClient';

export const addCommentToPhoto = async (photoId, comment) => {
    try {
        const response = await api.post(`/photo/${photoId}/addComment`, { IsiKomentar: comment });
        return response.data;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

export const getCommentsByPhoto = async (photoId) => {
    try {
        const response = await api.get(`/photo/${photoId}/allComments`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
};

export const deleteComment = async (KomentarID) => {
    try {
        const response = await api.delete(`/photo/${KomentarID}/deleteComment`);
        return response.data;
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
};

