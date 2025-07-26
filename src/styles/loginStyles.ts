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
  fontSize: 36,
  fontWeight: 'bold',
  textAlign: 'center',
  fontFamily: 'ArchitectsDaughter',
  color: '#b869d3ff', // лаванда
  textShadowColor: '#004d00', // тёмно-зелёная тень
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 2,
},

  avatar: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },

  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#b869d3ff', // ярче
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
    color: '#0f5b13ff',
  },

  forgotText: {
    color: '#1b5e20',
    textDecorationLine: 'underline',
    marginTop: 10,
  },

  loginButton: {
    backgroundColor: '#b869d3cb',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 30,
    alignSelf: 'center',
  },

  loginButtonText: {
  color: '#216d25c9', // лаванда
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: 'center',
  textShadowColor: '#b869d3ff', // тень
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 2,
},

buttonImage: {
    width: 200,
    height: 70,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 30,
  },

  buttonWrapper: {
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 30,
},

buttonImage: {
  width: 180,
  height: 60,
  resizeMode: 'contain',
},

buttonText: {
  position: 'absolute',
  color: '#b869d3ff',
  fontSize: 20,
  fontWeight: 'bold',
  fontFamily: 'ArchitectsDaughter',
  textShadowColor: '#004d00',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 2,
},

});

export default styles;
