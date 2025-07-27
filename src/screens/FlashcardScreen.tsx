import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/axiosInstance';
import { useMockUser } from '../context/UserContext';
import styles from '../styles/flashcardStyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Flashcard'>;

import { addToWallet as addToWalletApi,
         updateWalletFlashcardStatus } from '../api/wallet';

type Flashcard = {
  id: number;
  word: string;
  definition: string;
  example: string;
  synonyms: string;
  phonetic: string;
  audioUrl: string;
  createdBy: number;
};

const FlashcardScreen = ({ route, navigation }: Props) => {
  const { topicId, topicName, flashcardId } = route.params;
  const { id: mockUserId } = useMockUser();

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPhonetic, setShowPhonetic] = useState(false);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await api.get(`api/topics/${topicId}/flashcards`);
        const data = response.data;
        setFlashcards(data);
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setCurrentCard(data[randomIndex]);
        }
      } catch (error) {
        console.error('Error loading flashcards:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, [topicId]);

  const handlePlayAudio = async () => {
    if (currentCard?.audioUrl) {
      const { sound } = await Audio.Sound.createAsync({ uri: currentCard.audioUrl });
      await sound.playAsync();
    }
  };

  const handleNext = () => {
    if (flashcards.length > 0) {
      const next = flashcards[Math.floor(Math.random() * flashcards.length)];
      setCurrentCard(next);
      setShowPhonetic(false);
    }
  };

  const handleDelete = async () => {
    if (currentCard?.createdBy !== mockUserId) {
      Alert.alert('Permission denied', 'Only your own flashcards can be deleted.');
      return;
    }
    try {
      await api.delete(`/flashcards/${currentCard.id}`);
      Alert.alert('Deleted', 'Flashcard was successfully deleted.');
      handleNext();
    } catch (error) {
      console.error('Delete error:', error);
      Alert.alert('Error', 'Could not delete flashcard.');
    }
  };

  const updateStatus = async (status: string) => {
    if (!currentCard) return;
    try {
      await updateWalletFlashcardStatus(currentCard.id, status);
      Alert.alert('Updated', `Flashcard marked as ${status}.`);
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', `Could not set status: ${status}`);
    }
  };

const addToWallet = async () => {
  if (!currentCard) return;
  try {
    await addToWalletApi(currentCard.id);
    Alert.alert('Added', 'Flashcard added to wallet.');
  } catch (error) {
    console.error('Wallet error:', error);
    Alert.alert('Error', 'Could not add flashcard to wallet.');
  }
};

  if (loading || !currentCard) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentCard.word}</Text>

      <View style={styles.card}>
        <TouchableOpacity
          style={styles.audioIcon}
          onPress={handlePlayAudio}
          onLongPress={() => setShowPhonetic(!showPhonetic)}
        >
          <Ionicons name="volume-high-outline" size={24} color="black" />
        </TouchableOpacity>

        {showPhonetic && <Text style={styles.phonetic}>{currentCard.phonetic}</Text>}
        <Text style={styles.definition}>{currentCard.definition}</Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={handleDelete}>
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={addToWallet}>
            <Text style={styles.actionText}>Add to Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => updateStatus('in_progress')}>
            <Text style={styles.actionText}>In Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => updateStatus('learned')}>
            <Text style={styles.actionText}>Learned</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.exampleBox}>
        <Text style={styles.exampleText}>Example: {currentCard.example}</Text>
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.navText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.navText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.navText}>?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.navText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FlashcardScreen;
