import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Animated, Image, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator, View, Modal, Pressable, TextInput, Keyboard } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/topicsStyles';
import { RootStackParamList } from '../types/navigation';
import { getAllTopics } from '../api/topics';
import { getFlashcardsByTopic, getAllFlashcards } from '../api/flashcards';
import { useMockUser } from '../context/UserContext';
import greenstick from '../assets/images/greenstick.png';
import PopoverHint from '../screens/PopoverHint';
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
  ['#b3e5f9ff', '#e3bef8ff'],
  ['#FFE8C2', '#FFC1C1'],
  ['#a0f5cdff', '#f6f690ff'],
  ['#C6F1F8', '#DFFFEA'],
  ['#ECD8FF', '#FFE5EC'],
];

const topicGradientsActive: [string, string][] = [
  ['#85d9eeff', '#a9f057ff'],
  ['#f6cb7cff', '#f29898ff'],
  ['#85f4cbff', '#c6fa72ff'],
  ['#e0f3f6ff', '#41faeaff'],
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

  // --- Search modal state ---
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
        fontSize: 36,
        color: '#2c6f33',
      },
      headerLeft: () => (
        <Pressable
          onPress={() => {
            Animated.sequence([
              Animated.timing(stickScale, { toValue: 0.5, duration: 100, useNativeDriver: true }), // сжать вдвое
              Animated.timing(stickScale, { toValue: 1.0, duration: 100, useNativeDriver: true }), // вернуть норму
            ]).start(() => setHintVisible(true));
          }}
          style={{ marginLeft: 16, padding: 2 }}
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
  }, [navigation, initials]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllTopics();
        console.log('[topics count]', data.length, data.slice(0, 3));
        setTopics(data);
      } catch (err) {
        console.error('Error fetching topics:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Load all cards when the search opens; 
  // filter out other users’ cards
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
        Alert.alert('Failed to fetch flashcards');
      } finally {
        setActiveId(null);
      }
    }, 100);
  };

  const openSearchResult = async (card: FlashcardLite) => {
    try {
      let topicId = card.topicId ?? null;
      let topicName = card.topicName ?? '';

      // If topicId wasn't in the search result, fetch the card detail to get it
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
          flashcards: deck, // full deck so NEXT/BACK/SEARCH work
        } as any);
      } else {
        // Fallback: no topic found, open single-card mode
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

    const gradient: string[] = isActive
      ? [...topicGradientsActive[index % topicGradientsActive.length]]
      : [...topicGradients[index % topicGradients.length]];

    const borderColor = isActive ? '#e8dbf8ff' : '#006400';

    return (
      <View style={styles.topicBoxWrapper}>
        <TouchableOpacity
          style={styles.topicTouchable}
          activeOpacity={0.9}
          onPress={() => handleTopicPress(item.id, item.name)}
        >
          <View style={isActive ? styles.topicShadowWrapper : undefined}>
            <LinearGradient
              colors={gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.topicBox, { borderColor }]}
            >
              <Text style={[styles.topicText, isActive && styles.topicTextActive]}>
                {item.name}
              </Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const filtered =
    searchQuery.trim().length < 2
      ? []
      : allMineOrPublic.filter((c) => {
        const q = searchQuery.toLowerCase();
        return (
          (c.word && c.word.toLowerCase().includes(q)) ||
          (c.definition && c.definition.toLowerCase().includes(q))
        );
      });

  return (
    <LinearGradient colors={['#abf5ab64', '#347134bc']} style={{ flex: 1 }}>
      <PopoverHint visible={hintVisible} onClose={() => setHintVisible(false)}>
        <Text style={styles.text}>
          Welcome to the word playground - FLASHCARDS!{"\n\n"}
          Pick a topic — any topic. Cards appear in random order.{"\n"}
          Learned cards graduate to Quiz & Phrase Lab. Save your faves to Wallet.{"\n\n"}
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
          />
        )}
      </View>

      {/* Bottom bar — SAME icon & style as Flashcard screen */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={35} color="#8feda0ff" />
          <Text style={styles.navText}>HOME</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setSearchOpen(true)}>
          <Ionicons name="search-outline" size={35} color="#8feda0ff" />
          <Text style={styles.navText}>SEARCH</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Fallback')}>
          <Ionicons name="add-circle" size={35} color="#8feda0ff" />
          <Text style={styles.navText}>ADD</Text>
        </TouchableOpacity>
      </View>

      {/* Search Modal */}
      <Modal
        visible={searchOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSearchOpen(false)}
      >
        <TouchableOpacity
          style={styles.searchModalBackground}
          activeOpacity={1}
          onPress={Keyboard.dismiss}
        >
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
            ) : filtered.length === 0 && searchQuery.trim().length >= 2 ? (
              <Text style={styles.noResultsText}>No cards found.</Text>
            ) : null}

            {filtered.map((card) => (
              <TouchableOpacity
                key={card.id}
                onPress={() => openSearchResult(card)}
                style={styles.searchResultBox}
                activeOpacity={0.8}
              >
                <Text style={styles.searchResultWord}>{card.word}</Text>
                {!!card.definition && (
                  <Text style={styles.searchResultDef} numberOfLines={2}>
                    {card.definition}
                  </Text>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setSearchOpen(false)}
              style={styles.searchCloseBtn}
            >
              <Ionicons name="close-circle" size={22} color="#767776ff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
};

export default TopicsScreen;