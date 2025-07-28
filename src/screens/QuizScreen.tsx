import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import styles from '../styles/quizStyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

const QuizScreen = ({ navigation }: Props) => {
  const question = {
    term: "BOOLEAN",
    answers: [
      { id: 1, text: "A data type with only two possible values", correct: true },
      { id: 2, text: "A loop that never ends", correct: false },
      { id: 3, text: "A function that returns a number", correct: false },
      { id: 4, text: "A type of API call", correct: false },
    ],
  };

  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (answerId: number) => {
    if (!isAnswered) {
      setSelectedAnswerId(answerId);
      setIsAnswered(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.termBox}>
        <Text style={styles.termText}>{question.term}</Text>
      </View>

      {question.answers.map((answer) => (
        <TouchableOpacity
          key={answer.id}
          onPress={() => handleSelect(answer.id)}
          style={[
            styles.answerBox,
            isAnswered && answer.correct && styles.correctAnswerBox,
            isAnswered &&
              selectedAnswerId === answer.id &&
              !answer.correct &&
              styles.wrongAnswerBox,
          ]}
        >
          <Text style={styles.answerText}>{answer.text}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navButton}>
          <Text style={styles.buttonText}>⬅️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          setSelectedAnswerId(null);
          setIsAnswered(false);
        }} style={styles.navButton}>
          <Text style={styles.buttonText}>🔁</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.buttonText}>✅</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.buttonText}>➡️</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default QuizScreen;