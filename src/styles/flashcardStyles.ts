import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf9b5ff', // fallback if gradient fails
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  initialsCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3fc8bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderColor: '#2c6f33', // Тёмно-зелёная обводка
    borderWidth: 2,
  },
  initialsText: {
    fontFamily: 'ArchitectsDaughter-Regular',
    color: '#2c6f33',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
  backgroundColor: '#fff176',
  borderColor: '#4CAF50',
  borderWidth: 2,
  borderRadius: 16,
  width: 370,              // или '90%' — но не сжимай
  height: 300,
  alignSelf: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  position: 'relative',
},
  word: {
    fontSize: 50,
    fontFamily: 'ArchitectsDaughter-Regular',
    fontWeight: 'bold',
    color: '#2c6f33',
  },
  definition: {
    fontSize: 30,
    fontFamily: 'ArchitectsDaughter-Regular',
    marginVertical: 10,
    textAlign: 'center',
    color: '#2c6f33',
    fontStyle: 'italic',
  },
  soundButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  cardButtons: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  exampleSection: {
    alignItems: 'flex-start',
    marginLeft: 25,
  },
  exampleBubble: {
    backgroundColor: '#e0f7fa',
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
    borderColor: '#5baff3ff',
    borderWidth: 1,
    maxWidth: '95%',
  },
  exampleText: {
    fontFamily: 'ArchitectsDaughter-Regular',
    fontStyle: 'italic',
    fontSize: 25,
    color: '#2c6f33',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
});
