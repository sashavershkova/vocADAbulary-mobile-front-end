import api from './axiosInstance';

export const getFlashcardsByTopic = async (topicId: number) => {
  const response = await api.get(`/api/topics/${topicId}/flashcards`);
  return response.data;
};

export const getAllFlashcards = async () => {
  const res = await api.get('/api/flashcards');
  return res.data;
};