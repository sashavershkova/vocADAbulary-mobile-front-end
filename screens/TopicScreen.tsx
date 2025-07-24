import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import styles from '../styles/topicStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'Topic'>;

type Flashcard = {
  id: number;
  word: string;
  definition: string;
  example: string;
  synonyms: string;
  phonetic: string;
  audioUrl: string;
};

const TopicScreen = ({ route }: Props) => {
  const { topicId, topicName } = route.params;
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [randomCard, setRandomCard] = useState<Flashcard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/topics/${topicId}/flashcards`)
      .then(res => res.json())
      .then(data => {
        setFlashcards(data);
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setRandomCard(data[randomIndex]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching flashcards:', error);
        setLoading(false);
      });
  }, [topicId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={styles.loader} />;
  }

  if (!randomCard) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No flashcards available for this topic.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{topicName}</Text>

      <View style={styles.card}>
        <Text style={styles.word}>{randomCard.word}</Text>
        <Text style={styles.definition}>{randomCard.definition}</Text>
        <Text style={styles.example}>Example: {randomCard.example}</Text>
        <Text style={styles.synonyms}>Synonyms: {randomCard.synonyms}</Text>
        <Text style={styles.phonetic}>{randomCard.phonetic}</Text>
        {/* audioUrl can be used later for playing sound */}
      </View>
    </View>
  );
};

export default TopicScreen;