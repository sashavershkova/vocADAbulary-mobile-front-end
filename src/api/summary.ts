import api from "./axiosInstance";

export const getUserProgressSummary = async (userId: number) => {
    const response = await api.get(`/api/users/${userId}/summary`);
    return response.data;
};