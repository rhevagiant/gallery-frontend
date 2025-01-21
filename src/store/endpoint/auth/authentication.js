import api from '../../API/HttpClient';

export const register = async (credentials) => {
  const response = await api.post('/auth/register', credentials, { withCredentials: true });
  return response.data;
};
// Login user
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials, { withCredentials: true });
  return response.data;
}; 

// Logout user
export const logout = async () => {
  await api.post('/auth/logout', {}, { withCredentials: true });
};

// Check session (user status)
export const checkSession = async () => {
  const response = await api.get('/auth/session', { withCredentials: true });
  return response.data;
};
