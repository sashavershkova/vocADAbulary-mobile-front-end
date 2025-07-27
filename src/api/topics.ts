import api from './axiosInstance';
import { Topic } from '../types/models';

export const getAllTopics = async (): Promise<Topic[]> => {
  const response = await api.get('/api/topics'); // ✅ just the relative path
  return response.data;
};