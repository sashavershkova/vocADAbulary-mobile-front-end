import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import styles from '../styles/loginStyles';
import api from '../api/axiosInstance';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      console.log('🔍 API baseURL:', api.defaults.baseURL);
      const response = await api.post('/users/login', { username });

      const { id, role } = response.data;
      // ✅ Set mock headers dynamically
      api.defaults.headers.common['X-Mock-User-Id'] = id;
      api.defaults.headers.common['X-Mock-User-Role'] = role;

      // Save mock credentials globally (for now, in globalThis — we can refactor later)
      globalThis.mockUser = {
        id,
        role,
      };

      console.log('✅ Logged in as:', username, '| ID:', id, '| Role:', role);

      navigation.navigate('Home', { userId: id });
    } catch (error) {
      console.error('❌ Login failed:', error);
      Alert.alert('Login failed', 'Invalid username. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;