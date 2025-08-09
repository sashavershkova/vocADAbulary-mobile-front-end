import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Pressable, ActivityIndicator } from 'react-native';
import styles from '../styles/signUpStyles';
import { useNavigation } from '@react-navigation/native';
import { signUpUser } from '../api/auth'; // import from the file above

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Mock only
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!username || !email) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await signUpUser(username, email);
      Alert.alert('Success', `Registered with username: ${username}`);
      setUsername('');
      setEmail('');
      setPassword('');
      navigation.navigate('Login');
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

      <TouchableOpacity
        onPress={handleSignUp}
        style={styles.simpleButton}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.simpleButtonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backToLoginText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;