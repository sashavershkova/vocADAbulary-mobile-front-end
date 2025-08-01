import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9f99d', // fallback if gradient fails
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  initialsCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#edf96c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    width: '90%',
    height: '35%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'relative',
  },
  word: {
    fontSize: 26,
    fontFamily: 'ArchitectsDaughter-Regular',
    fontWeight: 'bold',
  },
  definition: {
    fontSize: 18,
    fontFamily: 'ArchitectsDaughter-Regular',
    marginVertical: 10,
    textAlign: 'center',
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
    borderColor: '#90caf9',
    borderWidth: 1,
  },
  exampleText: {
    fontFamily: 'ArchitectsDaughter-Regular',
    fontStyle: 'italic',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
});
