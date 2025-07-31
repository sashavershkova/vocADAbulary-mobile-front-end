// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import TopicsScreen from '../screens/TopicsScreen';
import TopicScreen from '../screens/TopicScreen';
import FlashcardScreen from '../screens/FlashcardScreen';
import ProgressScreen from '../screens/ProgressScreen';
import WalletScreen from '../screens/WalletScreen';
import QuizScreen from '../screens/QuizScreen';
import FallbackScreen from '../screens/FallbackScreen';
import LearnedFlashcardsScreen from '../screens/LearnedFlashcardScreen';
import NewFlashcardScreen from '../screens/NewFlashcardScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#E6E6FA', // 💜 лавандовый фон
        },
        headerTitleStyle: {
          fontFamily: 'ArchitectsDaughter',
          fontSize: 28,
          color: '#006400',
        },
        headerTitleAlign: 'center',
        headerBackVisible: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'HOME' }} />
      <Stack.Screen name="Topics" component={TopicsScreen} options={{ title: 'TOPICS' }} />
      <Stack.Screen name="Topic" component={TopicScreen} options={{ title: 'TOPIC' }} />
      <Stack.Screen name="Flashcard" component={FlashcardScreen} options={{ title: 'FLASHCARD' }} />
      <Stack.Screen name="Wallet" component={WalletScreen} options={{ title: 'WALLET' }} />
      <Stack.Screen name="LearnedCards" component={LearnedFlashcardsScreen} options={{ title: 'LEARNED' }} />
      <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'QUIZ' }} />
      <Stack.Screen name="Progress" component={ProgressScreen} options={{ title: 'PROGRESS' }} />
      <Stack.Screen name="Fallback" component={FallbackScreen} options={{ title: 'ERROR' }} />
      <Stack.Screen name="NewFlashcard" component={NewFlashcardScreen} options={{ title: 'NEW FLASHCARD' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;

