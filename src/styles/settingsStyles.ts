import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef6f6',
    padding: 24,
    justifyContent: 'flex-start',
  },
  heading: {
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 30,
    color: '#2c6f33',
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    color: '#222',
    marginBottom: 4,
    marginTop: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#c4c4c4',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 6,
  },
  saveButton: {
    backgroundColor: '#2c6f33',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  deleteButton: {
    marginTop: 38,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fff0f0',
    borderWidth: 1,
    borderColor: '#ee3d3d',
  },
  deleteButtonText: {
    color: '#ee3d3d',
    fontWeight: 'bold',
    fontSize: 16,
  },
  homeButton: {
    marginTop: 32,
    backgroundColor: '#b5e5b6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#205720',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  
});

export default styles;