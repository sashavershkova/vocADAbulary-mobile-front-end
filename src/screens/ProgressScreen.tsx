import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text } from 'react-native';
import { ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useMockUser } from '../context/UserContext';
import { getUserProgressSummary } from '../api/summary';
import ProgressButtons from '../buttons/ProgressButtons';


type ProgressNavProp = NativeStackNavigationProp<RootStackParamList, 'Progress'>;

type ProgressSummary = {
  totalCards: number;
  inProgressCards: number;
  learnedCards: number;
  termComprehension: number;
  spokenWritten: number;
};

const ProgressScreen = () => {
  const navigation = useNavigation<ProgressNavProp>();
  const { user } = useMockUser();
  const userId = user.id;
  const username = user.username;
  const initials = username?.charAt(0).toUpperCase() || '?';

  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const data = await getUserProgressSummary(userId);
      const adjusted = {
        ...data,
        inProgressCards: data.totalCards - data.learnedCards,
      };
      setSummary(adjusted);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not fetch progress summary.');
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'PROGRESS',
      headerBackVisible: false,
      headerRight: () => (
        <View style={styles.initialsCircle}>
        <Text style={styles.initialsText}>{initials}</Text>
      </View>
      ),
    });
  }, [navigation, initials]);

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  if (!summary) {
    return null;
  }

  return <ProgressButtons summary={summary} />;
};

export default ProgressScreen;
