// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './src/context/UserContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import TopicsScreen from './src/screens/TopicsScreen';
import TopicScreen from './src/screens/TopicScreen';

// Define the types for navigation params
export type RootStackParamList = {
  Login: undefined;
  Home: { userId: number };
  Topics: undefined;
  Topic: { topicId: number; topicName: string };
  // Flashcard: { flashcardId: number; topicId: number; topicName: string };
  Flashcard: { flashcardId: number; topicId: number};
  // ...other screens
};


// Create the stack navigator with the type
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Topics" component={TopicsScreen} />
          <Stack.Screen name="Topic" component={TopicScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}