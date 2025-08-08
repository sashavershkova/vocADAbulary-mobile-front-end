// src/types/sentences.ts
export type TemplateResponseWithBlank = {
    id: number;
    templateText: string;
    source: string;
    contextTopic: string | null;
    createdAt: string;        // ISO string from backend Instant
    flashcardId: number;
    blankIndex: number;
};

export type Chunk = {
    type: 'text' | 'blank';
    value: string | null;
    blankIndex: number | null;
    reveal: boolean | null;
    revealedWord?: string | null;
};

export type PrepareSentenceResponse = {
    templateId: number;
    chunks: Chunk[];
};

export type FinalizeSentenceRequest = {
    templateId: number;
    answers: { blankIndex: number; typedWord: string }[];
};

export type PerBlank = {
    blankIndex: number;
    isCorrect: boolean;
    reveal: boolean;
    revealedWord?: string | null;
};

export type FinalizeSentenceResponse = {
    attemptId: number;
    finalText: string;
    allCorrect: boolean;
    perBlank: PerBlank[];
};
