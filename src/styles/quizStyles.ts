import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  initialsCircle: {
    backgroundColor: '#d0f0c0',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: "#0c5b08f3",
  },

  initialsText: {
    fontFamily: 'ArchitectsDaughter',
    fontSize: 18,
    color: '#2c6f33',
  },

  questionButton: {
    backgroundColor: '#fff176',
    borderRadius: 30,
    padding: 15,
    marginBottom: 20,
    marginTop: 10,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  questionText: {
    fontFamily: 'ArchitectsDaughter',
    fontSize: 40,
    color: '#333333',
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  answersContainer: {
    gap: 15,
    paddingBottom: 100,
  },

  answerBox: {
    backgroundColor: '#d0f0c0',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#2c6f33',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },

  selectedAnswerBox: {
    borderColor: '#1e8449',
    borderWidth: 2,
  },

  correctAnswerBox: {
    backgroundColor: '#a5d6a7',
    borderColor: '#388e3c',
  },

  wrongAnswerBox: {
    backgroundColor: '#ef9a9a',
    borderColor: '#c62828',
  },

  answerText: {
    fontFamily: 'ArchitectsDaughter',
    fontSize: 18,
    color: '#2c6f33',
    textAlign: 'center',
    fontFamily: 'ArchitectsDaughter',
    fontSize: 25,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  navigationButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default styles;
