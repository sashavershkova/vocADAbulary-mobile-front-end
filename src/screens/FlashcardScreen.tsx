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
import { LinearGradient } from 'expo-linear-gradient';

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
    const toValue = flipped ? 0 : 180;
    Animated.spring(flipAnim, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 10,
    }).start();
    setFlipped(!flipped);
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
        setFlashcards(response.data);

        const { flashcardId } = route.params;
        const detailResponse = await api.get(`api/flashcards/${flashcardId}`);
        setCurrentCard(detailResponse.data);
      } catch (error) {
        console.error('Error loading flashcards:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, [topicId, route.params.flashcardId]);

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
    if (!currentCard) return;

try {
    // Call backend TTS endpoint
    const response = await api.get(
      `/api/flashcards/${currentCard.id}/tts`,
      { responseType: 'arraybuffer' } // Important for binary data
    );

    // Convert response bytes to base64
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    const fileUri = FileSystem.cacheDirectory + 'temp-audio.mp3';

    // Save to file
    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const info = await FileSystem.getInfoAsync(fileUri);
    if (info.exists) {
      console.log('File saved at:', info.uri, 'size:', info.size);
    } else {
      console.log('File not found at:', info.uri);
    }

    // Ensure audio mode
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    // Play it
    const { sound } = await Audio.Sound.createAsync(
      { uri: fileUri },
      { shouldPlay: true }
    );

    await sound.playAsync();
  } catch (err) {
    console.error('TTS playback error:', err);
    Alert.alert('Error', 'Could not generate audio');
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
    <LinearGradient
      colors={['#c1f7b5', '#e4ffb5']}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
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
            pointerEvents={flipped ? 'none' : 'auto'}
          >
            {/* Tap on the center to flip */}
            <TouchableOpacity
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              activeOpacity={1}
              onPress={flipCard}
            >
              <TouchableOpacity
                style={styles.soundButton}
                onPress={handlePlayAudio}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="volume-high-outline"
                  size={24}
                  color="rgba(216, 129, 245, 1)"
                />
              </TouchableOpacity>

              <Text style={styles.word}>{currentCard.word}</Text>
            </TouchableOpacity>

            {/* Buttons outside flip touch area */}
            <View style={styles.cardButtons}>
              <TouchableOpacity onPress={handleDelete} activeOpacity={0.7}>
                <Ionicons
                  name="trash-outline"
                  size={30}
                  color="rgba(216, 129, 245, 1)"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddToWallet} activeOpacity={0.7}>
                <Ionicons
                  name="wallet-outline"
                  size={30}
                  color="rgba(216, 129, 245, 1)"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => updateStatus('learned')} activeOpacity={0.7}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={30}
                  color="rgba(216, 129, 245, 1)"
                />
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
            pointerEvents={flipped ? 'auto' : 'none'}
          >
            <TouchableOpacity
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              activeOpacity={1}
              onPress={flipCard}
            >
              <TouchableOpacity
                style={styles.soundButton}
                onPress={handlePlayAudio}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="volume-high-outline"
                  size={30}
                  color="rgba(216, 129, 245, 1)"
                />
              </TouchableOpacity>
              <Text style={styles.definition}>{currentCard.definition}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.exampleSection}>
          <TouchableOpacity onPress={() => setShowExample(!showExample)}>
            <Ionicons name="bulb-outline" size={30} color="rgba(216, 129, 245, 1)" />
          </TouchableOpacity>
          {showExample && (
            <View style={styles.exampleBubble}>
              <Text style={styles.exampleText}>{currentCard.example}</Text>
            </View>
          )}
        </View>

        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="home" size={30} color="#246396" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="search-outline" size={30} color="#246396ff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext}>
            <Ionicons name="arrow-back-circle" size={30} color="#246396ff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext}>
            <Ionicons name="arrow-forward-circle" size={30} color="#246396ff" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default FlashcardScreen;

