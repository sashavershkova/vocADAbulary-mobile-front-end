import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useMockUser } from '../context/UserContext';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';
import styles from '../styles/quizStyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import api from '../api/axiosInstance';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
  answers?: { text: string; correct: boolean }[];
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
    headerStyle: {
      backgroundColor: '#f7b4c4d6', 
    },
    headerTitleStyle: {
      fontFamily: 'ArchitectsDaughter-Regular',
      fontSize: 24,
      color: '#2c6f33', 
    },
    headerRight: () => (
      <View style={styles.initialsCircle}>
        <Text style={styles.initialsText}>{initials}</Text>
      </View>
    ),
  });
}, [navigation]);

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
          setQuizzes(shuffleArray(transformedQuizzes));
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
    <LinearGradient colors={['#f7b4c4d6', '#bf86fcc2']} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.questionButton}>
          <Text style={styles.questionText}>{currentQuiz.questionText}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.answersContainer}>
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
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navigationButton}>
            <Ionicons name="home" size={30} color="#2c6f33" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReset} style={styles.navigationButton}>
            <Ionicons name="refresh-circle" size={30} color="#2c6f33" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit} style={styles.navigationButton}>
            <Ionicons name="checkmark-circle" size={30} color="#2c6f33" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.navigationButton}>
            <Ionicons name="arrow-forward-circle" size={30} color="#2c6f33" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default QuizScreen;
