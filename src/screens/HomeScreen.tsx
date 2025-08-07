import React, { useLayoutEffect } from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import styles from '../styles/homeStyles';
import { useMockUser } from '../context/UserContext';
import LearnIcon from '../assets/images/stickman.png';
import QuizIcon from '../assets/images/quiz.png';
import WalletIcon from '../assets/images/wallet.png';
import ProgressIcon from '../assets/images/progress.png';
import SettingsIcon from '../assets/images/settings.png';
import ExitIcon from '../assets/images/exit.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const { user } = useMockUser();
  const userId = user.id;
  const username = user.username;
  const initials = username?.charAt(0).toUpperCase() || '?';

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'HOME',
      headerBackVisible: false,
      headerStyle: {
        backgroundColor: '#abf5ab64',
      },
      headerTitleStyle: {
        fontFamily: 'ArchitectsDaughter-Regular',
        fontSize: 36,
        color: '#2c6f33',
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
  }, [navigation, initials]);

  return (
    <LinearGradient
      colors={['#abf5ab64', '#347134bc']}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.learnButton}
        onPress={() => navigation.navigate('Topics')}
      >
        <Text style={styles.learnText}>LEARN</Text>
        <Image source={LearnIcon} style={styles.learnIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.progressButton}
        onPress={() => navigation.navigate('Progress', { userId, username })}
      >
        <Text style={styles.smallButtonText}>PROGRESS</Text>
        <Image source={ProgressIcon} style={styles.progressIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quizButton}
        onPress={() => navigation.navigate('Quiz')}
      >
        <Text style={styles.buttonText}>QUIZ</Text>
        <Image source={QuizIcon} style={styles.quizIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.walletButton}
        onPress={() => navigation.navigate('Wallet')}
      >
        <Text style={styles.buttonText}>WALLET</Text>
        <Image source={WalletIcon} style={styles.walletIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.constructorButton}
        onPress={() => navigation.navigate('Constructor')}
      >
        <Text style={styles.buttonText}>CONSTRUCTOR</Text>
        <Image source={QuizIcon} style={styles.quizIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.smallButtonText}>SETTINGS</Text>
        <Image source={SettingsIcon} style={styles.settingsIcon} />
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
        <Image source={ExitIcon} style={styles.exitIcon} />
      </TouchableOpacity>

    </LinearGradient>
  );
};

export default HomeScreen;
