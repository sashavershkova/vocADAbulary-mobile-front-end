import api from './axiosInstance';

// export type UpdateStatusResponse = {
//     message: string;
//     sentenceGenerated?: string | boolean; // backend returns string "true"/"false"
// };

// export async function updateFlashcardStatus(
//     userId: number,
//     flashcardId: number,
//     status: 'IN_PROGRESS' | 'LEARNED' | string
// ): Promise<{ message: string; sentenceGenerated?: boolean | string }> {
//     const res = await api.put<UpdateStatusResponse>(
//         `/api/users/${userId}/flashcards/${flashcardId}/status`,
//         { status }
//     );

//     const raw = res.data?.sentenceGenerated;
//     const sentenceGenerated =
//         typeof raw === 'boolean'
//             ? raw
//             : typeof raw === 'string'
//             ? raw.toLowerCase() === 'true'
//             : false;

//     return {
//         message: res.data?.message ?? 'Status updated',
//         sentenceGenerated,
//     };
// }


export async function updateFlashcardStatus(
  userId: number,
  flashcardId: number,
  status: 'IN_PROGRESS' | 'LEARNED' | string
): Promise<{ message: string; sentenceGenerated?: boolean | string }> {
  const { data } = await api.put(`/api/users/${userId}/flashcards/${flashcardId}/status`, {
    status,
  });
  return {
    message: data?.message ?? 'Status updated',
    sentenceGenerated: data?.sentenceGenerated,
  };
}