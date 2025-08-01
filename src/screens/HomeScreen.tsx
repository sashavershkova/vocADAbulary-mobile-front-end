import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import styles from '../styles/homeStyles';
import { useMockUser } from '../context/UserContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const { user } = useMockUser();
  const userId = user.id;
  const username = user.username;
  const initials = username?.charAt(0).toUpperCase() || '?';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      title: 'HOME',
      headerRight: () => (
        <View style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: '#edf96cff',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}>
          <Text style={{
            color: '#2c6f33ff',
            fontWeight: 'bold',
            fontSize: 16,
          }}>
            {initials}
          </Text>
        </View>
      ),
    });
  }, [navigation, initials]);

  return (
    <LinearGradient
      colors={['#f9f9b4a5', '#6cdc6cff']}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.progressButton}
        onPress={() => navigation.navigate('Progress', { userId, username })}
      >
        <Text style={styles.smallButtonText}>PROGRESS</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.smallButtonText}>SETTINGS</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.exitButton}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        }
      >
        <Text style={styles.buttonText}>EXIT</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.learnButton}
        onPress={() => navigation.navigate('Topics')}
      >
        <Text style={styles.learnText}>LEARN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.constructorButton}>
        <Text style={styles.buttonText}>CONSTRUCTOR</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.walletButton}
        onPress={() => navigation.navigate('Wallet')}
      >
        <Text style={styles.buttonText}>WALLET</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quizButton}
        onPress={() => navigation.navigate('Quiz')}
      >
        <Text style={styles.buttonText}>QUIZ</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default HomeScreen;
