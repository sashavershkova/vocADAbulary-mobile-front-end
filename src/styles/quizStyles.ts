import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    justifyContent: 'center',
  },
  termBox: {
    backgroundColor: '#f1f1f1',
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  termText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  answerBox: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  answerText: {
    fontSize: 18,
    textAlign: 'center',
  },
  correctAnswerBox: {
    backgroundColor: '#b2f2bb', // Light green
  },
  wrongAnswerBox: {
    backgroundColor: '#ffb3b3', // Light red
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  navButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#d1c4e9',
  },
  buttonText: {
    fontSize: 20,
  },
    selectedAnswerBox: {
    borderWidth: 2,
    borderColor: '#7e57c2',
    backgroundColor: '#ede7f6',
  },
  initialsCircle: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: '#edf96c',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
  borderColor: '#2c6f33',
  borderWidth: 2,
},
initialsText: {
  fontFamily: 'ArchitectsDaughter-Regular',
  color: '#2c6f33',
  fontWeight: 'bold',
  fontSize: 16,
},
});

export default styles;