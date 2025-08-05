// src/navigation/AppNavigator.tsx
import React, { createRef } from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// screens import
import SplashScreen from '../screens/SplashScreen';
import SettingsScreen from '../screens/SettingsScreen';
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
import ConstructorScreen from '../screens/ConstructorScreen';
import SearchScreen from '../screens/SearchScreen';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// создаём ссылку на NavigationContainer
export const navigationRef = createRef<
  NavigationContainerRef<RootStackParamList>
>();

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <NavigationContainer
    ref={navigationRef}
    onUnhandledAction={(action) => {
      if (action.type === 'NAVIGATE' || action.type === 'PUSH') {
        navigationRef.current?.navigate('Fallback');
      }
    }}
  >
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: { backgroundColor: '#6cdc6cb5' },
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
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: true }} />
      <Stack.Screen name="Topics" component={TopicsScreen} options={{ title: 'TOPICS' }} />
      <Stack.Screen name="Topic" component={TopicScreen} options={{ title: 'TOPIC' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'SETTINGS' }} />
      <Stack.Screen 
      name="Flashcard" 
      component={FlashcardScreen} 
      options={({ navigation }) => ({
          title: 'FLASHCARDS',
          headerBackVisible: false, 
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
              <Ionicons name="arrow-back" size={28} color="#2c6f33" />
            </TouchableOpacity>
        ),
        })}
      />
      <Stack.Screen name="Wallet" component={WalletScreen} options={{ title: 'WALLET' }} />
      <Stack.Screen
        name="LearnedCards"
        component={LearnedFlashcardsScreen}
        options={({ navigation }) => ({
          title: 'LEARNED',
          headerBackVisible: false, 
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
              <Ionicons name="arrow-back" size={28} color="#246396" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'QUIZ' }} />
      <Stack.Screen name="Progress" component={ProgressScreen} options={{ title: 'PROGRESS' }} />
      <Stack.Screen name="Fallback" component={FallbackScreen} options={{ title: 'ERROR' }} />
      <Stack.Screen 
      name="NewFlashcard" 
      component={NewFlashcardScreen} 
      options={({ navigation }) => ({
          title: 'NEWFLASHCARDS',
          headerBackVisible: false, 
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
              <Ionicons name="arrow-back" size={28} color="#2c6f33" />
            </TouchableOpacity>
        ),
        })} 
      />
      <Stack.Screen name="Constructor" component={ConstructorScreen} options={{ title: 'CONSTRUCTOR' }} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'SEARCH' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;

