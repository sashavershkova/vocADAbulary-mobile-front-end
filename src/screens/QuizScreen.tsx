import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import styles from '../styles/quizStyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import api from '../api/axiosInstance';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

type Quiz = {
  id: number;
  topicId: number | null;
  topicName: string;
  questions: {
    id: number;
    questionText: string;
    answers: {
      text: string;
      correct: boolean;
    }[];
  }[];
};

const QuizScreen = ({ navigation }: Props) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get('/api/quizzes');
        const shuffled = response.data.sort(() => Math.random() - 0.5);

        if (shuffled.length === 0) {
          Alert.alert('No Quizzes', 'There are no quizzes available.');
          navigation.goBack();
          return;
        }

        setQuizzes(shuffled);
        setCurrentQuizIndex(0);
        setCurrentQuestionIndex(0);
      } catch (err) {
        console.error('❌ Failed to load quizzes:', err);
      }
    };

    fetchQuizzes();
  }, []);

  const currentQuiz = quizzes[currentQuizIndex];
  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];

  const handleSelect = (answerIndex: number) => {
    if (!isAnswered) {
      setSelectedAnswerId(answerIndex);
      setIsAnswered(true);
    }
  };

  const handleNext = () => {
    if (!currentQuiz) return;

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < currentQuiz.questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      const nextQuizIndex = currentQuizIndex + 1;
      if (nextQuizIndex < quizzes.length) {
        setCurrentQuizIndex(nextQuizIndex);
        setCurrentQuestionIndex(0);
      } else {
        // All quizzes done — loop from beginning
        setCurrentQuizIndex(0);
        setCurrentQuestionIndex(0);
      }
    }

    setSelectedAnswerId(null);
    setIsAnswered(false);
  };

  const handleReset = () => {
    setSelectedAnswerId(null);
    setIsAnswered(false);
  };

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.termText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.termBox}>
        <Text style={styles.termText}>{currentQuestion.questionText}</Text>
      </View>

      {currentQuestion.answers.map((answer, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleSelect(index)}
          style={[
            styles.answerBox,
            isAnswered && answer.correct && styles.correctAnswerBox,
            isAnswered && selectedAnswerId === index && !answer.correct && styles.wrongAnswerBox,
          ]}
        >
          <Text style={styles.answerText}>{answer.text}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navButton}>
          <Text style={styles.buttonText}>⬅️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReset} style={styles.navButton}>
          <Text style={styles.buttonText}>🔁</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
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