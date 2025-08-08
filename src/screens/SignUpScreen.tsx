import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import styles from '../styles/signUpStyles';
import { useNavigation } from '@react-navigation/native';
import { signUpUser } from '../api/auth';
import type { RootStackParamList } from '../types/navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Mock only
  const [loading, setLoading] = useState(false);

  // ✅ Type the navigator so navigate('Login', { prefillUsername }) is valid
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSignUp = async () => {
    if (!username || !email) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await signUpUser(username, email);
      Alert.alert('Success', `Registered with username: ${username}`);

      // 🚀 Go to Login with prefilled username
      navigation.navigate('Login', { prefillUsername: username });

      // Clear local state (optional, since we navigated away)
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error: any) {
      if (error.response && error.response.data) {
        Alert.alert('Error', error.response.data || 'Signup failed.');
      } else {
        Alert.alert('Error', 'Could not sign up.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={handleSignUp} style={styles.simpleButton} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.simpleButtonText}>Create Account</Text>}
      </TouchableOpacity>

      {/* Optional: if user taps back, also pass prefill so it stays filled */}
      <TouchableOpacity onPress={() => navigation.navigate('Login', { prefillUsername: username })}>
        <Text style={styles.backToLoginText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;