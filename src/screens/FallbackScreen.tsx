import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';

const FallbackScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Oops! Knock, knock...{'\n'}
        Who's there?{'\n'}
        Still nothing's here yet. 🧭

      </Text>
      <Text style={styles.subtext}>This screen doesn't exist yet.</Text>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="home" size={20} color="#006400" />
        <Text style={styles.homeButtonText}>GO HOME</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fb3030b5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontFamily: 'ArchitectsDaughter',
    color: '#006400',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    fontFamily: 'ArchitectsDaughter',
    color: '#006400',
    textAlign: 'center',
    marginBottom: 20,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8ef88eed',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#313131ff',
    shadowOpacity: 0.8,
    shadowOffset: { width: 3, height: 6 },
  },
  homeButtonText: {
    color: '#006400',
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'ArchitectsDaughter',
  },
});

export default FallbackScreen;