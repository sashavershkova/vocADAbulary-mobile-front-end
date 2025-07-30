import { StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  learnButton: {
    position: 'absolute',
    top: height * 0.015,
    right: width * 0.04,
    width: width * (2 / 3),
    height: height * (2.5 / 4),
    backgroundColor: '#b0fbb0e4', // зелёная
    borderWidth: 1.5,
    borderColor: '#006400', // тёмно-зелёная рамка
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  learnText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#006400',
    fontFamily: 'ArchitectsDaughter',
  },

  progressButton: {
    position: 'absolute',
    top: height * 0.015,
    left: width * 0.05,
    width: width * 0.22,
    height: height * 0.09,
    backgroundColor: '#e19bf8bf', // лаванда
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#006400',
  },

  settingsButton: {
    position: 'absolute',
    bottom: 115, // чуть выше exitButton
    right: 20,
    backgroundColor: '#e19bf8bf',
    width: width * 0.22,
    height: height * 0.09,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#006400',
  },

  exitButton: {
    position: 'absolute',
    bottom: 13,
    right: 20,
    backgroundColor: '#eeff00fd',
    width: 90,
    height: 90,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#006400',
  },
  buttonText: {
  fontSize: 20,
  fontFamily: 'ArchitectsDaughter',
  color: '#006400', // темно-зелёный
  textAlign: 'center',
},
smallButtonText: {
  fontSize: 16,
  fontFamily: 'ArchitectsDaughter',
  color: '#006400',
  textAlign: 'center',
},
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    alignItems: 'center',
  },

  constructorButton: {
    position: 'absolute',
    right: 121, // отступ от правого края (если LEARN справа)
    bottom: 15,
    backgroundColor: '#e19bf8bf',
    width: 160,
    height: 190, // 90 + 90 + отступ
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#006400',
  },

  walletButton: {
    position: 'absolute',
    bottom: 15,
    left: width * 0.05,
    width: width * 0.22, // ширина как у progressButton
    height: 190, // высота как у constructorButton
    backgroundColor: '#74a5f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#006400',
  },

  quizButton: {
    position: 'absolute',
    top: height * 0.12, // сразу под progressButton
    left: width * 0.05, // такой же отступ как у progressButton
    width: width * 0.22, // как у progressButton
    height: height * 0.515, // высота learn - высота progress
    backgroundColor: '#e19bf8bf',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#006400',
  },


});

export default styles;
