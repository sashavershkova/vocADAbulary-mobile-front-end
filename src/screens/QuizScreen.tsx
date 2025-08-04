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
  hidden: boolean;
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
        fontSize: 36,
        color: '#246396',
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
  }, [navigation]);

  useEffect(() => {
    const fetchAllQuizzes = async () => {
      try {
        const response = await api.get('/api/quizzes');
        if (!response.data || response.data.length === 0) {
          Alert.alert('No Quizzes', 'There are no quizzes available.');
          navigation.goBack();
        } else {
          // 🔽 Filter out hidden quizzes here
          const visibleQuizzes = response.data.filter((quiz: Quiz) => !quiz.hidden);

          const transformedQuizzes = visibleQuizzes.map((quiz: Quiz) => ({
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

  const postQuizAttempt = async (quizId: number, isPassed: boolean) => {
    try {
      await api.post('/api/quiz-attempts', {
        quizId: quizId,
        is_passed: isPassed,
      });
      // Optional: handle success, e.g., show a toast
    } catch (error) {
      console.error('Failed to post quiz attempt:', error);
      // Optional: show error to user
    }
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

    // Figure out if user answered correctly
    const isPassed = currentQuiz.answers?.[selectedAnswerId]?.correct || false;

    // Post the attempt to the backend
    postQuizAttempt(currentQuiz.id, isPassed);
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
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="home" size={30} color="#97d0feff" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReset} style={styles.navigationButton}>
            <Ionicons name="refresh-circle" size={35} color="#97d0feff" />
            <Text style={styles.navText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit} style={styles.navigationButton}>
            <Ionicons name="checkmark-circle" size={35} color="#97d0feff" />
            <Text style={styles.navText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.navigationButton}>
            <Ionicons name="arrow-forward-circle" size={35} color="#97d0feff" />
            <Text style={styles.navText}>Forward</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default QuizScreen;
