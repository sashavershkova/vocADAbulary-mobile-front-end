import api from './axiosInstance';

export const getFlashcardsByTopic = async (topicId: number) => {
    const response = await api.get(`/topics/${topicId}/flashcards`);
    return response.data;
};