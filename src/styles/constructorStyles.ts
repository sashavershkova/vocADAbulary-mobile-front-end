// styles/constructorStyles.ts
import { StyleSheet } from 'react-native';

const constructorStyles = StyleSheet.create({
  // Center the yellow template box in the screen,
  // but leave space for the bottom nav.
  contentCenter: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 100, // keep above bottomBar
  },

  // Flash states for the big yellow box
  successFlash: { borderColor: '#2c6f33', borderWidth: 2 },
  errorFlash: { borderColor: '#c62828', borderWidth: 2 },

  // Template rendering
  templateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  templateText: {
    fontFamily: 'ArchitectsDaughter',
    fontSize: 22,
    color: '#2c6f33',
  },

  // Inputs for blanks
  blankInput: {
    minWidth: 60,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#f9dafafd',
    borderWidth: 1.5,
    borderColor: '#97d0feff',
    fontFamily: 'ArchitectsDaughter',
    fontSize: 20,
    color: '#246396',
    marginVertical: 2,
    textAlign: 'center',
  },
  blankInputDisabled: {
    backgroundColor: '#e6e6e6',
    borderColor: '#bdbdbd',
  },
  blankInputCorrect: {
    backgroundColor: '#cbf6b6ff',
    borderColor: '#2c6f33',
  },
  blankInputWrong: {
    backgroundColor: '#f86a6aff',
    borderColor: '#c62828',
  },
});

export default constructorStyles;
