import React, { useLayoutEffect, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../types/navigation';
import { useMockUser } from '../context/UserContext';
import api from '../api/axiosInstance';
import styles from '../styles/settingsStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: Props) => {
  const { user } = useMockUser();
  const userId = user.id;
  const username = user.username || '';
  const initials = username.charAt(0).toUpperCase();

  const [usernameInput, setUsernameInput] = useState('');
  const [email, setEmail] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'SETTINGS',
      headerBackVisible: false,
      headerStyle: {
        backgroundColor: '#f7b4c4d6',
      },
      headerTitleStyle: {
        fontFamily: 'ArchitectsDaughter-Regular',
        fontSize: 36,
        color: '#246396',
      },
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
          headers: {
            'X-Mock-User-Id': userId,
            'X-Mock-User-Role': user.role,
          },
        });
        setCurrentUsername(res.data.username || '');
        setCurrentEmail(res.data.email || '');
      } catch (error) {
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
        {
          username: usernameInput || undefined,
          email: email || undefined,
        },
        {
          headers: {
            'X-Mock-User-Id': userId,
            'X-Mock-User-Role': user.role,
          },
        }
      );
      Alert.alert('Success', 'Profile updated!');
      if (usernameInput) setCurrentUsername(usernameInput);
      if (email) setCurrentEmail(email);
      setUsernameInput('');
      setEmail('');
    } catch (error) {
      Alert.alert('Error', 'Could not update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUsernameInput('');
    setEmail('');
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
                headers: {
                  'X-Mock-User-Id': userId,
                  'X-Mock-User-Role': user.role,
                },
              });
              Alert.alert('Deleted', 'Account deleted!');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
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
    <LinearGradient colors={['#f7b4c4d6', '#bf86fcc2']} style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={styles.content}>
          {/* USERNAME section */}
          <View style={{ marginBottom: 50 }}>
            <Text style={styles.label}>CURRENT USERNAME: {currentUsername}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Text style={[styles.label, { marginRight: 10 }]}>Change name to:</Text>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter new username"
                value={usernameInput}
                onChangeText={setUsernameInput}
              />
            </View>
          </View>

          {/* EMAIL section */}
          <View>
            <Text style={styles.label}>CURRENT EMAIL: {currentEmail}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Text style={[styles.label, { marginRight: 10 }]}>Change email to:</Text>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter new email"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.deleteWrapper}>
            <TouchableOpacity style={styles.deleteAccountButton} onPress={handleDelete}>
              <Text style={styles.deleteAccountText}>DELETE ACCOUNT</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BOTTOM BAR */}
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navItem}>
            <Ionicons name="home" size={35} color="#97d0feff" />
            <Text style={styles.navText}>HOME</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Submit')} style={styles.navItem}>
            <Ionicons name="checkmark-circle" size={35} color="#97d0feff" />
            <Text style={styles.navText}>SUBMIT</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Reset')} style={styles.navItem}>
            <Ionicons name="refresh-circle" size={35} color="#97d0feff" />
            <Text style={styles.navText}>RESET</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default SettingsScreen;
