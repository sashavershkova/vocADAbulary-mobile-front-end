// src/api/wallet.ts
import api from "./axiosInstance";

// 1. Add a flashcard to the wallet
export const addToWallet = async (flashcardId: number) => {
  const response = await api.post(`/api/flashcards/${flashcardId}/wallet`);
  return response.data;
};

// 2. Remove a flashcard from the wallet
export const removeFromWallet = async (flashcardId: number) => {
  const response = await api.delete(`/api/flashcards/${flashcardId}/wallet`);
  return response.data;
};

// 3. Update flashcard status in the wallet
export const updateWalletFlashcardStatus = async (
  flashcardId: number,
  status: string
) => {
  const response = await api.put(`/api/flashcards/${flashcardId}/wallet`, {
    status,
  });
  return response.data;
};

// 4. Get all flashcards in the wallet (optionally filtered by status)
export const getWalletFlashcards = async (status?: string) => {
  const url = status
    ? `/api/flashcards/wallet?status=${status}`
    : `/api/flashcards/wallet`;

  const response = await api.get(url);
  return response.data;
};