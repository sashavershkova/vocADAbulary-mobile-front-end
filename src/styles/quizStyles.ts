import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  // ----- header bits -----
  initialsCircle: {
    backgroundColor: '#97D0FEFF',
    borderRadius: 20,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#246396',
  },
  initialsText: {
    fontFamily: 'ArchitectsDaughter',
    fontSize: 18,
    color: '#246396',
    fontWeight: 'bold',
  },
  userWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: 8,
    paddingTop: 8,
    minWidth: 60,
  },
  userLabel: {
    fontSize: 14,
    color: '#246396',
    fontFamily: 'ArchitectsDaughter',
    marginTop: -5,
    textAlign: 'center',
  },

  // ----- question pill -----
  questionButton: {
    backgroundColor: '#FFF176',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    marginTop: 10,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#313131FF',
    shadowOpacity: 0.8,
    shadowOffset: { width: 4, height: 6 },
    shadowRadius: 6,
  },
  questionText: {
    fontFamily: 'ArchitectsDaughter',
    fontSize: 40,
    color: '#2C6F33',
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  // ----- answers list -----
  answersContainer: {
    gap: 10,
    paddingBottom: 100,
  },

pillButton: {
  backgroundColor: '#f9dafacd',
  borderRadius: 30,
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderWidth: 2,
  borderColor: '#F9DAFA',
  shadowColor: '#313131FF',
  shadowOpacity: 0.8,
  shadowOffset: { width: 4, height: 6 },
  shadowRadius: 6,
  marginBottom: 5,
},

pillButtonActive: {
  backgroundColor: '#97d0fee2',
  borderColor: '#FFFFFF',
  borderWidth: 2,
  shadowColor: '#FFFFFF',
  shadowOpacity: 1,
  shadowOffset: { width: 0, height: 0 },
  shadowRadius: 9,
},

  // После submit (меняем только цвета поверхности)
  correctAnswerBox: {
    backgroundColor: '#cbf6b6bd',
    borderColor: '#CBF6B6FF',
    borderWidth: 2,
  },
  wrongAnswerBox: {
    backgroundColor: '#f86a6acd',
    borderColor: '#F86A6AFF',
    borderWidth: 2,
  },

  answerText: {
    fontFamily: 'ArchitectsDaughter',
    fontSize: 25,
    color: '#246396',
    textAlign: 'center',
  },

  // ----- bottom bar -----
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#313131FF',
    shadowOpacity: 0.8,
    shadowOffset: { width: 3, height: 6 },
  },

  // контейнер кликабельной иконки
  navIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,

  },
  navIconActive: {
    // лёгкое свечение контейнера при нажатии (без рамок и плашек)
    shadowColor: '#FFFFFF',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
  },
  navText: {
    fontSize: 14,
    color: '#97D0FEFF',
    fontFamily: 'ArchitectsDaughter',
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
  },
});

export default styles;
