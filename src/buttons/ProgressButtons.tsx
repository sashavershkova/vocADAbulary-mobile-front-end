import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  summary: {
    totalCards: number;
    inProgressCards: number;
    learnedCards: number;
    termComprehension: number;
    spokenWritten: number;
  };
};

const ProgressButtons = ({ summary }: Props) => {
  const navigation = useNavigation<NavigationProp>();

  const renderButton = (icon: any, label: string, value: string | number) => (
    <TouchableOpacity style={styles.metricButton}>
      <Ionicons name={icon} size={24} color="#077bb4ff" />
      <Text style={styles.metricText}>
        {label}: {value}
      </Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#f9bcdeff', '#e890f8ff']}
      style={styles.container}
    >
      <View style={styles.buttonGroup}>
        {renderButton('stats-chart', 'Total Words', summary.totalCards)}
        {renderButton('bulb', 'Learned', summary.learnedCards)}
        {renderButton('trending-up', 'In Progress', summary.inProgressCards)}
        {renderButton('flash', 'Comprehension', summary.termComprehension)}
        {renderButton('chatbubble-ellipses', 'Spoken/Written', summary.spokenWritten)}
        {renderButton('create', 'Created', '—')}
      </View>

      <View style={styles.buttonBar}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() =>
            navigation.navigate('Home', {
              userId: 1,
              username: 'Guest',
            })
          }
        >
          <Ionicons name="home" size={28} color='#246396ff' />
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buttonGroup: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  metricButton: {
    width: '85%',
    backgroundColor: '#87CEFA', // голубая заливка
    borderRadius: 40,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#4682B4',
  },
  metricText: {
    fontSize: 20,
    fontFamily: 'ArchitectsDaughter',
    color: '#246396ff',
  },
  buttonBar: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  homeButton: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'ArchitectsDaughter',
    color: '#246396ff',
    marginTop: 4,
  },
});

export default ProgressButtons;
