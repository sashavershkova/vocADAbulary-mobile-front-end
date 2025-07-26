import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FallbackScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Oops! Nothing here 🧭</Text>
      <Text style={styles.subtext}>This screen doesn’t exist yet.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d4fcd4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontFamily: 'ArchitectsDaughter',
    color: '#8000ff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    fontFamily: 'ArchitectsDaughter',
    color: '#555',
    textAlign: 'center',
  },
});

export default FallbackScreen;
