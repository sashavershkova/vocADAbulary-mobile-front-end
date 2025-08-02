import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useMockUser } from '../context/UserContext';
import api from '../api/axiosInstance';
import { addToWallet, updateWalletFlashcardStatus } from '../api/wallet';
import styles from '../styles/flashcardStyles';
import { RootStackParamList } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as FileSystem from 'expo-file-system';

type Props = NativeStackScreenProps<RootStackParamList, 'Flashcard'>;

type Flashcard = {
  id: number;
  word: string;
  definition: string;
  example: string;
  audioUrl: string;
  createdBy: number;
  audioBase64?: string;
};

const FlashcardScreen = ({ route, navigation }: Props) => {
  const { topicId } = route.params;
  const { user } = useMockUser();
  const userId = user.id;
  const initials = user.username?.charAt(0).toUpperCase() || '?';

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExample, setShowExample] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const flipAnim = useRef(new Animated.Value(0)).current;

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const flipCard = () => {
    if (!flipped) {
      Animated.spring(flipAnim, {
        toValue: 180,
        useNativeDriver: true,
        friction: 8,
        tension: 10,
      }).start();
      setFlipped(true);
    } else {
      Animated.spring(flipAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 10,
      }).start();
      setFlipped(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'FLASHCARDS',
      headerBackVisible: false,
      headerRight: () => (
        <View style={styles.initialsCircle}>
          <Text style={styles.initialsText}>{initials}</Text>
        </View>
      ),
    });
  }, [navigation, initials]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await api.get(`api/topics/${topicId}/flashcards`);
        const data = response.data;
        setFlashcards(data);
        
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          const randomId = data[randomIndex].id;

            // Fetch the full flashcard (with audioBase64) from the backend
          const detailResponse = await api.get(`/flashcards/${randomId}`);
          setCurrentCard(detailResponse.data);

            // Store all flashcards for navigation purposes
          setFlashcards(data);
        }
      } catch (error) {
        console.error('Error loading flashcards:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, [topicId]);

  const handleNext = () => {
    if (flashcards.length > 0) {
      const next = flashcards[Math.floor(Math.random() * flashcards.length)];
      setCurrentCard(next);
      setShowExample(false);
      setFlipped(false);
      flipAnim.setValue(0);
    }
  };

  const handlePlayAudio = async () => {
    if (currentCard?.audioBase64) {
      try {
        // Create a temporary mp3 file
        const fileUri = FileSystem.cacheDirectory + 'temp-audio.mp3';
        await FileSystem.writeAsStringAsync(fileUri, currentCard.audioBase64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const { sound } = await Audio.Sound.createAsync({ uri: fileUri });
        await sound.playAsync();
      } catch (err) {
        console.error('Audio playback error:', err);
      }
    } else {
      Alert.alert('No audio available');
    }
  };

  const handleDelete = async () => {
    if (currentCard?.createdBy !== userId) {
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
      await updateWalletFlashcardStatus(userId, currentCard.id, status);
      Alert.alert('Updated', `Flashcard marked as ${status}.`);
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', `Could not set status: ${status}`);
    }
  };

  const handleAddToWallet = async () => {
    if (!currentCard) return;
    try {
      await addToWallet(currentCard.id);
      Alert.alert('Added', 'Flashcard added to wallet.');
    } catch (error) {
      console.error('Wallet error:', error);
      Alert.alert('This flashcard is already in your wallet');
    }
  };

  if (loading || !currentCard) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={flipCard} activeOpacity={1}>
        <View style={{ alignItems: 'center', justifyContent: 'center', height: 250 }}>
          {/* Front Side */}
          <Animated.View
            style={[
              styles.card,
              {
                backfaceVisibility: 'hidden',
                transform: [{ rotateY: frontInterpolate }],
              },
            ]}
          >
            <TouchableOpacity style={styles.soundButton} onPress={handlePlayAudio}>
              <Ionicons name="volume-high-outline" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.word}>{currentCard.word}</Text>

            <View style={styles.cardButtons}>
              <TouchableOpacity onPress={handleDelete}>
                <Ionicons name="trash-outline" size={24} color="purple" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddToWallet}>
                <Ionicons name="wallet-outline" size={24} color="purple" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => updateStatus('learned')}>
                <Ionicons name="checkmark-circle-outline" size={24} color="purple" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Back Side */}
          <Animated.View
            style={[
              styles.card,
              {
                position: 'absolute',
                top: 0,
                backfaceVisibility: 'hidden',
                transform: [{ rotateY: backInterpolate }],
              },
            ]}
          >
            <TouchableOpacity style={styles.soundButton} onPress={handlePlayAudio}>
              <Ionicons name="volume-high-outline" size={24} color="" />
            </TouchableOpacity>
            <Text style={styles.definition}>{currentCard.definition}</Text>
          </Animated.View>
        </View>
      </TouchableOpacity>

      <View style={styles.exampleSection}>
        <TouchableOpacity onPress={() => setShowExample(!showExample)}>
          <Ionicons name="bulb-outline" size={30} color="green" />
        </TouchableOpacity>
        {showExample && (
          <View style={styles.exampleBubble}>
            <Text style={styles.exampleText}>{currentCard.example}</Text>
          </View>
        )}
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={30} color="green" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={30} color="green" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}>
          <Ionicons name="arrow-back-outline" size={30} color="green" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}>
          <Ionicons name="arrow-forward-outline" size={30} color="green" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FlashcardScreen;
