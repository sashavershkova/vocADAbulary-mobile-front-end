import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import styles from '../styles/quizStyles';

const QuizScreen = () => {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.termBox}>
        <Text style={styles.termText}>{question.term}</Text>
      </View>

      {question.answers.map((answer) => (
        <TouchableOpacity
          key={answer.id}
          onPress={() => setSelectedAnswerId(answer.id)}
          style={[
            styles.answerBox,
            selectedAnswerId === answer.id && styles.selectedAnswerBox,
          ]}
        >
          <Text style={styles.answerText}>{answer.text}</Text>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
};

export default QuizScreen;