import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const loginUser = async (username: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/login`, { username });
    return response.data; // should be { id, role }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};