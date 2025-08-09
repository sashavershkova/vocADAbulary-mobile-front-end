import React, { useLayoutEffect, useState } from 'react';
import { Image, View, Text, Pressable, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import styles from '../styles/homeStyles';
import { useMockUser } from '../context/UserContext';
import QuizIcon from '../assets/images/quiz.png';
import WalletIcon from '../assets/images/wallet.png';
import ProgressIcon from '../assets/images/progress.png';
import SettingsIcon from '../assets/images/settings.png';
import ExitIcon from '../assets/images/exit.png';
import greenstick from '../assets/images/greenstick.png';
// import bluestick from '../assets/images/bluestick.png';
import PopoverHint from '../screens/PopoverHint';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const [hintVisible, setHintVisible] = useState(false);
  const stickScale = React.useRef(new Animated.Value(1)).current;
  
  // const isGreen = true; // пока вручную
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
        fontFamily: 'ArchitectsDaughter',
        fontSize: 36,
        color: '#2c6f33',
      },
      headerLeft: () => (
      <Pressable
        onPress={() => {
          Animated.sequence([
            Animated.timing(stickScale, { toValue: 0.5, duration: 100, useNativeDriver: true }), // сжать вдвое
            Animated.timing(stickScale, { toValue: 1.0, duration: 100, useNativeDriver: true }), // вернуть норму
          ]).start(() => setHintVisible(true));
        }}
        style={{ marginLeft: 16, padding: 2 }}
      >
        <Animated.Image
          source={greenstick} // всегда синий
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
      ),
    });
  }, [navigation, initials]);

  return (
  <LinearGradient
    colors={['#abf5ab64', '#347134bc']}
    style={styles.container}
  >
    <PopoverHint visible={hintVisible} onClose={() => setHintVisible(false)}>
      <Text style={styles.text}>
        Do you have your TECH VOICE ready?{"\n\n"}
        This is where you dive into learning, tweak your settings, track your nerdy progress… and all that jazz!{"\n"}
        (Penny would be proud. Sheldon? Skeptical, but intrigued.){"\n\n"}

        Head to LEARN to boost your vocab like a true tech wizard.{"\n\n"}
        Test your skills in QUIZ and CONSTRUCTOR — no whiteboards or equations required.{"\n\n"}
        Stash your favorite words in the WALLET, because knowledge is the new collectible.{"\n\n"}
        Spy on your progress in PROGRESS.
        (like Sheldon checking bus schedules — obsessively and with scientific precision).{"\n\n"}
        And if you're feeling bold, mess with your voice in SETTINGS — we won't tell Leonard.{"\n\n"}

        Because hey — training might be tough, but when the tech battle begins, you'll be ready.{"\n"}
        Bazinga, genius!
      </Text>
    </PopoverHint>

    <Pressable
      style={({ pressed }) => [styles.learnButton, pressed && styles.learnButtonActive]}
      onPress={() => navigation.navigate('Topics')}
    >
      <Text style={styles.learnText}>LEARN</Text>
    </Pressable>

    <Pressable
      style={({ pressed }) => [styles.progressButton, pressed && styles.progressButtonActive]}
      onPress={() => navigation.navigate('Progress', { userId, username })}
    >
      <Text style={styles.smallButtonText}>PROGRESS</Text>
      <Image source={ProgressIcon} style={styles.progressIcon} />
    </Pressable>

    <Pressable
      style={({ pressed }) => [styles.quizButton, pressed && styles.quizButtonActive]}
      onPress={() => navigation.navigate('Quiz')}
    >
      <Text style={styles.buttonText}>QUIZ</Text>
      <Image source={QuizIcon} style={styles.quizIcon} />
    </Pressable>

    <Pressable
      style={({ pressed }) => [styles.walletButton, pressed && styles.walletButtonActive]}
      onPress={() => navigation.navigate('Wallet')}
    >
      <Text style={styles.buttonText}>WALLET</Text>
      <Image source={WalletIcon} style={styles.walletIcon} />
    </Pressable>

    <Pressable
      style={({ pressed }) => [styles.constructorButton, pressed && styles.constructorButtonActive]}
      onPress={() => navigation.navigate('Constructor')}
    >
      <Text style={styles.buttonText}>CONSTRUCTOR</Text>
      <Image source={QuizIcon} style={styles.quizIcon} />
    </Pressable>

    <Pressable
      style={({ pressed }) => [styles.settingsButton, pressed && styles.settingsButtonActive]}
      onPress={() => navigation.navigate('Settings')}
    >
      <Text style={styles.smallButtonText}>SETTINGS</Text>
      <Image source={SettingsIcon} style={styles.settingsIcon} />
    </Pressable>

    <Pressable
      style={({ pressed }) => [styles.exitButton, pressed && styles.exitButtonActive]}
      onPress={() =>
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      }
    >
      <Text style={styles.buttonText}>EXIT</Text>
      <Image source={ExitIcon} style={styles.exitIcon} />
    </Pressable>
  </LinearGradient>
);

};

export default HomeScreen;
