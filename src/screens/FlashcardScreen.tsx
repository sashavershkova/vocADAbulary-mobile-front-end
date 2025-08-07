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
import { useMockUser } from '../context/UserContext';
import api from '../api/axiosInstance';
import { addToWallet, updateWalletFlashcardStatus } from '../api/wallet';
import styles from '../styles/flashcardStyles';
import { RootStackParamList } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ensureCacheDirExists,
  isAudioCached,
  fetchAndCacheTTS,
  getCachedAudioPath,
  playTTS,
} from '../utils/ttsUtils';

type Props = NativeStackScreenProps<RootStackParamList, 'Flashcard'>;

type Flashcard = {
  id: number;
  word: string;
  definition: string;
  example: string;
  audioUrl: string;
  createdBy: number;
  phonetic?: string;
  synonyms?: string;
};

const logTime = (label: string) => {
  const now = new Date();
  console.log(`${now.toISOString()} ⏱️ ${label}`);
};

console.log(`${new Date().toISOString()} 🧭 FlashcardScreen mounted`);

const FlashcardScreen = ({ route, navigation }: Props) => {
  const { topicId, topicName, flashcardId, flashcards: passedFlashcards } = route.params;
  const { user } = useMockUser();
  const userId = user.id;
  const initials = user.username?.charAt(0).toUpperCase() || '?';

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [loading, setLoading] = useState(true);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const flipAnim = useRef(new Animated.Value(0)).current;
  const hasEnsuredDir = useRef(false);

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
      headerStyle: {
        backgroundColor: '#abf5ab64',
      },
      headerTitleStyle: {
        fontFamily: 'ArchitectsDaughter-Regular',
        fontSize: 36,
        color: '#2c6f33',
      },
      headerRight: () => (
        <View style={styles.userWrapper}>
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{initials}</Text>
          </View>
          <Text style={styles.userLabel}>User</Text>
        </View>
      ),
    });
  }, [navigation, initials]);

  useEffect(() => {
    // Ensure the cache directory exists before anything else
    if (!hasEnsuredDir.current) {
      ensureCacheDirExists();
      hasEnsuredDir.current = true;
    }

    // If flashcards are passed from navigation, use them!
    if (passedFlashcards && Array.isArray(passedFlashcards) && passedFlashcards.length > 0) {
      setFlashcards(passedFlashcards);
      console.log('Flashcards array:', passedFlashcards);
      console.log('IDs:', passedFlashcards.map(f => f.id));
      const card = passedFlashcards.find(fc => fc.id === flashcardId) || passedFlashcards[0];
      setCurrentCard(card);
      setLoading(false);
    } else {
      // Fallback: fetch only the current card
      const fetchSingle = async () => {
        setLoading(true);
        try {
          const detailResponse = await api.get(`/api/flashcards/${flashcardId}`);
          setCurrentCard(detailResponse.data);
          setFlashcards([detailResponse.data]);
        } catch (error) {
          console.error('Error loading flashcard:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchSingle();
    }
  }, [route.params]);

  // Index helpers for navigation
  const getCurrentIndex = () =>
    flashcards.findIndex(fc => currentCard && fc.id === currentCard.id);

  const handleNext = () => {
    if (!currentCard || flashcards.length < 2) return;
    const idx = getCurrentIndex();
    const nextIdx = (idx + 1) % flashcards.length;
    setCurrentCard(flashcards[nextIdx]);
    setShowExample(false);
    setFlipped(false);
    flipAnim.setValue(0);
  };

  const handlePrev = () => {
    if (!currentCard || flashcards.length < 2) return;
    const idx = getCurrentIndex();
    const prevIdx = (idx - 1 + flashcards.length) % flashcards.length;
    setCurrentCard(flashcards[prevIdx]);
    setShowExample(false);
    setFlipped(false);
    flipAnim.setValue(0);
  };

  const handlePlayAudio = async () => {
    if (!currentCard) return;
    const flashcardId = currentCard.id;
    const audioPath = getCachedAudioPath(flashcardId);

    try {
      const cached = await isAudioCached(flashcardId);
      if (!cached) {
        await fetchAndCacheTTS(flashcardId);
      }
      await playTTS(audioPath);
    } catch (err) {
      console.error('TTS playback error:', err);
      Alert.alert('Error', 'Could not play pronunciation');
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
      await addToWallet(userId, currentCard.id);
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
      colors={['#abf5ab64', '#347134bc']}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* Topic label above card, top left */}
        {topicName && (
          <View style={{ 
            width: 370, // Same as card width
            alignItems: 'flex-start', 
            alignSelf: 'center',    // Center the container on the screen
            marginBottom: 4,
          }}>
            <Text style={{
              fontFamily: 'ArchitectsDaughter-Regular',
              fontSize: 20,
              color: '#2c6f33',
              opacity: 0.88,
              fontWeight: 'bold',
              marginLeft: 10,
              marginBottom: 3,
              textShadowColor: '#c0e3bf',
              textShadowRadius: 2,
              letterSpacing: 0.2,
            }}>
              {topicName}
            </Text>
          </View>
        )}

        {/* Card block below */}
        <View style={{ alignItems: 'center', justifyContent: 'center', height: 250 }}>
          <View style={{ width: '100%', maxWidth: 350, position: 'relative' }}>
            {/* Sound button + phonetics */}
            <View style={styles.soundWrapper}>
              <TouchableOpacity
                style={styles.soundButton}
                onPress={handlePlayAudio}
                activeOpacity={0.7}
              >
                {ttsLoading ? (
                  <ActivityIndicator size="small" color="rgba(216, 129, 245, 1)" />
                ) : (
                  <Ionicons name="volume-high" size={30} color="rgba(216, 129, 245, 1)" />
                )}
              </TouchableOpacity>
              {currentCard?.phonetic && (
                <View style={styles.phoneticsBlob}>
                  <Text style={styles.phoneticsText}>
                    /{currentCard.phonetic}
                  </Text>
                </View>
              )}
            </View>

            <View style={{ height: 250 }}>
              {/* Front */}
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
                <TouchableOpacity
                  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                  activeOpacity={1}
                  onPress={flipCard}
                >
                  <Text style={styles.word}>{currentCard.word}</Text>
                </TouchableOpacity>

                <View style={styles.cardButtons}>
                  <TouchableOpacity onPress={handleDelete} activeOpacity={0.7}>
                    <Ionicons
                      name="trash"
                      size={30}
                      color="rgba(216, 129, 245, 1)"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleAddToWallet} activeOpacity={0.7}>
                    <Ionicons
                      name="wallet"
                      size={30}
                      color="rgba(216, 129, 245, 1)"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => updateStatus('LEARNED')} activeOpacity={0.7}>
                    <Ionicons
                      name="checkmark-circle"
                      size={30}
                      color="rgba(216, 129, 245, 1)"
                    />
                  </TouchableOpacity>
                </View>
              </Animated.View>

              {/* Back */}
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
                  <Text style={styles.definition}>{currentCard.definition}</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>

        <View style={styles.exampleSection}>
          <TouchableOpacity onPress={() => setShowExample(!showExample)}>
            <Ionicons name="bulb" size={50} color="rgba(216, 129, 245, 1)" />
            <Text style={styles.navText}>HINT</Text>
          </TouchableOpacity>
          {showExample && (
            <View style={styles.exampleBubble}>
              <Text style={styles.exampleText}>
                Example:
                {"\n"}
                {currentCard.example}
                {currentCard.synonyms
                  ? `\n\nSynonyms:\n${currentCard.synonyms}`
                  : ""}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="home" size={35} color="#8feda0ff" />
            <Text style={styles.navText}>HOME</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search-outline" size={35} color="#8feda0ff" />
            <Text style={styles.navText}>SEARCH</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext}>
            <Ionicons name="arrow-back-circle" size={35} color="#8feda0ff" />
            <Text style={styles.navText}>BACK</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext}>
            <Ionicons name="arrow-forward-circle" size={35} color="#8feda0ff" />
            <Text style={styles.navText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default FlashcardScreen;