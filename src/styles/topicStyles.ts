import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fefefe',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    padding: 20,
    backgroundColor: '#e8f0ff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#313131ff',
    shadowOpacity: 0.8,
    shadowOffset: { width: 3, height: 6 },
    shadowRadius: 4,
  },
  word: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  definition: {
    fontSize: 18,
    marginBottom: 10,
  },
  example: {
    fontStyle: 'italic',
    marginBottom: 6,
  },
  synonyms: {
    marginBottom: 6,
    color: '#444',
  },
  phonetic: {
    fontSize: 16,
    color: '#888',
  },
});

export default styles;