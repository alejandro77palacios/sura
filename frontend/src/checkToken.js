import axios from 'axios';

const checkToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const response = await axios.post('/api/token/verify/', { token });
    return response.status === 200;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/api/token/refresh/', { refresh: refreshToken });
        localStorage.setItem('token', response.data.access);
        return true;
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        return false;
      }
    }
    console.error('Error verifying token:', error);
    return false;
  }
};

export default checkToken;