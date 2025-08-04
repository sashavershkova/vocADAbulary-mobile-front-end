import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },

  title: {
    fontSize: 45,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'ArchitectsDaughter',
    color: '#b869d3ff',
    shadowColor: '#313131ff',        
    shadowOpacity: 0.8,
    shadowOffset: { width: 4, height: 6 },
  },

  avatar: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    shadowColor: '#313131ff',        
    shadowOpacity: 0.8,
    shadowOffset: { width: 4, height: 6 },
  },

  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#006400',
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
    fontSize: 16,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 10,
  },

  checkboxText: {
    marginLeft: 8,
    color: '#006400',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'ArchitectsDaughter',
  },

  forgotText: {
    color: '#006400',
    textDecorationLine: 'underline',
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'ArchitectsDaughter',
  },

  simpleButton: {
    backgroundColor: '#e19bf8de',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 30,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#006400',
    shadowColor: '#313131ff',        
    shadowOpacity: 0.8,
    shadowOffset: { width: 4, height: 6 },
  },

  simpleButtonText: {
    color: '#006400',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'ArchitectsDaughter',
    textShadowColor: '#006400',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default styles;
