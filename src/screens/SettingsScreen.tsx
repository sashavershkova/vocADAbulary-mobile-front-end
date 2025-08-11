import React, { useLayoutEffect, useEffect, useState } from 'react';
import {
  Pressable, Animated, View, Text, TextInput, Alert, ActivityIndicator,
  Keyboard, TouchableWithoutFeedback, // 👈 add these
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../types/navigation';
import { useMockUser } from '../context/UserContext';
import api from '../api/axiosInstance';
import styles from '../styles/settingsStyles';
import bluestick from '../assets/images/bluestick.png';
import PopoverHint from '../screens/PopoverHint';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: Props) => {
  const [hintVisible, setHintVisible] = useState(false);
  const stickScale = React.useRef(new Animated.Value(1)).current;

  const { user } = useMockUser();
  const userId = user.id;
  const username = user.username || '';
  const initials = username.charAt(0).toUpperCase();

  const [usernameInput, setUsernameInput] = useState('');
  const [email, setEmail] = useState('');
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'SETTINGS',
      headerBackVisible: false,
      headerStyle: { backgroundColor: '#f9bcdeff' },
      headerTitleStyle: { fontFamily: 'ArchitectsDaughter', fontSize: 36, color: '#246396' },
      headerLeft: () => (
        <Pressable
          onPress={() => {
            Animated.sequence([
              Animated.timing(stickScale, { toValue: 0.5, duration: 100, useNativeDriver: true }),
              Animated.timing(stickScale, { toValue: 1.0, duration: 100, useNativeDriver: true }),
            ]).start(() => setHintVisible(true));
          }}
          style={{ marginLeft: 16, padding: 2 }}
        >
          <Animated.Image source={bluestick} style={{ width: 30, height: 50, transform: [{ scale: stickScale }] }} />
        </Pressable>
      ),
      headerRight: () => (
        <View style={styles.userWrapper}>
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{initials}</Text>
          </View>
          <Text style={styles.userLabel}>User</Text>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/api/users/${userId}/simple`, {
          headers: { 'X-Mock-User-Id': userId, 'X-Mock-User-Role': user.role },
        });
        setCurrentUsername(res.data.username || '');
        setCurrentEmail(res.data.email || '');
      } catch {
        Alert.alert('Error', 'Could not load user data.');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchUser();
  }, [userId, user.role]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.patch(
        `/api/users/${userId}`,
        { username: usernameInput || undefined, email: email || undefined },
        { headers: { 'X-Mock-User-Id': userId, 'X-Mock-User-Role': user.role } }
      );
      Alert.alert('Success', 'Profile updated!');
      if (usernameInput) setCurrentUsername(usernameInput);
      if (email) setCurrentEmail(email);
      setUsernameInput('');
      setEmail('');
      Keyboard.dismiss();
    } catch {
      Alert.alert('Error', 'Could not update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUsernameInput('');
    setEmail('');
    Keyboard.dismiss();
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your account? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await api.delete(`/api/users/${userId}`, {
                headers: { 'X-Mock-User-Id': userId, 'X-Mock-User-Role': user.role },
              });
              Alert.alert('Deleted', 'Account deleted!');
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } catch {
              Alert.alert('Error', 'Could not delete account.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    // 👇 tap anywhere outside inputs to blur + dismiss keyboard
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <LinearGradient colors={['#f9bcdeff', '#bf86fcfe']} style={styles.container}>
        <PopoverHint visible={hintVisible} onClose={() => setHintVisible(false)}>
          <Text style={styles.text}>
            Welcome to the SETTINGS Center of the Universe{'\n'}
            (AKA: where your identity crisis gets a stylish reboot.){'\n\n'}
            {/* ... left as-is ... */}
          </Text>
        </PopoverHint>

        <View style={styles.content}>
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.label}>CURRENT USERNAME: {currentUsername}</Text>
            <Text style={[styles.label, { marginTop: 8, marginBottom: 6 }]}>Change name to:</Text>

            <View style={[styles.inputBase, usernameFocused && styles.inputFocused]}>
              <TextInput
                style={styles.inputField}
                placeholder="Enter new username"
                value={usernameInput}
                onChangeText={setUsernameInput}
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(false)}
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>CURRENT EMAIL: {currentEmail}</Text>
            <Text style={[styles.label, { marginTop: 8, marginBottom: 6 }]}>Change email to:</Text>

            <View style={[styles.inputBase, emailFocused && styles.inputFocused]}>
              <TextInput
                style={styles.inputField}
                placeholder="Enter new email"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss} // 👈 enter/done hides keyboard
              />
            </View>
          </View>

          <View style={styles.deleteWrapper}>
            <Pressable onPress={handleDelete} style={({ pressed }) => [styles.pillButton, pressed && styles.pillButtonActive]}>
              <Text style={styles.pillButtonText}>DELETE ACCOUNT</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.bottomBar}>
          <Pressable onPress={() => navigation.navigate('Home')} style={({ pressed }) => [styles.navItem, pressed && styles.navIconActive]}>
            <Ionicons name="home" size={35} color="#97d0feff" />
            <Text style={styles.navText}>HOME</Text>
          </Pressable>

          <Pressable onPress={handleSave} disabled={loading} style={({ pressed }) => [styles.navItem, pressed && styles.navIconActive]}>
            <Ionicons name="checkmark-circle" size={35} color="#97d0feff" />
            <Text style={styles.navText}>SUBMIT</Text>
          </Pressable>

          <Pressable onPress={handleReset} style={({ pressed }) => [styles.navItem, pressed && styles.navIconActive]}>
            <Ionicons name="refresh-circle" size={35} color="#97d0feff" />
            <Text style={styles.navText}>RESET</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default SettingsScreen;