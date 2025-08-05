import React, { useState, useEffect } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useMockUser } from '../context/UserContext';
import api from '../api/axiosInstance';
import styles from '../styles/settingsStyles';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const { user } = useMockUser();
  const userId = user.id;
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch actual username/email when the screen mounts
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
      await api.patch(`/api/users/${userId}`, {
        username: username || undefined,
        email: email || undefined,
      }, {
        headers: {
          'X-Mock-User-Id': userId,
          'X-Mock-User-Role': user.role,
        }
      });
      Alert.alert('Success', 'Profile updated!');
      if (username) setCurrentUsername(username);
      if (email) setCurrentEmail(email);
      setUsername('');
      setEmail('');
    } catch (error) {
      Alert.alert('Error', 'Could not update profile.');
    } finally {
      setLoading(false);
    }
  };

  // 🆕 Add reset logic
  const handleReset = () => {
    setUsername('');
    setEmail('');
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete your account? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await api.delete(`/api/users/${userId}`, {
                headers: {
                  'X-Mock-User-Id': userId,
                  'X-Mock-User-Role': user.role,
                }
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
          }
        }
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
    <View style={styles.container}>

      <Text style={styles.label}>Username: <Text style={{ fontWeight: 'bold' }}>{currentUsername}</Text></Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Change username"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Email: <Text style={{ fontWeight: 'bold' }}>{currentEmail}</Text></Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Change email"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={[styles.input, { backgroundColor: '#f4f4f4', color: '#888' }]}
        value={"Not implemented yet"}
        editable={false}
        placeholder="Not implemented yet"
      />

      {/* 🆕 Reset Button */}
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: '#aaa', marginBottom: 12 }]}
        onPress={handleReset}
        disabled={loading || (username === '' && email === '')}
      >
        <Text style={styles.saveButtonText}>Reset</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={loading}>
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}
        disabled={loading}
      >
        <Text style={styles.homeButtonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;