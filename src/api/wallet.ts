// src/api/wallet.ts
import api from "./axiosInstance";

// 1. Add a flashcard to the wallet
export const addToWallet = async (flashcardId: number) => {
  const response = await api.post(`/api/flashcards/${flashcardId}/wallet`);
  return response.data;
};

// 2. Remove a flashcard from the wallet
export const removeFromWallet = async (userId: number, flashcardId: number) => {
  const response = await api.delete(`/api/users/${userId}/flashcards/${flashcardId}/wallet`);
  return response.data;
};

// 3. Update flashcard status in the wallet
export const updateWalletFlashcardStatus = async (
  userId: number,
  flashcardId: number,
  status: string
) => {
  const response = await api.put(
    `/api/users/${userId}/flashcards/${flashcardId}/status`,
    { status }
  );
  return response.data;
};

// 4. Get all flashcards in the wallet (optionally filtered by status)
export const getWalletFlashcards = async (userId: number, status?: string) => {
  const url = status
    ? `/api/users/${userId}/flashcards/wallet?status=${status}`
    : `/api/users/${userId}/flashcards/wallet`;

  const response = await api.get(url);
  return response.data;
};

// 5. Get learned flashcards
export const getLearnedFlashcards = async (userId: number) => {
  const response = await api.get(`/api/users/${userId}/flashcards/learned`);
  return response.data;
};

//  6. Hide flashcard completely
export const hideFlashcardCompletely = async (
  userId: number,
  flashcardId: number
) => {
  const response = await api.put(
    `/api/users/${userId}/flashcards/${flashcardId}/hide`,
    { status: "HIDDEN" }
  );
  return response.data;
};