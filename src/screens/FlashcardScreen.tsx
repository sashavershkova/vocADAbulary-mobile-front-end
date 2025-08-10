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
  Pressable,
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
  createdBy: number | null;     
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
        fontFamily: 'ArchitectsDaughter',
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

    <View style={styles.container}>
      <View style={{ alignItems: 'center', justifyContent: 'center', height: 250 }}>
        <View style={{ width: 370, position: 'relative' }}>
          <View style={{ height: 250 }}>
            <Animated.View
              style={[
                styles.card,
                { backfaceVisibility: 'hidden', transform: [{ rotateY: frontInterpolate }] },
              ]}
              pointerEvents={flipped ? 'none' : 'auto'}
            >
              {topicName && <Text style={styles.topicLabelInside}>{topicName}</Text>}

              <Pressable style={styles.soundButtonTopRight} onPress={handlePlayAudio} hitSlop={10}>
                {({ pressed }) => (
                  <View style={[styles.iconButton, pressed && styles.iconButtonActive]}>
                    {ttsLoading ? (
                      <ActivityIndicator size="small" color="rgba(216, 129, 245, 1)" />
                    ) : (
                      <Ionicons name="volume-high" size={30} color="rgba(216, 129, 245, 1)" />
                    )}
                  </View>
                )}
              </Pressable>

              <TouchableOpacity
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                activeOpacity={1}
                onPress={flipCard}
              >
                <Text style={styles.word}>{currentCard.word}</Text>
                {currentCard?.phonetic && (
                  <Text style={styles.phoneticsUnder}>/{currentCard.phonetic}/</Text>
                )}
              </TouchableOpacity>

              <View style={styles.cardButtons}>
                <Pressable onPress={handleDelete} hitSlop={10}>
                  {({ pressed }) => (
                    <View style={[styles.iconButton, pressed && styles.iconButtonActive]}>
                      <Ionicons name="trash" size={30} color="rgba(216, 129, 245, 1)" />
                    </View>
                  )}
                </Pressable>

                <Pressable onPress={handleAddToWallet} hitSlop={10}>
                  {({ pressed }) => (
                    <View style={[styles.iconButton, pressed && styles.iconButtonActive]}>
                      <Ionicons name="wallet" size={30} color="rgba(216, 129, 245, 1)" />
                    </View>
                  )}
                </Pressable>

                <Pressable onPress={() => updateStatus('LEARNED')} hitSlop={10}>
                  {({ pressed }) => (
                    <View style={[styles.iconButton, pressed && styles.iconButtonActive]}>
                      <Ionicons name="checkmark-circle" size={30} color="rgba(216, 129, 245, 1)" />
                    </View>
                  )}
                </Pressable>
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.card,
                { position: 'absolute', top: 0, backfaceVisibility: 'hidden', transform: [{ rotateY: backInterpolate }] },
              ]}
              pointerEvents={flipped ? 'auto' : 'none'}
            >
              {topicName && <Text style={styles.topicLabelInside}>{topicName}</Text>}

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
        <Pressable onPress={() => setShowExample(!showExample)} hitSlop={10}>
          {({ pressed }) => (
            <View style={[styles.navIcon, pressed && styles.navIconActive]}>
              <Ionicons name="bulb" size={50} color="rgba(216, 129, 245, 1)" />
            </View>
          )}
        </Pressable>
        <Text style={[styles.navText, styles.hintText]}>HINT</Text>

        {showExample && (
          <View style={styles.exampleBubble}>
            <Text style={styles.exampleText}>
              Example:
              {'\n'}
              {currentCard.example}
              {currentCard.synonyms ? `\n\nSynonyms: ${currentCard.synonyms}` : ""}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.bottomBar}>
        <Pressable style={styles.navItem} onPress={() => navigation.navigate('Home')} hitSlop={10}>
          {({ pressed }) => (
            <>
              <View style={[styles.navIcon, pressed && styles.navIconActive]}>
                <Ionicons name="home" size={35} color="#8feda0ff" />
              </View>
              <Text style={styles.navText}>HOME</Text>
            </>
          )}
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => setSearchOpen(true)} hitSlop={10}>
          {({ pressed }) => (
            <>
              <View style={[styles.navIcon, pressed && styles.navIconActive]}>
                <Ionicons name="search-outline" size={35} color="#8feda0ff" />
              </View>
              <Text style={styles.navText}>SEARCH</Text>
            </>
          )}
        </Pressable>

        <Pressable onPress={handlePrev} hitSlop={10}>
          {({ pressed }) => (
            <>
              <View style={[styles.navIcon, pressed && styles.navIconActive]}>
                <Ionicons name="arrow-back-circle" size={35} color="#8feda0ff" />
              </View>
              <Text style={styles.navText}>BACK</Text>
            </>
          )}
        </Pressable>

        <Pressable onPress={handleNext} hitSlop={10}>
          {({ pressed }) => (
            <>
              <View style={[styles.navIcon, pressed && styles.navIconActive]}>
                <Ionicons name="arrow-forward-circle" size={35} color="#8feda0ff" />
              </View>
              <Text style={styles.navText}>NEXT</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  </LinearGradient>
);

};

export default FlashcardScreen;