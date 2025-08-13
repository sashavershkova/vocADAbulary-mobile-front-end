import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  Animated,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  View,
  Modal,
  Pressable,
  TextInput,
  Keyboard,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/topicsStyles';
import { RootStackParamList } from '../types/navigation';
import { getAllTopics } from '../api/topics';
import { getFlashcardsByTopic, getAllFlashcards } from '../api/flashcards';
import { useMockUser } from '../context/UserContext';
import greenstick from '../assets/images/greenstick.png';
import PopoverHint from './PopoverHint';
import api from '../api/axiosInstance';

type Props = NativeStackScreenProps<RootStackParamList, 'Topics'>;

type Topic = { id: number; name: string };

type FlashcardLite = {
  id: number;
  word: string;
  definition?: string;
  createdBy?: number | null;
  topicId?: number | null;
  topicName?: string | null;
};

const topicGradients: [string, string][] = [
  ['#b3e5f9c2', '#e3bef8bb'],
  ['#feffc2bc', '#ffc1c1b3'],
  ['#a0f5cdc4', '#f6f690c7'],
  ['#b1f0fac2', '#8cf9b2c0'],
  ['#d8b5f8b7', '#f9c2d1a5'],
];

const topicGradientsActive: [string, string][] = [
  ['#85d9eeff', '#a9f057ff'],
  ['#f8cb76ff', '#f88484ff'],
  ['#85f4cbff', '#c6fa72ff'],
  ['#9eebf7ff', '#41fa97ff'],
  ['#b295f1ff', '#f5a995ff'],
];

const TopicsScreen = ({ navigation }: Props) => {
  const [hintVisible, setHintVisible] = useState(false);
  const stickScale = React.useRef(new Animated.Value(1)).current;

  const { user } = useMockUser();
  const userId = user.id;
  const initials = user.username?.charAt(0).toUpperCase() || '?';

  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<number | null>(null);

  // Search modal
  const [searchOpen, setSearchOpen] = useState(false);
  const [allMineOrPublic, setAllMineOrPublic] = useState<FlashcardLite[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBusy, setSearchBusy] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'TOPICS',
      headerBackVisible: false,
      headerStyle: { backgroundColor: '#abf5ab64' },
      headerTitleStyle: {
        fontFamily: 'ArchitectsDaughter',
        fontSize: 40,
        color: '#2c6f33',
      },
      headerLeft: () => (
        <Pressable
          onPress={() => {
            Animated.sequence([
              Animated.timing(stickScale, { toValue: 0.5, duration: 100, useNativeDriver: true }),
              Animated.timing(stickScale, { toValue: 1.0, duration: 100, useNativeDriver: true }),
            ]).start(() => setHintVisible(true));
          }}
          style={{ marginLeft: 16, padding: 2, marginTop: -5 }}
        >
          <Animated.Image
            source={greenstick}
            style={{ width: 30, height: 50, transform: [{ scale: stickScale }] }}
          />
        </Pressable>
      ),
      headerRight: () => (
        <View style={styles.userWrapper}>
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{initials}</Text>
          </View>
          <Text style={styles.userLabel}>User</Text>
        </View>
      ),
    });
  }, [navigation, initials, stickScale]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllTopics();
        setTopics(data);
      } catch (err) {
        console.error('Error fetching topics:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!searchOpen) {
      setSearchQuery('');
      setAllMineOrPublic([]);
      setSearchBusy(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setSearchBusy(true);
      try {
        const all = (await getAllFlashcards()) as FlashcardLite[];
        const visible = all.filter((c) => c.createdBy == null || c.createdBy === userId);
        if (!cancelled) setAllMineOrPublic(visible);
      } catch (e) {
        console.error('Search load failed:', e);
        if (!cancelled) setAllMineOrPublic([]);
      } finally {
        if (!cancelled) setSearchBusy(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchOpen, userId]);

  const handleTopicPress = (topicId: number, topicName: string) => {
    setActiveId(topicId);
    setTimeout(async () => {
      try {
        const flashcards = await getFlashcardsByTopic(topicId);
        if (flashcards.length === 0) {
          Alert.alert('Ooops! Could this be any more empty?');
          setActiveId(null);
          return;
        }
        const randomCard = flashcards[Math.floor(Math.random() * flashcards.length)];
        navigation.navigate('Flashcard', {
          flashcardId: randomCard.id,
          topicId,
          topicName,
          flashcards,
        } as any);
      } catch (err) {
        console.error('Error fetching flashcards:', err);
      } finally {
        setActiveId(null);
      }
    }, 100);
  };

  const openSearchResult = async (card: FlashcardLite) => {
    try {
      let topicId = card.topicId ?? null;
      let topicName = card.topicName ?? '';

      if (!topicId || topicId <= 0) {
        try {
          const { data } = await api.get(`/api/flashcards/${card.id}`);
          topicId = data.topic?.id ?? data.topicId ?? null;
          topicName = topicName || data.topic?.name || '';
        } catch (err) {
          console.error(`Failed to fetch topic for card ${card.id}:`, err);
        }
      }

      if (topicId && topicId > 0) {
        const deck = await getFlashcardsByTopic(topicId);
        navigation.navigate('Flashcard', {
          flashcardId: card.id,
          topicId,
          topicName,
          flashcards: deck,
        } as any);
      } else {
        navigation.navigate('Flashcard', {
          flashcardId: card.id,
          topicId: -1,
          topicName: '',
          singleCardMode: true,
        } as any);
      }
    } finally {
      setSearchOpen(false);
    }
  };

  const renderTopic = ({ item, index }: { item: Topic; index: number }) => {
    const isActive = activeId === item.id;

    const idleGradient = topicGradients[index % topicGradients.length];
    const activeGradient = topicGradientsActive[index % topicGradientsActive.length];

    const idleBorder = '#00640064';
    const activeBorder = '#e8dbf8ff';

    return (
      <Pressable
        hitSlop={10}
        onPress={() => handleTopicPress(item.id, item.name)}
        style={({ pressed }) => [
          styles.topicBoxWrapper,
          (pressed || isActive) && styles.topicScaleActive,
          (pressed || isActive) && styles.topicShadowActive,
        ]}
      >
        {({ pressed }) => {
          const showActive = pressed || isActive;
          const colors = showActive ? activeGradient : idleGradient;
          const borderColor = showActive ? '#FFFFFF' : (isActive ? activeBorder : idleBorder);

          return (
            <LinearGradient
              colors={colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.pillButton,
                { borderColor },
                pressed && styles.pillButtonActiveBorder,
              ]}
            >
              <Text
                style={[styles.topicText, showActive && styles.topicTextActive]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.name}
              </Text>
            </LinearGradient>
          );
        }}
      </Pressable>
    );
  };

  // Only search in the flashcard "word" field (case-insensitive)
  const filtered =
    searchQuery.trim().length === 0
      ? []
      : allMineOrPublic.filter((c) => {
          const q = searchQuery.trim().toLowerCase();
          const w = (c.word ?? "").toLowerCase();
          return w.includes(q);
        });

    // Limit results to 7
  const MAX_RESULTS = 7;
  const shown = filtered.slice(0, MAX_RESULTS);

  return (
    <LinearGradient colors={['#abf5ab64', '#347134bc']} style={{ flex: 1 }}>
      <PopoverHint visible={hintVisible} onClose={() => setHintVisible(false)}>
        <Text style={styles.text}>
          Welcome to the word playground, ADIE!{"\n\n"}
          Pick a *TOPIC* — any topic. Each one's a wormhole into tech vocabulary.{"\n"}
          Cards appear in random order, just like Sheldon's emotions.{"\n\n"}

          Not sure how to say the word? Hit *SOUND* — it's like Raj reading bedtime stories.{"\n"}
          Still confused? Tap the *HINT*. Think of it as Leonard patiently explaining to Penny.{"\n"}
          Still lost? FLIP the card like you're flipping universes in string theory.{"\n\n"}

          All words start *In Progress* — kind of like Howard's mustache.{"\n"}
          Once you mark a word as *Learned*, it joins the *OUIZ* and *CONSTRUCTOR* for its final showdown.{"\n"}
          Fell in love with a word? *SAVE* it to your *WALLET* and whisper sweet nothings to it later.{"\n\n"}

          Ready to study like Sheldon, struggle like Leonard, and shine like Penny on trivia night?{"\n"}
          Bazinga awaits.
        </Text>
      </PopoverHint>

      <View style={{ flex: 1, paddingBottom: 70 }}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          <FlatList
            data={topics}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTopic}
            contentContainerStyle={styles.topicList}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', paddingBottom: 16 }}
          />
        )}
      </View>

      <View style={styles.bottomBar}>
        <Pressable style={styles.navItem} onPress={() => navigation.navigate('Home')} hitSlop={10}>
          {({ pressed }) => (
            <>
              <View style={[styles.navIconCircle, pressed && styles.navIconActive]}>
                <Ionicons name="home" size={35} color="#8feda0ff" />
              </View>
              <Text style={styles.navText}>HOME</Text>
            </>
          )}
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => setSearchOpen(true)} hitSlop={10}>
          {({ pressed }) => (
            <>
              <View style={[styles.navIconCircle, pressed && styles.navIconActive]}>
                <Ionicons name="search-outline" size={35} color="#8feda0ff" />
              </View>
              <Text style={styles.navText}>SEARCH</Text>
            </>
          )}
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => navigation.navigate('Fallback')} hitSlop={10}>
          {({ pressed }) => (
            <>
              <View style={[styles.navIconCircle, pressed && styles.navIconActive]}>
                <Ionicons name="add-circle" size={35} color="#8feda0ff" />
              </View>
              <Text style={styles.navText}>ADD</Text>
            </>
          )}
        </Pressable>
      </View>

      <Modal
        visible={searchOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSearchOpen(false)}
      >
        <Pressable style={styles.searchModalBackground} onPress={Keyboard.dismiss}>
          <View style={styles.searchModalContainer}>
            <Text style={styles.searchModalTitle}>I'm looking for ...</Text>

            <TextInput
              placeholder="Type to search…"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              placeholderTextColor="#767776ff"
              autoFocus
            />

            {searchBusy ? (
              <ActivityIndicator size="large" color="#2c6f33" style={{ marginTop: 10 }} />
            ) : shown.length === 0 && searchQuery.trim().length > 0 ? (
              <Text style={styles.noResultsText}>No cards found.</Text>
            ) : null}

            {/* results list */}
            {shown.map((card) => (
              <Pressable
                key={card.id}
                onPress={() => openSearchResult(card)}
                style={styles.searchResultBox}
              >
                <Text style={styles.searchResultWord}>{card.word}</Text>
                {!!card.definition && (
                  <Text style={styles.searchResultDef} numberOfLines={2}>
                    {card.definition}
                  </Text>
                )}
              </Pressable>
            ))}

            <Pressable onPress={() => setSearchOpen(false)} style={styles.searchCloseBtn}>
              <Ionicons name="close-circle" size={22} color="#767776ff" />
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
};

export default TopicsScreen;
