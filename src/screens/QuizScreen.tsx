import React, { useEffect, useState } from 'react';
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
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchAllQuizzes = async () => {
      try {
        const response = await api.get('/api/quizzes');
        if (!response.data || response.data.length === 0) {
          Alert.alert('No Quizzes', 'There are no quizzes available.');
          navigation.goBack();
        } else {
          const shuffledQuizzes = shuffleArray(response.data).map(quiz => ({
            ...quiz,
            questions: quiz.questions.map(question => ({
              ...question,
              answers: shuffleArray(question.answers), // shuffle answers per question
            })),
          }));
          setQuizzes(shuffledQuizzes);
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
  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];

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
        Alert.alert('🎉 Done!', 'You completed all quizzes. Restarting...');
        setCurrentQuizIndex(0);
        setCurrentQuestionIndex(0);
      }
    }

    setSelectedAnswerId(null);
    setIsSubmitted(false);
  };

  const handleReset = () => {
    setSelectedAnswerId(null);
    setIsSubmitted(false);
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

      {currentQuestion.answers.map((answer, index) => {
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