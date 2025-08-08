import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  Modal,
  TextInput,
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
  createdBy: number | null;     // ⬅️ allow null (public card)
  phonetic?: string;
  synonyms?: string;
};

const filterVisible = (cards: Flashcard[], userId: number) =>
  cards.filter(c => c.createdBy == null || c.createdBy === userId);

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

  // --- Search modal states ---
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Flashcard[]>([]);

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
      headerStyle: { backgroundColor: '#abf5ab64' },
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

    const init = async () => {
      setLoading(true);
      try {
        if (passedFlashcards && Array.isArray(passedFlashcards) && passedFlashcards.length > 0) {
          // Filter the incoming deck so it's only public + mine
          const visible = filterVisible(passedFlashcards as Flashcard[], userId);

          if (visible.length === 0) {
            Alert.alert('Nothing to study', 'No visible cards for this topic.');
            navigation.goBack();
            return;
          }

          setFlashcards(visible);

          // Prefer the requested card if still visible; otherwise pick the first
          const candidate = visible.find(fc => fc.id === flashcardId) || visible[0];
          setCurrentCard(candidate);
        } else {
          // Fallback: fetch only the current card; block others' private cards
          const { data } = await api.get(`/api/flashcards/${flashcardId}`);
          const allowed = data.createdBy == null || data.createdBy === userId;

          if (!allowed) {
            Alert.alert('Not available', 'This card belongs to another user.');
            navigation.goBack();
            return;
          }

          setCurrentCard(data);
          setFlashcards([data]);
        }
      } catch (error) {
        console.error('Error loading flashcard(s):', error);
        Alert.alert('Error', 'Could not load flashcards.');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [route.params, userId, navigation]);

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

  // --- SEARCH (within current deck) ---
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    const q = query.toLowerCase();
    const results = flashcards.filter(fc =>
      fc.word.toLowerCase().includes(q) ||
      (fc.definition && fc.definition.toLowerCase().includes(q))
    );
    setSearchResults(results);
  };

  if (loading || !currentCard) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  return (
    <LinearGradient colors={['#abf5ab64', '#347134bc']} style={{ flex: 1 }}>
      {/* Search Modal */}
      <Modal
        visible={searchOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSearchOpen(false)}
      >
        <View style={styles.searchModalBackground}>
          <View style={styles.searchModalContainer}>
            <Text style={styles.searchModalTitle}>I'm looking for ...</Text>
            <TextInput
              placeholder="Type to search…"
              value={searchQuery}
              onChangeText={handleSearch}
              style={styles.searchInput}
              autoFocus
            />
            {searchResults.length === 0 && !!searchQuery && (
              <Text style={styles.noResultsText}>No cards found.</Text>
            )}
            {searchResults.map(card => (
              <TouchableOpacity
                key={card.id}
                onPress={() => {
                  setCurrentCard(card);
                  setShowExample(false);
                  setFlipped(false);
                  flipAnim.setValue(0);
                  setSearchOpen(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                style={styles.searchResultBox}
              >
                <Text style={styles.searchResultWord}>{card.word}</Text>
                <Text style={styles.searchResultDef}>
                  {card.definition?.slice(0, 40)}…
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setSearchOpen(false)}
              style={styles.searchCloseBtn}
            >
              <Ionicons name="close-circle" size={22} color="#767776ff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* End Search Modal */}

      <View style={styles.container}>
        {/* Topic label above card, top left */}
        {topicName && (
          <View style={styles.topicLabelContainer}>
            <Text style={styles.topicLabelText}>{topicName}</Text>
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
                  <Text style={styles.phoneticsText}>/{currentCard.phonetic}</Text>
                </View>
              )}
            </View>

            <View style={{ height: 250 }}>
              {/* Front */}
              <Animated.View
                style={[
                  styles.card,
                  { backfaceVisibility: 'hidden', transform: [{ rotateY: frontInterpolate }] },
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
                    <Ionicons name="trash" size={30} color="rgba(216, 129, 245, 1)" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleAddToWallet} activeOpacity={0.7}>
                    <Ionicons name="wallet" size={30} color="rgba(216, 129, 245, 1)" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => updateStatus('LEARNED')} activeOpacity={0.7}>
                    <Ionicons name="checkmark-circle" size={30} color="rgba(216, 129, 245, 1)" />
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
            <Text style={styles.navText, styles.hintText}>HINT</Text>
          </TouchableOpacity>
          {showExample && (
            <View style={styles.exampleBubble}>
              <Text style={styles.exampleText}>
                Example:
                {'\n'}
                {currentCard.example}
                {currentCard.synonyms
                  ? `\n\nSynonyms: ${currentCard.synonyms}`
                  : ""}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={35} color="#8feda0ff" />
            <Text style={styles.navText}>HOME</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setSearchOpen(true)}>
            <Ionicons name="search-outline" size={35} color="#8feda0ff" />
            <Text style={styles.navText}>SEARCH</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePrev}>
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