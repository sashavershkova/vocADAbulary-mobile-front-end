import api from "./axiosInstance";

export type ProgressSummaryResponse = {
    totalCards: number;
    inProgressCards: number;
    learnedCards: number;
    termComprehension: string;
    canUseInLanguage: string;
    quizzesPassed: number;
    sentenceProficiency: number;
};

export const getUserProgressSummary = async (userId: number) => {
    const response = await api.get<ProgressSummaryResponse>(`/api/users/${userId}/summary`);
    return response.data;
};
