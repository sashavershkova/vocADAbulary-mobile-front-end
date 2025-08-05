import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/topicsStyles';
import { RootStackParamList } from '../types/navigation';
import { getAllTopics } from '../api/topics';
import { getFlashcardsByTopic } from '../api/flashcards';
import { useMockUser } from '../context/UserContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Topics'>;

type Topic = {
  id: number;
  name: string;
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
  const { user } = useMockUser();
  const userId = user.id;
  const username = user.username;
  const initials = username?.charAt(0).toUpperCase() || '?';
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<number | null>(null);


  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'TOPICS',
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
    const fetchTopics = async () => {
      try {
        const data = await getAllTopics();
        setTopics(data);
      } catch (err) {
        console.error('Error fetching topics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const handleTopicPress = (topicId: number, topicName: string) => {
    console.log(`${new Date().toISOString()} 👆 Topic pressed: ${topicId} (${topicName})`);

    setActiveId(topicId);

    setTimeout(async () => {
      console.log(`${new Date().toISOString()} ⏳ Starting flashcard fetch for topic ${topicId}`);

      try {
        const fetchStart = Date.now();
        const flashcards = await getFlashcardsByTopic(topicId);
        const fetchDuration = Date.now() - fetchStart;

        console.log(`${new Date().toISOString()} 📥 Fetched ${flashcards.length} flashcards in ${fetchDuration} ms`);

        if (flashcards.length === 0) {
          console.log(`${new Date().toISOString()} ⚠️ No flashcards found`);
          Alert.alert('Ooops! Could this be any more empty?');
          setActiveId(null);
          return;
        }

        const randomCard =
          flashcards[Math.floor(Math.random() * flashcards.length)];
          console.log(`${new Date().toISOString()} 🎯 Random card selected: ${randomCard.id}`);

        console.log(`${new Date().toISOString()} ⏩ Navigating to Flashcard screen...`);
        navigation.navigate('Flashcard', {
          flashcardId: randomCard.id,
          topicId,
          topicName,
          flashcards, // Passing all flashcards for the topic
        });

      } catch (err) {
        console.error(`${new Date().toISOString()} ❌ Error fetching flashcards:`, err);
        console.error('Error fetching flashcards:', err);
        Alert.alert('Failed to fetch flashcards');
      } finally {
        console.log(`${new Date().toISOString()} ✅ Done handling topic press`);
        setActiveId(null);
      }
    }, 100);
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

  return (
    <LinearGradient colors={['#abf5ab64', '#347134bc']} style={{ flex: 1 }}>
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

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home" size={30} color="#8feda0ff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            console.log('Add button pressed (placeholder)');
            navigation.navigate('Fallback');
          }}
        >
          <Ionicons name="add-circle" size={35} color="#8feda0ff" />
          <Text style={styles.navText}>Add</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default TopicsScreen;
