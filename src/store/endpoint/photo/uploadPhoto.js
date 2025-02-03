import api from '../../API/HttpClient';

export const uploadPhoto = async (formData) => {
    try {
        const response = await api.post('/photo/uploadPhoto', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.data; // Return uploaded photo data
    } catch (error) {
        console.error('Error uploading photo:', error);
        throw error;
    }
};
