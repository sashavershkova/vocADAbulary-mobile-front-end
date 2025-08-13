import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Animated, Image, View, Text, ActivityIndicator, Pressable, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useMockUser } from '../context/UserContext';
import { getUserProgressSummary } from '../api/summary';
import { getCreatedCount } from '../api/flashcards';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles/progressStyles';
import bluestick from '../assets/images/bluestick.png';
import PopoverHint from '../screens/PopoverHint';

type ProgressNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'Progress'
>;

type ProgressSummary = {
  totalCards: number;
  inProgressCards: number;
  learnedCards: number;
  quizzesPassed: number;
  sentenceProficiency: number;
  createdCount?: number;

};

const ProgressScreen = () => {
  const [hintVisible, setHintVisible] = useState(false);
  const stickScale = React.useRef(new Animated.Value(1)).current;
  const navigation = useNavigation<ProgressNavProp>();
  const { user } = useMockUser();
  const userId = user.id;
  const username = user.username;
  const initials = username?.charAt(0).toUpperCase() || '?';

  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const [data, created] = await Promise.all([
        getUserProgressSummary(userId),
        getCreatedCount()
      ]);

  const adjusted: ProgressSummary = {
    totalCards: data.totalCards,
    learnedCards: data.learnedCards,
    // keep “in progress = total - learned” UX rule
    inProgressCards: data.totalCards - data.learnedCards,
    quizzesPassed: data.quizzesPassed,
    sentenceProficiency: data.sentenceProficiency,
    createdCount: created
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
      headerStyle: { backgroundColor: '#f9bcdeff' },
      headerTitleStyle: {
        fontFamily: 'ArchitectsDaughter',
        fontSize: 30,
        color: '#246396ff'
      },
      headerLeft: () => (
        <Pressable
          onPress={() => {
            Animated.sequence([
              Animated.timing(stickScale, { toValue: 0.5, duration: 100, useNativeDriver: true }), // сжать вдвое
              Animated.timing(stickScale, { toValue: 1.0, duration: 100, useNativeDriver: true }), // вернуть норму
            ]).start(() => setHintVisible(true));
          }}
          style={{ marginLeft: 16, padding: 2, marginTop: -5 }}
        >
          <Animated.Image
            source={bluestick} 
            style={{ width: 30, height: 50, transform: [{ scale: stickScale }] }}
          />
        </Pressable>
      ),
      headerRight: () => (
        <View style={styles.userWrapper}>
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{initials}</Text>
          </View>
          <Text style={styles.userLabel}>User</Text>
        </View>
      )
    });
  }, [navigation, initials]);

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (!summary) return null;

  const renderButton = (
    icon: any,
    label: string,
    value: string | number
  ) => (
    <View style={styles.metricButton}>
      <Ionicons name={icon} size={24} color="#077bb4ff" />
      <Text style={styles.metricText}>
        {label}: {value}
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#f9bcdeff', '#b96bf1fe']}
      style={styles.container}
    >
      <View style={styles.buttonGroup}>
        {renderButton('stats-chart', 'Total Words', summary.totalCards)}
        {renderButton('bulb', 'Learned', summary.learnedCards)}
        {renderButton('trending-up', 'In Progress', summary.inProgressCards)}
        {renderButton('flash', 'Quizzes Passed', summary.quizzesPassed)}
        {renderButton(
          'school', // <-- changed icon to fit context accuracy.  used to be "chatbubble-ellipses"
          'Usage Accuracy', //too long, doesn't fit into button
          `${summary.sentenceProficiency.toFixed(0)}%`
        )}
        {renderButton(
          'create',
          'Created',
          String(summary.createdCount ?? '—')
        )}
      </View>

      <PopoverHint visible={hintVisible} onClose={() => setHintVisible(false)}>
        <Text style={styles.hintText}>
          This is your PERSONAL DATA CENTER — track every flashcard like it's a quantum particle.{"\n\n"}
          - LEARNED WORDS? You're basically a linguistic Einstein.{"\n\n"}
          - IN-PROGRESS cards? Still in a superposition.{"\n\n"}
          - QUIZZES passed? Let's just say you're not Penny.{"\n\n"}
          Now go forth, young Padawan of Knowledge!
        </Text>
      </PopoverHint>

      <View style={styles.buttonBar}>
        <Pressable
          onPress={() => navigation.navigate('Home')}
          style={({ pressed }) => [
            styles.navItem,            
            pressed && styles.navIconActive, 
          ]}
        >
          <Ionicons name="home" size={35} color="#97d0feff" />
          <Text style={styles.navText}>HOME</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

export default ProgressScreen;