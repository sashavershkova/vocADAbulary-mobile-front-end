import { StyleSheet } from 'react-native';

export const splashStyles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'transparent',
    padding: 20,
    borderRadius: 10,
  },
  mainText: {
    fontSize: 28,
    fontWeight: 'normal',
    fontFamily: 'ArchitectsDaughter',
    color: '#004d00',
    textAlign: 'center',
    paddingHorizontal: 30,
    textShadowColor: '#ffff66',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  boldText: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'ArchitectsDaughter',
    color: '#004d00',
    textAlign: 'center',
    paddingHorizontal: 30,
    textShadowColor: '#ffff66',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  smallText: {
    fontSize: 18,
    fontWeight: 'normal',
    fontFamily: 'ArchitectsDaughter',
    color: '#004d00',
    textAlign: 'center',
    paddingHorizontal: 30,
    textShadowColor: '#ffff66',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
