import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useMockUser } from '../context/UserContext';
import { getUserProgressSummary } from '../api/summary';
import styles from '../styles/progressStyles';

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

  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  if (!summary) {
    return <Text>No summary data.</Text>;
  }

  const renderRow = (label: string, value: string | number) => (
    <View style={styles.row}>
      <TouchableOpacity style={styles.placeholderButton}>
        <Text style={{ color: '#fff' }}>+</Text>
      </TouchableOpacity>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderRow('Total words', summary.totalCards)}
      {renderRow('New words learned', summary.learnedCards)}
      {renderRow('In progress', summary.inProgressCards)}
      {renderRow('Term comprehension', '#')}
      {renderRow('Spoken/written', '#')}

      <TouchableOpacity
        style={styles.homeLink}
        onPress={() =>
          navigation.navigate('Home', {
            userId,
            username,
          })
        }
      >
        <Text style={styles.homeLinkText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProgressScreen;
