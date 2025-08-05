import React, { useState } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useMockUser } from '../context/UserContext';
import api from '../api/axiosInstance';
import styles from '../styles/settingsStyles';

const SettingsScreen = () => {
  const { user } = useMockUser();
  const userId = user.id;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.patch(`/api/users/${userId}`, {
        username: username || undefined,
        email: email || undefined,
        // password, // not implemented yet
      }, {
        headers: {
          'X-Mock-User-Id': userId,
          'X-Mock-User-Role': user.role,
        }
      });
      Alert.alert('Success', 'Profile updated!');
    } catch (error) {
      Alert.alert('Error', 'Could not update profile.');
    } finally {
      setLoading(false);
    }
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
              // Optionally: navigate away or log out user
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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <Text style={styles.label}>Username: {user.username}</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Change username"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Email: {user.email}</Text>
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
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={false}
        placeholder="Not implemented yet"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={loading}>
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;