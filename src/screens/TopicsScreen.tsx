import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import styles from '../styles/topicsStyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { getAllTopics } from '../api/topics'; // ✅ Axios call
import { getFlashcardsByTopic } from '../api/flashcards';
import { useNavigationState } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Topics'>;

type Topic = {
  id: number;
  name: string;
};

const TopicsScreen = ({ navigation }: Props) => {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
          try {
            const data = await getAllTopics(); // ✅ Axios-based fetch
            setTopics(data);
          } catch (err) {
            console.error('Error fetching topics:', err);
          }
    };
    fetchTopics();
  }, []);

  const handleTopicPress = async (topicId: number, topicName: string) => {

    // console.log('📘 Load Flashcards from TopicScreen #1');

    try {
      const flashcards = await getFlashcardsByTopic(topicId);
      if (flashcards.length === 0) {
        Alert.alert('No flashcards found for this topic.');
        return;
      }
      const randomCard = flashcards[Math.floor(Math.random() * flashcards.length)];
      navigation.navigate('Flashcard', {
        flashcardId: randomCard.id,
        topicId,
        topicName,
      });
    } catch (err) {
      console.error('Error fetching flashcards:', err);
      Alert.alert('Failed to fetch flashcards');
    }
  };

  const renderTopic = ({ item }: { item: Topic }) => (
    <TouchableOpacity
      style={styles.topicBox}
      onPress={() => handleTopicPress(item.id, item.name)}
    >
      <Text style={styles.topicText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={topics}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTopic}
        contentContainerStyle={styles.topicList}
      />
    </View>
  );
};

export default TopicsScreen;