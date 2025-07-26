import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import styles from '../styles/loginStyles';
import api from '../api/axiosInstance';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

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
    } catch (error) {
      console.error('❌ Login failed:', error);
      Alert.alert('Login failed', 'Invalid username. Please try again.');
    }
  };

  return (
    <LinearGradient
      colors={['#87ee8764', '#65c165ff']}
      style={styles.container}
    >
      <View style={styles.titleRow}>
        <Text style={styles.title}>TECH VOICE</Text>
        <Image
          source={require('../assets/images/stickman.png')}
          style={[styles.avatar, { tintColor: undefined }]}
        />
      </View>

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

      <TouchableOpacity onPress={handleLogin} style={styles.buttonWrapper}>
        <Image
          source={require('../assets/images/button.png')}
          style={styles.buttonImage}
        />
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default LoginScreen;
