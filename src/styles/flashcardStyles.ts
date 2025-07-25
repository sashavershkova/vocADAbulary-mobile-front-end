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
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
    position: 'relative',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
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

  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  actionText: {
    color: '#007AFF',
    fontWeight: 'bold',
    marginHorizontal: 8,
    fontSize: 16,
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

  exampleText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 8,
  },

  navBar: {
    flexDirection: 'row', // changed from 'column' to 'row'
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 8,
  },

  navText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default flashcardStyles;



