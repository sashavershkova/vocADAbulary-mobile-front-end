import React, { useState, useEffect } from 'react';
import FallbackScreen from './FallbackScreen';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api/axiosInstance';
import styles from '../styles/constructorStyles';
// const ConstructorScreen = () => <FallbackScreen />;


const ConstructorScreen = () => {
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [sentence, setSentence] = useState<any>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch topics on mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.get('/api/topics');
        setTopics(res.data);
      } catch (err) {
        Alert.alert('Error', 'Failed to load topics.');
        console.error('Error fetching topics:', err);
      }
    };
    fetchTopics();
  }, []);

  // Fetch a random sentence by topic ID
  const fetchSentence = async (topicId: number) => {
    try {
      setLoading(true);
      console.log("📥 Fetching sentence for topic:", topicId);
      const res = await api.get(`/api/constructor/${topicId}/random`);
      setSentence(res.data);
      console.log("🧩 Received sentence ID:", res.data.sentenceId);
      setAnswers(Array(res.data.blanks.length).fill(''));
    } catch (err) {
      Alert.alert('Error', 'Failed to load sentence.');
      console.error('Error fetching sentence:', err);
    } finally {
      setLoading(false);
    }
  };

  // Submit answers to backend
  const submitAnswers = async () => {
    try {
      const res = await api.post('/api/constructor/validate', {
        sentenceId: sentence.sentenceId,
        answers,
      });
      if (res.data.correct) {
        Alert.alert('Correct!', 'Loading next sentence...');
        console.log("🔁 Fetching next sentence for topicId:", sentence.topicId);
        fetchSentence(sentence.topicId); // Use topic from sentence response
      } else {
        Alert.alert('Wrong', 'Try again?');
      }
    } catch (err) {
      Alert.alert('Error', 'Validation failed.');
      console.error('Error validating answers:', err);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Constructor Game</Text>

      <Picker
        selectedValue={selectedTopic}
        onValueChange={(value) => {
          if (value === null) return; // avoid 'undefined'
          setSelectedTopic(value);
          setSentence(null);
          fetchSentence(value);
        }}
      >
        <Picker.Item label="Choose a topic" value={null} />
        {topics.map((t) => (
          <Picker.Item key={t.id} label={t.name} value={t.id} />
        ))}
      </Picker>

      {sentence && (
        <>
          <Text style={styles.topicName}>
            {topics.find((t) => t.id === sentence.topicId)?.name}
          </Text>

          <Text style={styles.sentence}>{sentence.sentenceTemplate}</Text>

          {sentence.blanks.map((b: any, idx: number) => (
            <TextInput
              key={idx}
              style={styles.input}
              placeholder={`Blank ${b.index}`}
              value={answers[idx]}
              onChangeText={(text) => {
                const copy = [...answers];
                copy[idx] = text;
                setAnswers(copy);
              }}
            />
          ))}

          <TouchableOpacity
            style={[
              styles.button,
              answers.includes('') && { backgroundColor: '#aaa' },
            ]}
            onPress={submitAnswers}
            disabled={answers.includes('')}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default ConstructorScreen;
