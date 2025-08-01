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
    overflow: 'visible', 
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
    elevation: 0, 
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
    shadowColor: '#006400', 
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
  backgroundColor: '#F8C8DC', 
  borderRadius: 20,
  paddingVertical: 10,
  paddingHorizontal: 30,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1.5,
  borderColor: '#006400', 
  marginTop: 30, 
},

simpleButtonText: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#006400',
  fontFamily: 'ArchitectsDaughter',
},
initialsCircle: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: '#edf96c',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
  borderColor: '#2c6f33',
  borderWidth: 1.5,
},
initialsText: {
  fontFamily: 'ArchitectsDaughter-Regular',
  color: '#2c6f33',
  fontWeight: 'bold',
  fontSize: 18,
},
});

export default styles;
