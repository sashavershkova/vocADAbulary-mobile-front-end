import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'ArchitectsDaughter',
    marginRight: 12, // отступ от картинки
  },

  avatar: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
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
    backgroundColor: '#66bb6a',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginTop: 30,
  },
  
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;