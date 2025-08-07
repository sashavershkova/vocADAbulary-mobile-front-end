import api from './axiosInstance';
import { Topic } from '../types/models';

export const getAllTopics = async (): Promise<Topic[]> => {
  const { data } = await api.get('/api/topics'); // make sure baseURL doesn't already have /api
  const arr = Array.isArray(data) ? data : Object.values(data ?? {});
  return arr.map((t: any) => ({
    id: t.id ?? t.topicId,
    name: t.name ?? t.topicName,
    createdAt: t.createdAt ?? t.created_at ?? null,
  })) as Topic[];
};