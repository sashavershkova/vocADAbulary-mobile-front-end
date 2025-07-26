import React, { useState } from 'react';
import { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import styles from '../styles/loginStyles';
import api from '../api/axiosInstance';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
  const loadSavedUsername = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem('savedUsername');
      if (savedUsername) {
        setUsername(savedUsername);
        setRememberMe(true);
      }
    } catch (err) {
      console.log('Error loading saved username:', err);
    }
  };
  loadSavedUsername();
  }, []);

  const handleLogin = async () => {
    try {
      console.log('🔍 API baseURL:', api.defaults.baseURL);
      const response = await api.post('/users/login', { username });

      const { id, role } = response.data;

      api.defaults.headers.common['X-Mock-User-Id'] = id;
      api.defaults.headers.common['X-Mock-User-Role'] = role;

      globalThis.mockUser = { id, role };

      console.log('✅ Logged in as:', username, '| ID:', id, '| Role:', role);
      navigation.navigate('Home', { userId: id });

      if (rememberMe) {
        await AsyncStorage.setItem('savedUsername', username);
      } else {
        await AsyncStorage.removeItem('savedUsername');
      }
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      Alert.alert('Login failed', 'Invalid username. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TECH VOICE</Text>

      <Image
        source={require('../assets/images/stickman.png')}
        style={styles.avatar}
      />

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

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setRememberMe(!rememberMe)}
      >
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: '#06610bff',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: rememberMe ? '#233a24ff' : 'transparent',
          }}
        >
          {rememberMe && <MaterialIcons name="check" size={18} color="#fff" />}
        </View>
        <Text style={styles.checkboxText}>Remember Me</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot Username / Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
