import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Animated,
  Pressable,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import styles from '../styles/loginStyles';
import api from '../api/axiosInstance';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMockUser } from '../context/UserContext';

declare global {
  var mockUser: { id: number; role: string };
}

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {

  const { setUser } = useMockUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [focused, setFocused] = useState<null | 'username' | 'password'>(null);

  const title = 'TECH VOICE';
  const animatedValues = useRef(title.split('').map(() => new Animated.Value(1))).current;

  useEffect(() => {
    const animate = (index: number) => {
      Animated.sequence([
        Animated.timing(animatedValues[index], {
          toValue: 1.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[index], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        const nextIndex = (index + 1) % animatedValues.length;
        animate(nextIndex);
      });
    };
    animate(0);
  }, []);

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
      const response = await api.post('/api/users/login', { username });

      const { id, role } = response.data;

      setUser({ id, username });
      console.log('✅ User set in context:', { id, username });

      api.defaults.headers.common['X-Mock-User-Id'] = id;
      api.defaults.headers.common['X-Mock-User-Role'] = role;

      globalThis.mockUser = { id, role };

      console.log('✅ Logged in as:', username, '| ID:', id, '| Role:', role);
      navigation.navigate('Home', { userId: id, username });

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
  <LinearGradient colors={['#abf5ab64', '#347134bc']} style={styles.container}>
    <View style={styles.titleRow}>
      {title.split('').map((char, i) => (
        <Animated.Text
          key={i}
          style={[styles.title, { transform: [{ scale: animatedValues[i] }] }]}
        >
          {char}
        </Animated.Text>
      ))}

      <View style={styles.avatarWrapper}>
        <Image
          source={require('../assets/images/stickman.png')}
          style={styles.avatar}
        />
      </View>
    </View>

    <View style={[styles.inputBase, focused === 'username' && styles.inputFocused]}>
      <TextInput
        placeholder="Username"
        style={styles.inputField}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        onFocus={() => setFocused('username')}
        onBlur={() => setFocused(null)}
      />
    </View>

    <View style={[styles.inputBase, focused === 'password' && styles.inputFocused]}>
      <TextInput
        placeholder="Password"
        style={styles.inputField}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        onFocus={() => setFocused('password')}
        onBlur={() => setFocused(null)}
      />
    </View>

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
          borderColor: '#006400',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: rememberMe ? '#abf5ab64' : 'transparent',
        }}
      >
        {rememberMe && <MaterialIcons name="check" size={18} color="#006400" />}
      </View>
      <Text style={styles.checkboxText}>Remember Me</Text>
    </TouchableOpacity>

    <TouchableOpacity>
      <Text style={styles.forgotText}>Forgot Username / Password?</Text>
    </TouchableOpacity>

    <Pressable
      onPress={handleLogin}
      style={({ pressed }) => [styles.pillButton, pressed && styles.pillButtonActive]}
    >
      <Text style={styles.pillButtonText}>SIGN IN</Text>
    </Pressable>

    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
      <Text style={styles.forgotText}>
        Don't you have an account yet? Sign up!
      </Text>
    </TouchableOpacity>
  </LinearGradient>
);

};

export default LoginScreen;
