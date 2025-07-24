import { StyleSheet } from 'react-native';

const flashcardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between',
  },

  card: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#f0f8ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 10,
    position: 'relative',
  },

  word: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  definition: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },

  phonetic: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },

  audioIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#e6f7ff',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    flexWrap: 'wrap',
    gap: 10,
  },

  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ddefff',
    borderRadius: 10,
    margin: 5,
  },

  exampleBox: {
    padding: 15,
    backgroundColor: '#fdf6e3',
    borderRadius: 12,
    marginBottom: 20,
  },

  example: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#444',
  },

  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },

  navButton: {
    backgroundColor: '#cde',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default flashcardStyles;