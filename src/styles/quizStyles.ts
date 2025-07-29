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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  answerBox: {
    backgroundColor: '#ae81f8',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  correctAnswerBox: {
    backgroundColor: '#6df06d',
  },
  wrongAnswerBox: {
    backgroundColor: '#f06d6d',
  },
  answerText: {
    fontSize: 16,
    color: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  navButton: {
    backgroundColor: '#3d3d3d',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default quizStyles;