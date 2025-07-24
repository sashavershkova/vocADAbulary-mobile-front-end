import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: '20%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  sidebarButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#d3d3f3',
    borderRadius: 10,
    alignItems: 'center',
  },
  main: {
    flex: 1,
    backgroundColor: '#c3f3c3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  learnText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bottomRow: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  bottomButton: {
    backgroundColor: '#f8d0f8',
    padding: 20,
    borderRadius: 10,
  },
  sideButtons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  smallButton: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default styles;