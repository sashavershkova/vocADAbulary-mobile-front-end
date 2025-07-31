import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  topicList: {
    paddingBottom: 20,
  },

  topicBoxWrapper: {
    marginVertical: 10,
    alignItems: 'center',
  },

  topicTouchable: {
    borderRadius: 40,
    overflow: 'visible', // чтобы тень была видна
  },

  topicBox: {
    width: 300,
    height: 80,
    borderRadius: 40,
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    elevation: 0, // не влияет на iOS, но пусть будет
  },

  topicText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'ArchitectsDaughter-Regular',
    color: '#006400',
  },

  topicTextActive: {
    color: '#b67ef6ff',
    textShadowColor: '#006400',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
  },

  topicShadowWrapper: {
    shadowColor: '#006400', // 🖤 Чёрная тень
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  simpleButton: {
  backgroundColor: '#F8C8DC', // нежно-розовый
  borderRadius: 20,
  paddingVertical: 10,
  paddingHorizontal: 30,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1.5,
  borderColor: '#006400', // тёмно-зелёный бордер
  marginTop: 30, // при необходимости
},

simpleButtonText: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#006400',
  fontFamily: 'ArchitectsDaughter',
},
});

export default styles;
