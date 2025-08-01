import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useMockUser } from '../context/UserContext';
import { View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import styles from '../styles/quizStyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import api from '../api/axiosInstance';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

type Quiz = {
  id: number;
  topicId: number;
  topicName: string;
  questionText: string;
  correctAnswer: string;
  wrongAnswer1: string;
  wrongAnswer2: string;
  wrongAnswer3: string;
  answers?: { text: string; correct: boolean }[]; // added after transform
};

const QuizScreen = ({ navigation }: Props) => {
  const { user } = useMockUser();
  const username = user.username;
  const initials = username?.charAt(0).toUpperCase() || '?';

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'QUIZ',
      headerBackVisible: false,
      headerRight: () => (
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: '#75f96cff',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}
        >
          <Text
            style={{
              color: '#2c6f33ff',
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            {initials}
          </Text>
        </View>
      ),
    });
  }, [navigation, initials]);

  useEffect(() => {
    const fetchAllQuizzes = async () => {
      try {
        const response = await api.get('/api/quizzes');
        if (!response.data || response.data.length === 0) {
          Alert.alert('No Quizzes', 'There are no quizzes available.');
          navigation.goBack();
        } else {
          const transformedQuizzes = response.data.map((quiz: Quiz) => ({
            ...quiz,
            answers: shuffleArray([
              { text: quiz.correctAnswer, correct: true },
              { text: quiz.wrongAnswer1, correct: false },
              { text: quiz.wrongAnswer2, correct: false },
              { text: quiz.wrongAnswer3, correct: false },
            ]),
          }));
          setQuizzes(shuffleArray(transformedQuizzes)); // shuffle quizzes too
        }
      } catch (err) {
        console.error('Failed to load quizzes:', err);
      }
    };

    fetchAllQuizzes();
  }, []);

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const currentQuiz = quizzes[currentQuizIndex];

  const handleSelect = (answerIndex: number) => {
    if (!isSubmitted) {
      setSelectedAnswerId(answerIndex);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswerId === null) return;
    setIsSubmitted(true);
  };

  const handleNext = () => {
    const nextQuizIndex = currentQuizIndex + 1;
    if (nextQuizIndex < quizzes.length) {
      setCurrentQuizIndex(nextQuizIndex);
    } else {
      Alert.alert('🎉 Done!', 'You completed all quizzes. Restarting...');
      setCurrentQuizIndex(0);
    }
    setSelectedAnswerId(null);
    setIsSubmitted(false);
  };

  const handleReset = () => {
    setSelectedAnswerId(null);
    setIsSubmitted(false);
  };

  if (!currentQuiz) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.termText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.termBox}>
        <Text style={styles.termText}>{currentQuiz.questionText}</Text>
      </View>

      {currentQuiz.answers?.map((answer, index) => {
        const isSelected = selectedAnswerId === index;
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleSelect(index)}
            style={[
              styles.answerBox,
              !isSubmitted && isSelected && styles.selectedAnswerBox,
              isSubmitted && answer.correct && styles.correctAnswerBox,
              isSubmitted && isSelected && !answer.correct && styles.wrongAnswerBox,
            ]}
          >
            <Text style={styles.answerText}>{answer.text}</Text>
          </TouchableOpacity>
        );
      })}

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navButton}>
          <Text style={styles.buttonText}>⬅️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReset} style={styles.navButton}>
          <Text style={styles.buttonText}>🔁</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit} style={styles.navButton}>
          <Text style={styles.buttonText}>✅</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.navButton}>
          <Text style={styles.buttonText}>➡️</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default QuizScreen;