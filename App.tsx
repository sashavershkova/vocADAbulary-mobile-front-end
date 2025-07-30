import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './src/context/UserContext';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import TopicsScreen from './src/screens/TopicsScreen';
import TopicScreen from './src/screens/TopicScreen';
import FlashcardScreen from './src/screens/FlashcardScreen';
import WalletScreen from './src/screens/WalletScreen';
import LearnedFlashcardsScreen from './src/screens/LearnedFlashcardScreen';
import UserProgressSummaryScreen from './src/screens/UserProgressSummaryScreen';
import FallbackScreen from './src/screens/FallbackScreen';
import QuizScreen from './src/screens/QuizScreen';

import { useFonts } from 'expo-font';

// Load custom font
const customFonts = {
  ArchitectsDaughter: require('./src/assets/fonts/ArchitectsDaughter-Regular.ttf'),
};

// Define stack param list
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: { userId: number; username: string };
  Topics: undefined;
  Topic: { topicId: number; topicName: string };
  Flashcard: { flashcardId: number; topicId: number; topicName: string };
  Wallet: undefined;
  LearnedCards: undefined;
  Fallback: undefined;
  Quiz: undefined;
  UserProgressSummary: { userId: number; username: string }
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts(customFonts);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Topics" component={TopicsScreen} />
          <Stack.Screen name="Topic" component={TopicScreen} />
          <Stack.Screen name="Flashcard" component={FlashcardScreen} />
          <Stack.Screen name="Wallet" component={WalletScreen} />
          <Stack.Screen name="LearnedCards" component={LearnedFlashcardsScreen} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="Fallback" component={FallbackScreen} />
          <Stack.Screen
            name="UserProgressSummary"
            component={UserProgressSummaryScreen}
            options={{ title: 'PROGRESS' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}