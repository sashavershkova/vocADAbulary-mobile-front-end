import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useMockUser } from '../context/UserContext';
import { getUserProgressSummary } from '../api/summary';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles/progressStyles';

type ProgressNavProp = NativeStackNavigationProp<RootStackParamList, 'Progress'>;

type ProgressSummary = {
  totalCards: number;
  inProgressCards: number;
  learnedCards: number;
  termComprehension: number;
  spokenWritten: number;
  quizzesPassed: number;
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
      headerStyle: {
        backgroundColor: '#f9bcdeff',
      },
      headerTitleStyle: {
        fontFamily: 'ArchitectsDaughter-Regular',
        fontSize: 24,
        color: '#246396ff',
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
    fetchSummary();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  if (!summary) {
    return null;
  }

  const renderButton = (icon: any, label: string, value: string | number) => (
    <TouchableOpacity style={styles.metricButton}>
      <Ionicons name={icon} size={24} color="#077bb4ff" />
      <Text style={styles.metricText}>
        {label}: {value}
      </Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#f9bcdeff', '#b96bf1fe']} style={styles.container}>
      <View style={styles.buttonGroup}>
        {renderButton('stats-chart', 'Total Words', summary.totalCards)}
        {renderButton('bulb', 'Learned', summary.learnedCards)}
        {renderButton('trending-up', 'In Progress', summary.inProgressCards)}
        {renderButton('flash', 'Quizzes Passed', summary.quizzesPassed)}
        {renderButton('chatbubble-ellipses', 'Spoken/Written', summary.spokenWritten)}
        {renderButton('create', 'Created', '—')}
      </View>

      <View style={styles.buttonBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home" size={35} color="#97d0feff" />
          <Text style={styles.navText}>HOME</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default ProgressScreen;
