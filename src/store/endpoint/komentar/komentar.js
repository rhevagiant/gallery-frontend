import api from '../../API/HttpClient';

export const addCommentToPhoto = async (photoId, comment) => {
    try {
        const response = await api.post(`/photo/${photoId}/comment`, { IsiKomentar: comment });
        return response.data;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

export const getCommentsByPhoto = async (photoId) => {
    try {
        const response = await api.get(`/photo/${photoId}/comments`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
};

export const deleteComment = async (commentId) => {
    try {
        const response = await api.delete(`/comment/${commentId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
};
