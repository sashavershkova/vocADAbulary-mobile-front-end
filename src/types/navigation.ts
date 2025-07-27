export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: { userId: number; username: string };
  Topics: undefined;
  Topic: { topicId: number; topicName: string };
  Flashcard: { flashcardId: number; topicId: number; topicName: string };
  Progress: undefined;
  Settings: undefined;
  Wallet: undefined;
  Fallback: undefined;
};
