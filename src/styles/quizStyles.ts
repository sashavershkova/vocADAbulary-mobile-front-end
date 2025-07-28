import { StyleSheet } from 'react-native';

const quizStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d5e9f5',
    padding: 16,
    justifyContent: 'flex-start',
  },
  termBox: {
    backgroundColor: '#fff57e',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  termText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  answerBox: {
    backgroundColor: '#ae81f8',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  selectedAnswerBox: {
    borderWidth: 3,
    borderColor: '#6df06d',
  },
  answerText: {
    fontSize: 16,
    color: 'white',
  },
});

export default quizStyles;