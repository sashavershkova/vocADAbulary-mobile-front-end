export type Topic = {
  id: number;
  name: string;
};

export type Flashcard = {
  id: number;
  question: string;
  answer: string;
  topicId: number;
  word: string;
};
export type User = {
  id: number;
  username: string;
  email: string;
};
