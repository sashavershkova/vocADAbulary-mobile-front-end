// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { UserProvider } from './src/context/UserContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import TopicsScreen from './src/screens/TopicsScreen';
import TopicScreen from './src/screens/TopicScreen';
import { useFonts } from 'expo-font';

const customFonts = {
  'ArchitectsDaughter': require('./src/assets/fonts/ArchitectsDaughter-Regular.ttf'),
};

// Define the types for navigation params
export type RootStackParamList = {
  Login: undefined;
  Home: { userId: number };
  Topics: undefined;
  Topic: { topicId: number; topicName: string };
  Flashcard: { flashcardId: number; topicId: number; topicName: string };
  Fallback: undefined;
};

// Create the stack navigator with the type
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts(customFonts);

  if (!fontsLoaded) {
    return null; 
  }
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Topics" component={TopicsScreen} />
          <Stack.Screen name="Topic" component={TopicScreen} />
          <Stack.Screen name="Flashcard" component={FlashcardScreen} />
          {/* <Stack.Screen name="Fallback" component={() => <Text>Fallback Screen</Text>} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}