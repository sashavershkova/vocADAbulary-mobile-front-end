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
import styles from '../styles/topicsStyles';
import { RootStackParamList } from '../types/navigation';
import { getAllTopics } from '../api/topics';
import { getFlashcardsByTopic } from '../api/flashcards';
import TopicsButtons from '../buttons/TopicsButtons';
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
      headerRight: () => (
        <View style={styles.initialsCircle}>
        <Text style={styles.initialsText}>{initials}</Text>
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
    setActiveId(topicId);

    setTimeout(async () => {
      try {
        const flashcards = await getFlashcardsByTopic(topicId);
        if (flashcards.length === 0) {
          Alert.alert('Ooops! Could this be any more empty?');
          setActiveId(null);
          return;
        }

        const randomCard =
          flashcards[Math.floor(Math.random() * flashcards.length)];

        navigation.navigate('Flashcard', {
          flashcardId: randomCard.id,
          topicId,
          topicName,
        });
      } catch (err) {
        console.error('Error fetching flashcards:', err);
        Alert.alert('Failed to fetch flashcards');
      } finally {
        setActiveId(null);
      }
    }, 1500);
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
    <LinearGradient colors={['#2ecc71', '#f5f7648c']} style={{ flex: 1 }}>
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

      <TopicsButtons />
    </LinearGradient>
  );
};

export default TopicsScreen;
