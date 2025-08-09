import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { useMockUser } from '../context/UserContext';
import { Image, View, Text, Animated, Alert, Pressable, ActivityIndicator } from 'react-native';
import styles from '../styles/quizStyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import api from '../api/axiosInstance';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// import greenstick from '../assets/images/greenstick.png';
import bluestick from '../assets/images/bluestick.png';
import PopoverHint from '../screens/PopoverHint';

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
  const [hintVisible, setHintVisible] = useState(false);
  const stickScale = React.useRef(new Animated.Value(1)).current;
  const isGreen = false;
  
  const { user } = useMockUser();
  const username = user.username;
  const initials = username?.charAt(0).toUpperCase() || '?';

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'QUIZ',
      // headerBackVisible: false,
      headerStyle: {
        backgroundColor: '#f9bcdeff',
      },
      headerTitleStyle: {
        fontFamily: 'ArchitectsDaughter',
        fontSize: 36,
        color: '#246396',
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
          source={bluestick} // всегда синий
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
  }, [navigation, hintVisible]);

  // Helper to shuffle arrays
  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // Helper to fetch and process quizzes
  const fetchAllQuizzes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/quizzes');
      if (!response.data || response.data.length === 0) {
        Alert.alert('No Quizzes', 'There are no quizzes available.');
        navigation.goBack();
      } else {
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
        setCurrentQuizIndex(0); // reset index after fetch
      }
      setSelectedAnswerId(null);
      setIsSubmitted(false);
    } catch (err) {
      console.error('Failed to load quizzes:', err);
      Alert.alert('Error', 'Failed to load quizzes.');
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  useEffect(() => {
    fetchAllQuizzes();
  }, [fetchAllQuizzes]);

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
    const isPassed = currentQuiz.answers?.[selectedAnswerId]?.correct || false;
    postQuizAttempt(currentQuiz.id, isPassed);
  };

  // NEW: handleNext now re-fetches quizzes when reaching the end
  const handleNext = async () => {
    const nextQuizIndex = currentQuizIndex + 1;
    if (nextQuizIndex < quizzes.length) {
      setCurrentQuizIndex(nextQuizIndex);
      setSelectedAnswerId(null);
      setIsSubmitted(false);
    } else {
      await fetchAllQuizzes();
      Alert.alert('🎉 Done!', 'You completed all available quizzes. Solved quizzes have been removed!');
    }
  };

  const handleReset = () => {
    setSelectedAnswerId(null);
    setIsSubmitted(false);
  };

  // ------ SPINNER while loading ------
  if (loading || !currentQuiz) {
    return (
      <LinearGradient colors={['#f7b4c4d6', '#bf86fcc2']} style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#f9bcdeff', '#bf86fcfe']} style={styles.container}>
      <View style={styles.questionButton}>
        <Text style={styles.questionText}>{currentQuiz.questionText}</Text>
      </View>

      <PopoverHint visible={hintVisible} onClose={() => setHintVisible(false)}>
        <Text style={styles.text}>
          Bazinga! You've entered the QUIZ Zone!{"\n\n"}
          Each card is a question to test your technical superpowers (or at least your memory).{"\n"}
          Your job? Pick the correct answer and try not to pull a Sheldon.{"\n\n"}
          Here's the twist:{"\n"}
          - Every word will appear twice throughout the quiz.{"\n"}
          - If you get it right both times — congrats, you're officially smarter than Raj before coffee.{"\n"}
          - Get it wrong? No worries. Even Leonard needed a second chance.{"\n\n"}
          Treat this like your own personal CERN, smashing answers together until brilliance appears.{"\n\n"}
          Let's see if your brain is more Sheldon or Penny today.{"\n"}
          Fun fact: Penny learned Java faster than Sheldon learned sarcasm.{"\n\n"}
          Good luck, genius!
        </Text>
      </PopoverHint>

      <View style={styles.answersContainer}>
        {currentQuiz.answers?.map((answer, index) => {
          const isSelected = selectedAnswerId === index;
          const isCorrect = !!answer.correct;

          return (
            <Pressable
              key={index}
              onPress={() => handleSelect(index)}
              disabled={isSubmitted} // после сабмита ответы не нажимаются
              style={({ pressed }) => [
                // базовое состояние кнопки-ответа
                styles.pillButton,
                // до сабмита: выделяем выбранный/нажимаемый вариант
                !isSubmitted && (isSelected || pressed) && styles.pillButtonActive,
                // после сабмита: показываем правильность
                isSubmitted && isCorrect && styles.correctAnswerBox,
                isSubmitted && isSelected && !isCorrect && styles.wrongAnswerBox,
              ]}
            >
              <Text style={styles.answerText}>{answer.text}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [styles.navIcon, pressed && styles.navIconActive]}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home" size={30} color="#97d0feff" />
          <Text style={styles.navText}>HOME</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.navIcon, pressed && styles.navIconActive]}
          onPress={handleReset}
        >
          <Ionicons name="refresh-circle" size={35} color="#97d0feff" />
          <Text style={styles.navText}>RESET</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.navIcon, pressed && styles.navIconActive]}
          onPress={handleSubmit}
        >
          <Ionicons name="checkmark-circle" size={35} color="#97d0feff" />
          <Text style={styles.navText}>SUBMIT</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.navIcon, pressed && styles.navIconActive]}
          onPress={handleNext}
        >
          <Ionicons name="arrow-forward-circle" size={35} color="#97d0feff" />
          <Text style={styles.navText}>NEXT</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );

};

export default QuizScreen;