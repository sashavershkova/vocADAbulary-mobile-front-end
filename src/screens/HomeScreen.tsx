import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles/homeStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation, route }: Props) => {
  const { userId, username } = route.params;
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false, // removes back arrow
      title: username, // shows username in the header
    });
  }, [navigation, username]);

  return (
    <LinearGradient colors={['#f9f9b4a5', '#6cdc6cff']} style={styles.container}>
      {/* Progress — верхний левый */}
      <TouchableOpacity
        style={styles.progressButton}
        onPress={() => {
          navigation.navigate('Progress', { userId, username });
        }}
      >
        <Text style={styles.smallButtonText}>PROGRESS</Text>
      </TouchableOpacity>

      {/* Settings — чуть ниже справа */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.smallButtonText}>SETTINGS</Text>
      </TouchableOpacity>

      {/* Exit — нижний правый */}
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

      {/* LEARN — большая зелёная кнопка с правильным соотношением */}
      <TouchableOpacity
        style={styles.learnButton}
        onPress={() => navigation.navigate('Topics')}
      >
        <Text style={styles.learnText}>LEARN</Text>
      </TouchableOpacity>

      {/* Constructor — внизу по центру */}
      <TouchableOpacity style={styles.constructorButton}>
        <Text style={styles.buttonText}>CONSTRUCTOR</Text>
      </TouchableOpacity>

      {/* WALLET — левый нижний угол */}
      <TouchableOpacity
        style={styles.walletButton}
        onPress={() => navigation.navigate('Wallet')}
      >
        <Text style={styles.buttonText}>WALLET</Text>
      </TouchableOpacity>

      {/* Quiz — левая сторона */}
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



