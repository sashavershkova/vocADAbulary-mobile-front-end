import axios, { AxiosError } from 'axios';

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

// NEW: signUp function
export const signUpUser = async (username: string, email: string) => {
  try {
    console.log('Attempt signup:', { username, email });
    const response = await axios.post(
      `${API_URL}api/users/signup`,
      { username, email },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error: any) {
    // Type guard for AxiosError
    if (axios.isAxiosError(error) && error.response) {
      console.error('Signup error:', error.response.data);
    } else {
      console.error('Signup error:', error.message || error);
    }
    throw error;
  }
};