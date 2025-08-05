import { Flashcard } from '../types/models';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: { userId: number; username: string };
  Topics: undefined;
  Topic: { topicId: number; topicName: string };
  Flashcard: { flashcardId: number; topicId: number; topicName: string; flashcards?: Flashcard[]; };
  Progress: { userId: number; username: string };
  Quiz: undefined;  // ✅ { topicId?: number };
  Settings: undefined;
  Constructor: undefined;
  Wallet: undefined;
  Fallback: undefined;
  LearnedCards: undefined; 
};