// File: src/utils/ttsUtils.ts
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import api from '../api/axiosInstance';

const CACHE_DIR = FileSystem.documentDirectory + 'tts_cache/';

// Ensure cache folder exists
export const ensureCacheDirExists = async () => {
  const dir = await FileSystem.getInfoAsync(CACHE_DIR);
  if (!dir.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
  }
};

// Get file path for a given flashcard
export const getCachedAudioPath = (flashcardId: number) => {
  return `${CACHE_DIR}${flashcardId}.mp3`;
};

// Check if audio is cached
export const isAudioCached = async (flashcardId: number) => {
  const path = getCachedAudioPath(flashcardId);
  const fileInfo = await FileSystem.getInfoAsync(path);
  return fileInfo.exists;
};

// Download TTS audio from backend and cache it
export const fetchAndCacheTTS = async (flashcardId: number) => {
  const response = await api.get(`/api/flashcards/${flashcardId}/tts`, {
    responseType: 'arraybuffer',
  });
  const base64 = Buffer.from(response.data, 'binary').toString('base64');
  const path = getCachedAudioPath(flashcardId);
  await FileSystem.writeAsStringAsync(path, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return path;
};

// Play audio from local file
export const playTTS = async (path: string) => {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: false,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });

  const { sound } = await Audio.Sound.createAsync(
    { uri: path },
    { shouldPlay: true }
  );

  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.isLoaded && status.didJustFinish) {
      sound.unloadAsync();
    }
  });
};
