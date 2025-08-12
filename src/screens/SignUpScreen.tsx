import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Pressable,
  ActivityIndicator,
  Keyboard,                 
  TouchableWithoutFeedback, 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from '../styles/signUpStyles';
import { signUpUser } from '../api/auth';
import { RootStackParamList } from '../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUpScreen = () => {
  const navigation = useNavigation<Nav>();

  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [focused, setFocused] = useState<null | 'username' | 'email' | 'password'>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Sign Up',
      headerBackVisible: false,
      headerStyle: { backgroundColor: '#abf5ab64' },
      headerTitleStyle: { fontFamily: 'ArchitectsDaughter', fontSize: 28, color: '#006400' },
    });
  }, [navigation]);

  const handleSignUp = async () => {
    if (!username.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await signUpUser(username, email);
      Alert.alert('Success', `Registered with username: ${username}`);
      navigation.navigate('Login', { prefillUsername: username });
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error: any) {
      if (error?.response?.data) {
        Alert.alert('Error', error.response.data || 'Signup failed.');
      } else {
        Alert.alert('Error', 'Could not sign up.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <LinearGradient colors={['#abf5ab64', '#347134bc']} style={styles.container}>
        <View style={[styles.inputBase, focused === 'username' && styles.inputFocused]}>
          <TextInput
            placeholder="Username"
            style={styles.inputField}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            onFocus={() => setFocused('username')}
            onBlur={() => setFocused(null)}
            returnKeyType="next"
          />
        </View>

        <View style={[styles.inputBase, focused === 'email' && styles.inputFocused]}>
          <TextInput
            placeholder="Email"
            style={styles.inputField}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused(null)}
            returnKeyType="next"
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
            returnKeyType="done"                 
            onSubmitEditing={Keyboard.dismiss}   
          />
        </View>

        <Pressable
          onPress={handleSignUp}
          disabled={loading}
          style={({ pressed }) => [styles.pillButton, pressed && styles.pillButtonActive]}
        >
          {loading ? (
            <ActivityIndicator color="#006400" />
          ) : (
            <Text style={styles.pillButtonText}>CREATE ACCOUNT</Text>
          )}
        </Pressable>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.forgotText}>Back to Login</Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default SignUpScreen;